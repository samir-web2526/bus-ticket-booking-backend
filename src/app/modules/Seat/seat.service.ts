import status from "http-status";
import { prisma } from "../../../lib/prisma";
import AppError from "../../errorHelpers/AppError";
import { BookingStatus } from "../../../generated/enums";

const getAvailableSeats = async (scheduleId: string, userId: string) => {
  const schedule = await prisma.schedule.findUnique({
    where: { id: scheduleId },
    include: { bus: true },
  });

  if (!schedule) {
    throw new AppError(status.NOT_FOUND, 'No bus found for this schedule');
  }

  const allSeats = await prisma.seat.findMany({
    where: { busId: schedule.busId },
  });
  const lockedSeats = await prisma.seatLock.findMany({
    where: {
      scheduleId,
      expiresAt: { gte: new Date() },
    },
    select: { seatId: true, userId: true }, // ✅ userId যোগ করো
  });


  const bookedSeats = await prisma.bookingSeat.findMany({
    where: {
      booking: {
        scheduleId,
        status: { in: [BookingStatus.PENDING, BookingStatus.CONFIRMED] },
      },
    },
    select: { seatId: true },
  });

  const lockedSeatIds = lockedSeats
    .filter(ls => ls.userId !== userId)
    .map(ls => ls.seatId);
  const bookedSeatIds = bookedSeats.map(bs => bs.seatId);

  const seatsWithStatus = allSeats.map(seat => ({
    ...seat,
    isAvailable: !lockedSeatIds.includes(seat.id) && !bookedSeatIds.includes(seat.id),
  }));

  return seatsWithStatus;
};

export const SeatService = {
  getAvailableSeats,
};
