import status from "http-status";
import { prisma } from "../../../lib/prisma";
import AppError from "../../errorHelpers/AppError";
import { paginationHelper } from "../../sharedfile";
import { TSchedule } from "./schedule.interface";

const createSchedule = async (payload: TSchedule) => {
  const { busId, routeId, departure, arrival, status } = payload
  const result = await prisma.schedule.create({
    data: {
      ...payload,
      status: payload.status ?? 'scheduled'
    },
    include: {
      bus: true,
      route: true,
    },
  });
  return result;
};

const getAllSchedules = async (query: any) => {
  const { sourceCity, destinationCity, date } = query;
  const { page, limit, skip, sortBy, sortOrder } = paginationHelper.calculatePagination(query);

  const startDate = date ? new Date(new Date(date).setHours(0, 0, 0, 0)) : undefined;
  const endDate = date ? new Date(new Date(date).setHours(23, 59, 59, 999)) : undefined;

  const andConditions: any[] = [];

  if (sourceCity) {
    andConditions.push({
      route: {
        sourceCity
      }
    });
  }

  if (destinationCity) {
    andConditions.push({
      route: {
        destinationCity
      }
    });
  }

  if (startDate && endDate) {
    andConditions.push({
      departure: {
        gte: startDate,
        lte: endDate
      }
    })
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
