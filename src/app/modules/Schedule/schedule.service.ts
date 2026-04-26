import status from "http-status";
import { prisma } from "../../../lib/prisma";
import AppError from "../../errorHelpers/AppError";
import { paginationHelper } from "../../sharedfile";
import { TSchedule } from "./schedule.interface";

const createSchedule = async (payload: TSchedule, operatorId: string) => {

  const bus = await prisma.bus.findUnique({
    where: { id: payload.busId },
    select: { operatorId: true, isDeleted: true, isActive: true },
  });

  if (!bus) {
    throw new AppError(status.NOT_FOUND, 'Bus not found');
  }

  if (bus.isDeleted || !bus.isActive) {
    throw new AppError(status.BAD_REQUEST, 'Bus is not available for scheduling');
  }

  if (bus.operatorId !== operatorId) {
    throw new AppError(status.FORBIDDEN, 'You are not authorized to schedule this bus');
  }

  if (new Date(payload.departure) < new Date()) {
    throw new AppError(status.BAD_REQUEST, 'Departure time cannot be in the past');
  }

  if (new Date(payload.arrival) <= new Date(payload.departure)) {
    throw new AppError(status.BAD_REQUEST, 'Arrival time must be after departure time');
  }

  const result = await prisma.schedule.create({
    data: {
      ...payload,
      status: payload.status ?? 'scheduled',
    },
    include: {
      bus: true,
      route: true,
    },
  });

  return result;
};

const getAllSchedules = async (query: any) => {
  const { sourceCity, destinationCity, date, busType, search } = query;
  const { page, limit, skip, sortBy, sortOrder } = paginationHelper.calculatePagination(query);

  const startDate = date ? new Date(new Date(date).setHours(0, 0, 0, 0)) : undefined;
  const endDate = date ? new Date(new Date(date).setHours(23, 59, 59, 999)) : undefined;


  const andConditions: any[] = [];

  if (search) {
    andConditions.push({
      OR: [
        { bus: { name: { contains: search, mode: 'insensitive' } } },
      ],
    });
  }


  // ✅ FIXED ROUTE FILTER
  if (sourceCity || destinationCity) {
    andConditions.push({
      route: {
        ...(sourceCity && {
          sourceCity: {
            contains: sourceCity,
            mode: "insensitive",
          },
        }),
        ...(destinationCity && {
          destinationCity: {
            contains: destinationCity,
            mode: "insensitive",
          },
        }),
      },
    });
  }

  if (busType && busType !== 'ALL') {
    andConditions.push({
      bus: {
        type: busType,
      },
    });
  }

  // ✅ DATE FILTER
  // যদি user date দেয়
  if (startDate && endDate) {
    andConditions.push({
      departure: {
        gte: startDate,
        lte: endDate,
      },
    });
  } else {
    // ✅ date না দিলে শুধু আজকের বা ভবিষ্যতের schedule দেখাবে
    andConditions.push({
      departure: {
        gte: new Date(),
      },
    });
  }
  const whereCondition = andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.schedule.findMany({
    where: whereCondition,
    skip,
    take: limit,
    orderBy: { [sortBy]: sortOrder },
    include: {
      bus: true,
      route: true,
    },
  });
  const total = await prisma.schedule.count({ where: whereCondition });
  return {
    data: result,
    meta: { page, limit, total }
  }
};

const getScheduleById = async (id: string) => {
  const isScheduleExist = await prisma.schedule.findUnique({
    where: { id },
  });
  if (!isScheduleExist) {
    throw new AppError(status.NOT_FOUND, 'Schedule not found');
  };
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
  const isScheduleExist = await prisma.schedule.findUnique({
    where: { id },
  });
  if (!isScheduleExist) {
    throw new AppError(status.NOT_FOUND, 'Schedule not found');
  };
  const result = await prisma.schedule.update({
    where: { id },
    data: payload,
  });
  return result;
};

const deleteSchedule = async (id: string) => {
  const isScheduleExist = await prisma.schedule.findUnique({
    where: { id },
  });
  if (!isScheduleExist) {
    throw new AppError(status.NOT_FOUND, 'Schedule not found');
  };
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
