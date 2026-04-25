import status from "http-status";
import { BookingStatus, UserRole } from "../../../generated/enums";
import { prisma } from "../../../lib/prisma";
import AppError from "../../errorHelpers/AppError";
import { userSelectFields } from "../User/user.constant";
import { paginationHelper } from "../../sharedfile";

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
      throw new AppError(status.NOT_FOUND, 'No active seat locks found. Please lock seats before booking.');
    }

    const totalFare = activeLocks.reduce((sum, lock) => sum + lock.seat.price, 0);

    const newBooking = await tx.booking.create({
      data: {
        userId,
        scheduleId,
        totalFare,
        status: BookingStatus.PENDING,
      },
    });

    await tx.bookingSeat.createMany({
      data: activeLocks.map((lock) => ({
        bookingId: newBooking.id,
        seatId: lock.seatId,
      })),
    });

    await tx.seatLock.deleteMany({
      where: {
        userId,
        scheduleId,
      },
    });

    const booking = await tx.booking.findUnique({
      where: { id: newBooking.id },
      include: {
        user: {
          select: userSelectFields
        },
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
    return booking;
  });
  return result;
};

const getMyBookings = async (userId: string) => {
  const result = await prisma.booking.findMany({
    where: { userId },
    orderBy: {
      createdAt: 'desc'
    },
    include: {
      bookingSeats: {
        include: { seat: true },
      },
      schedule: {
        include: {
          bus: true,
          route: true,
        },
      },
    },
  });

  if (result.length === 0) {
    throw new AppError(status.NOT_FOUND, 'No bookings found.');
  }

  return result;
};

const getAllBookings = async (query: any) => {
  const { status: bookingStatus } = query;
  const { page, limit, skip, sortBy, sortOrder } = paginationHelper.calculatePagination(query);
  const andConditions: any[] = [];
  if (bookingStatus) {
    andConditions.push({
      status: bookingStatus as BookingStatus
    })
  };
  const whereConditions = { AND: andConditions };

  const result = await prisma.booking.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder
    },
    include: {
      user: {
        select: userSelectFields
      },
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

  if (result.length === 0) {
    throw new AppError(status.NOT_FOUND, 'No bookings found.');
  };

  const total = await prisma.booking.count({
    where: whereConditions,
  });
  return {
    meta: {
      page,
      limit,
      total
    },
    data: result
  }
};

const getOperatorBookings = async (
  operatorId: string,
  query: any
) => {

  const { status: bookingStatus } = query;

  const {
    page,
    limit,
    skip,
    sortBy,
    sortOrder
  } = paginationHelper.calculatePagination(query);

  const andConditions: any[] = [];

  // operator's own buses bookings filter
  andConditions.push({
    schedule: {
      bus: {
        operatorId
      }
    }
  });

  // optional booking status filter
  if (bookingStatus) {
    andConditions.push({
      status: bookingStatus as BookingStatus
    });
  }

  const whereConditions = {
    AND: andConditions
  };

  const result = await prisma.booking.findMany({

    where: whereConditions,

    skip,
    take: limit,

    orderBy: {
      [sortBy]: sortOrder
    },

    include: {

      user: {
        select: userSelectFields
      },

      bookingSeats: {
        include: {
          seat: true
        }
      },

      schedule: {
        include: {
          bus: true,
          route: true
        }
      }

    }

  });

  if (result.length === 0) {

    throw new AppError(
      status.NOT_FOUND,
      "No bookings found."
    );

  }

  const total = await prisma.booking.count({
    where: whereConditions
  });

  return {

    meta: {
      page,
      limit,
      total
    },

    data: result

  };
};

const getBookingById = async (bookingId: string, userId: string, role: UserRole) => {
  const result = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      user: {
        select: userSelectFields,
      },
      bookingSeats: {
        include: { seat: true },
      },
      schedule: {
        include: {
          bus: true,
          route: true,
        },
      },
    },
  });

  if (!result) {
    throw new AppError(status.NOT_FOUND, 'Booking not found.');
  }

  const isAdminOrOperator = role === UserRole.ADMIN || role === UserRole.OPERATOR;
  const isOwnBooking = result.userId === userId;

  if (!isAdminOrOperator && !isOwnBooking) {
    throw new AppError(status.FORBIDDEN, 'You are not authorized to view this booking.');
  }

  return result;
};

const cancelBooking = async (bookingId: string, userId: string) => {

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
  });

  if (!booking) {
    throw new AppError(status.NOT_FOUND, 'Booking not found.');
  }

  if (booking.userId !== userId) {
    throw new AppError(status.FORBIDDEN, 'You are not authorized to cancel this booking.');
  }

  if (booking.status !== BookingStatus.PENDING) {
    throw new AppError(status.BAD_REQUEST, 'Only pending bookings can be cancelled.');
  }

  const result = await prisma.booking.update({
    where: { id: bookingId },
    data: { status: BookingStatus.CANCELLED },
  });

  return result;
};

export const BookingService = {
  createBooking,
  getMyBookings,
  getAllBookings,
  getOperatorBookings,
  getBookingById,
  cancelBooking,
};
