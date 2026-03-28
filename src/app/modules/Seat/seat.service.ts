import { prisma } from "../../../lib/prisma";

const getSeatLayoutByBusId = async (busId: string) => {
  const result = await prisma.seat.findMany({
    where: { busId },
    orderBy: [
      { row: 'asc' },
      { column: 'asc' },
    ],
  });
  return result;
};

const getAvailableSeats = async (scheduleId: string) => {
  const schedule = await prisma.schedule.findUnique({
    where: { id: scheduleId },
    include: { bus: true },
  });

  if (!schedule) {
    throw new Error('Schedule not found');
  }

  // Get all seats for the bus
  const allSeats = await prisma.seat.findMany({
    where: { busId: schedule.busId },
  });

  // Get currently locked seats (that haven't expired)
  const lockedSeats = await prisma.seatLock.findMany({
    where: {
      scheduleId,
      expiresAt: { gte: new Date() },
    },
    select: { seatId: true },
  });

  const lockedSeatIds = lockedSeats.map(ls => ls.seatId);

  // Mark seats as available if not in lockedSeatIds
  const seatsWithStatus = allSeats.map(seat => ({
    ...seat,
    isAvailable: !lockedSeatIds.includes(seat.id),
  }));

  return seatsWithStatus;
};

export const SeatService = {
  getSeatLayoutByBusId,
  getAvailableSeats,
};
