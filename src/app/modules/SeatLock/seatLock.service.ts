import status from "http-status";
import { prisma } from "../../../lib/prisma";
import AppError from "../../errorHelpers/AppError";
import { BookingStatus } from "../../../generated/enums";
import { TSeatLock } from "./seatLock.interface";

const lockSeats = async (payload: TSeatLock, userId: string) => {
  const { seatIds, scheduleId } = payload;
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  const result = await prisma.$transaction(async (tx) => {

    const existingLocks = await tx.seatLock.findMany({
      where: {
        seatId: { in: seatIds },
        scheduleId,
        expiresAt: { gte: new Date() },
      },
    });

    if (existingLocks.length > 0) {
      throw new AppError(status.BAD_REQUEST, 'Some seats are already locked');
    }

    const bookedSeats = await tx.bookingSeat.findMany({
      where: {
        seatId: { in: seatIds },
        booking: {
          scheduleId,
          status: { in: [BookingStatus.PENDING, BookingStatus.CONFIRMED] },
        },
      },
    });

    if (bookedSeats.length > 0) {
      throw new AppError(status.BAD_REQUEST, 'Some seats are already booked');
    }

    await tx.seatLock.createMany({
      data: seatIds.map(seatId => ({
        seatId,
        scheduleId,
        userId,
        expiresAt,
      })),
    });

    return await tx.seatLock.findMany({
      where: { userId, scheduleId, expiresAt: { gte: new Date() } },
      include: { seat: true },
    });
  });

  return result;
};

const releaseLock = async (id: string, userId: string) => {
  const result = await prisma.seatLock.deleteMany({
    where: {
      id,
      userId,
    },
  });
  return result;
};

const cleanupExpiredLocks = async () => {
  const result = await prisma.seatLock.deleteMany({
    where: {
      expiresAt: { lt: new Date() },
    },
  });
  return result;
};

export const SeatLockService = {
  lockSeats,
  releaseLock,
  cleanupExpiredLocks,
};
