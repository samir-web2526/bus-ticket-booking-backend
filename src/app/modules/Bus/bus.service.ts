import { prisma } from "../../../lib/prisma";

const createBus = async (payload: any) => {
  const { totalSeats, ...busData } = payload;
  
  const result = await prisma.$transaction(async (tx) => {
    const bus = await tx.bus.create({
      data: {
        ...busData,
        totalSeats,
      },
    });

    // Generate seats automatically
    const seats = [];
    for (let i = 1; i <= totalSeats; i++) {
      const row = Math.ceil(i / 4);
      const column = (i - 1) % 4 + 1;
      const seatNumber = `${String.fromCharCode(64 + row)}${column}`;
      
      seats.push({
        busId: bus.id,
        number: seatNumber,
        type: 'standard',
        row,
        column,
      });
    }

    await tx.seat.createMany({
      data: seats,
    });

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
