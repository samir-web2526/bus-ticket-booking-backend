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
  const lock = await prisma.seatLock.findUnique({
    where: { id },
  });

  if (!lock) {
    throw new AppError(status.NOT_FOUND, 'Seat lock not found');
  }

  if (lock.userId !== userId) {
    throw new AppError(status.FORBIDDEN, 'You are not authorized to release this seat lock');
  }
  const result = await prisma.seatLock.delete({
    where: {
      id,
      userId,
    },
  });
  return result;
};

const releaseAllLocks = async (scheduleId: string, userId: string) => {
  const locks = await prisma.seatLock.findMany({
    where: { scheduleId, userId },
  });

  if (locks.length === 0) {
    throw new AppError(status.NOT_FOUND, 'Seat lock not found');
  };

  await prisma.seatLock.deleteMany({
    where: { scheduleId, userId },
  });
  return locks;
};

export const SeatLockService = {
  lockSeats,
  releaseLock,
  releaseAllLocks,
};
