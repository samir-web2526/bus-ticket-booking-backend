import { prisma } from "../../../lib/prisma";

const lockSeats = async (payload: { seatIds: string[], scheduleId: string, userId: string }) => {
  const { seatIds, scheduleId, userId } = payload;
  
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

  const result = await prisma.$transaction(async (tx) => {
    // 1. Check if any of these seats are already locked and not expired
    const existingLocks = await tx.seatLock.findMany({
      where: {
        seatId: { in: seatIds },
        scheduleId,
        expiresAt: { gte: new Date() },
      },
    });

    if (existingLocks.length > 0) {
      throw new Error('Some seats are already locked');
    }

    // 2. Create new locks
    const locks = seatIds.map(seatId => ({
      seatId,
      scheduleId,
      userId,
      expiresAt,
    }));

    await tx.seatLock.createMany({
      data: locks,
    });

    return locks;
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
