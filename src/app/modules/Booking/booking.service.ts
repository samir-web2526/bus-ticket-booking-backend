import { BookingStatus } from "../../../generated/enums";
import { prisma } from "../../../lib/prisma";

const createBooking = async (payload: { scheduleId: string, userId: string, }) => {
  const { scheduleId, userId } = payload;

  const result = await prisma.$transaction(async (tx) => {
    const activeLocks = await tx.seatLock.findMany({
      where: {
        userId,
        scheduleId,
        expiresAt: { gte: new Date() },
      },
      include: {
        seat: true,
      }
    });

    if (activeLocks.length === 0) {
      throw new Error('No active seat locks found. Please lock seats before booking.');
    }


    const totalFare = activeLocks.reduce((sum, lock) => sum + lock.seat.price, 0);

    // 2. Create the booking
    const booking = await tx.booking.create({
      data: {
        userId,
        scheduleId,
        totalFare,
        status: BookingStatus.PENDING,
      },
    });

    await tx.bookingSeat.createMany({
      data: activeLocks.map((lock) => ({
        bookingId: booking.id,
        seatId: lock.seatId,
      })),
    });

    await tx.seatLock.deleteMany({
      where: {
        userId,
        scheduleId,
      },
    });

    return await tx.booking.findUnique({
      where: { id: booking.id },
      include: {
        user: true,
        bookingSeats: {
          include: {
            seat: true
          }
        },
        schedule: {
          include: {
            bus: true,
            route: true,
          },
        },
      },
    });

  });

  return result;
};

const getMyBookings = async (userId: string) => {
  const result = await prisma.booking.findMany({
    where: { userId },
    include: {
      schedule: {
        include: {
          bus: true,
          route: true,
        },
      },
    },
  });
  return result;
};

const getAllBookings = async () => {
  const result = await prisma.booking.findMany({
    include: {
      user: true,
      schedule: {
        include: {
          bus: true,
          route: true,
        },
      },
    },
  });
  return result;
};

const getBookingById = async (id: string) => {
  const result = await prisma.booking.findUnique({
    where: { id },
    include: {
      user: true,
      schedule: {
        include: {
          bus: true,
          route: true,
        },
      },
    },
  });
  return result;
};

const cancelBooking = async (id: string, userId: string) => {
  const result = await prisma.booking.updateMany({
    where: {
      id,
      userId,
      status: BookingStatus.PENDING,
    },
    data: {
      status: BookingStatus.CANCELLED,
    },
  });
  return result;
};

export const BookingService = {
  createBooking,
  getMyBookings,
  getAllBookings,
  getBookingById,
  cancelBooking,
};
