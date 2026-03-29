import status from "http-status";
import { SeatType, UserRole } from "../../../generated/enums";
import { prisma } from "../../../lib/prisma";
import AppError from "../../errorHelpers/AppError";
import { paginationHelper } from "../../sharedfile";
import { busSearchableFields } from "./bus.constant";
import { TBus } from "./bus.interface";

const createBus = async (payload: TBus, operatorId: string) => {
  const { totalSeats, vipSeats = 0, vipPrice = 0, deluxeSeats = 0, deluxePrice = 0, ...busData } = payload;

  const result = await prisma.$transaction(async (tx) => {
    const bus = await tx.bus.create({
      data: { ...busData, totalSeats, operatorId },
    });

    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const seats = [];

    const getSeatType = (i: number): SeatType => {
      if (i < vipSeats) return SeatType.VIP;
      if (i < vipSeats + deluxeSeats) return SeatType.DELUXE;
      return SeatType.STANDARD;
    };
    const getSeatPrice = (type: SeatType): number => {
      if (type === SeatType.VIP) return vipPrice;
      if (type === SeatType.DELUXE) return deluxePrice;
      return busData.pricePerSeat;
    };

    for (let i = 0; i < totalSeats; i++) {
      const rowIndex = Math.floor(i / 4);
      const col = (i % 4) + 1;

      seats.push({
        busId: bus.id,
        number: `${letters[rowIndex]}${col}`,
        type: getSeatType(i),
        row: rowIndex + 1,
        column: col,
        price: getSeatPrice(getSeatType(i)),
      });
    }

    await tx.seat.createMany({ data: seats });
    return bus;
  });

  return result;
};

const getAllBuses = async (query: any) => {
  const { search, type, isActive } = query;
  const { page, limit, skip, sortBy, sortOrder } = paginationHelper.calculatePagination(query);

  const andConditions: any[] = [];

  if (search) {
    andConditions.push({
      OR: busSearchableFields.map((field) => ({
        [field]: {
          contains: search,
          mode: 'insensitive',
        },
      })),
    });
  }
  if (type) {
    andConditions.push({
      type: type
    })
  }

  if (isActive !== undefined) {
    andConditions.push({
      isActive: isActive === 'true'
    })
  }

  andConditions.push({
    isDeleted: false
  })
  const whereConditions = { AND: andConditions }

  const result = await prisma.bus.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder
    },
    include: {
      operator: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          profileImage: true,
        }
      }
    },
  });

  const total = await prisma.bus.count({
    where: whereConditions
  });

  return {
    data: result,
    meta: {
      page,
      limit,
      total
    }
  }
};

const getBusById = async (busId: string) => {
  const result = await prisma.bus.findUnique({
    where: { id: busId, isDeleted: false },
    include: {
      operator: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          profileImage: true,
        },
      },
      seats: {
        select: {
          id: true,
          number: true,
          type: true,
          row: true,
          column: true,
          price: true,
        },
      },
    },
  });

  const seatSummary = {
    VIP: result?.seats.filter((s) => s.type === SeatType.VIP).length || 0,
    DELUXE: result?.seats.filter((s) => s.type === SeatType.DELUXE).length || 0,
    STANDARD: result?.seats.filter((s) => s.type === SeatType.STANDARD).length || 0,
  };

  return { ...result, seatSummary };
};

const updateBus = async (id: string, userId: string, role: UserRole, payload: any) => {
  const { operatorId, pricePerSeat, vipPrice, deluxePrice, ...updateBusData } = payload;

  const bus = await prisma.bus.findUnique({
    where: { id, isDeleted: false }
  });
  if (!bus) {
    throw new AppError(status.NOT_FOUND, 'Bus not found.');
  }

  if (role === UserRole.OPERATOR && bus.operatorId !== userId) {
    throw new AppError(status.FORBIDDEN, 'You are not authorized to update this bus.');
  }

  return await prisma.$transaction(async (tx) => {
    const updatedBus = await tx.bus.update({
      where: { id },
      data: {
        ...updateBusData,
        pricePerSeat,
        ...(role === UserRole.ADMIN && { operatorId }),
      },
    });

    if (pricePerSeat) {
      await tx.seat.updateMany({
        where: { busId: id, type: SeatType.STANDARD },
        data: { price: pricePerSeat },
      });
    }

    if (vipPrice) {
      await tx.seat.updateMany({
        where: { busId: id, type: SeatType.VIP },
        data: { price: vipPrice },
      });
    }

    if (deluxePrice) {
      await tx.seat.updateMany({
        where: { busId: id, type: SeatType.DELUXE },
        data: { price: deluxePrice },
      });
    }

    return updatedBus;
  });
};

const deleteBus = async (id: string, userId: string, role: UserRole) => {

  const bus = await prisma.bus.findUnique({ where: { id, isDeleted: false } });
  if (!bus) {
    throw new AppError(status.NOT_FOUND, 'Bus not found.');
  }

  if (role === UserRole.OPERATOR && bus.operatorId !== userId) {
    throw new AppError(status.FORBIDDEN, 'You are not authorized to delete this bus.');
  }

  const result = await prisma.bus.update({
    where: { id },
    data: { isDeleted: true },
  });

  return result;
};

export const BusService = {
  createBus,
  getAllBuses,
  getBusById,
  updateBus,
  deleteBus,
};
