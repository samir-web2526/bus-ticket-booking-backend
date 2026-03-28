import { prisma } from "../../../lib/prisma";

const createSchedule = async (payload: any) => {
  const result = await prisma.schedule.create({
    data: payload,
  });
  return result;
};

const getAllSchedules = async (filters: any) => {
  const { sourceCity, destinationCity, date } = filters;
  
  const where: any = {};
  
  if (sourceCity || destinationCity) {
    where.route = {};
    if (sourceCity) where.route.sourceCity = sourceCity;
    if (destinationCity) where.route.destinationCity = destinationCity;
  }
  
  if (date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    
    where.departure = {
      gte: startOfDay,
      lte: endOfDay,
    };
  }

  const result = await prisma.schedule.findMany({
    where,
    include: {
      bus: true,
      route: true,
    },
  });
  return result;
};

const getScheduleById = async (id: string) => {
  const result = await prisma.schedule.findUnique({
    where: { id },
    include: {
      bus: true,
      route: true,
    },
  });
  return result;
};

const updateSchedule = async (id: string, payload: any) => {
  const result = await prisma.schedule.update({
    where: { id },
    data: payload,
  });
  return result;
};

const deleteSchedule = async (id: string) => {
  const result = await prisma.schedule.delete({
    where: { id },
  });
  return result;
};

export const ScheduleService = {
  createSchedule,
  getAllSchedules,
  getScheduleById,
  updateSchedule,
  deleteSchedule,
};
