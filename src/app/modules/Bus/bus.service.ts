import { SeatType } from "../../../generated/enums";
import { prisma } from "../../../lib/prisma";
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

const getAllBuses = async () => {
  const result = await prisma.bus.findMany({
    include: {
      operator: true,
    },
  });
  return result;
};

const getBusById = async (id: string) => {
  const result = await prisma.bus.findUnique({
    where: { id },
    include: {
      operator: true,
      seats: true,
    },
  });
  return result;
};

const updateBus = async (id: string, payload: any) => {
  const result = await prisma.bus.update({
    where: { id },
    data: payload,
  });
  return result;
};

const deleteBus = async (id: string) => {
  const result = await prisma.bus.delete({
    where: { id },
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
