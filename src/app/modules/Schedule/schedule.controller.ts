import { Request, Response } from 'express';
import { ScheduleService } from './schedule.service';
import { catchAsync, sendResponse } from '../../sharedfile';

const createSchedule = catchAsync(async (req: Request, res: Response) => {
  const result = await ScheduleService.createSchedule(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Schedule created successfully',
    data: result,
  });
});

const getAllSchedules = catchAsync(async (req: Request, res: Response) => {
  const result = await ScheduleService.getAllSchedules(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Schedules fetched successfully',
    data: result,
  });
});

const getScheduleById = catchAsync(async (req: Request, res: Response) => {
  const result = await ScheduleService.getScheduleById(req.params.id as string);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Schedule fetched successfully',
    data: result,
  });
});

const updateSchedule = catchAsync(async (req: Request, res: Response) => {
  const result = await ScheduleService.updateSchedule(req.params.id as string, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Schedule updated successfully',
    data: result,
  });
});

const deleteSchedule = catchAsync(async (req: Request, res: Response) => {
  const result = await ScheduleService.deleteSchedule(req.params.id as string);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Schedule deleted successfully',
    data: result,
  });
});

export const ScheduleController = {
  createSchedule,
  getAllSchedules,
  getScheduleById,
  updateSchedule,
  deleteSchedule,
};
