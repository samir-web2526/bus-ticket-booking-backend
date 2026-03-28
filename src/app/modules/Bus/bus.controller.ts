import { Request, Response } from 'express';

import { BusService } from './bus.service';
import { catchAsync, sendResponse } from '../../sharedfile';

const createBus = catchAsync(async (req: Request, res: Response) => {
  const result = await BusService.createBus(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Bus created successfully',
    data: result,
  });
});

const getAllBuses = catchAsync(async (req: Request, res: Response) => {
  const result = await BusService.getAllBuses();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Buses fetched successfully',
    data: result,
  });
});

const getBusById = catchAsync(async (req: Request, res: Response) => {
  const result = await BusService.getBusById(req.params.id as string);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Bus fetched successfully',
    data: result,
  });
});

const updateBus = catchAsync(async (req: Request, res: Response) => {
  const result = await BusService.updateBus(req.params.id as string, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Bus updated successfully',
    data: result,
  });
});

const deleteBus = catchAsync(async (req: Request, res: Response) => {
  const result = await BusService.deleteBus(req.params.id as string);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Bus deleted successfully',
    data: result,
  });
});

export const BusController = {
  createBus,
  getAllBuses,
  getBusById,
  updateBus,
  deleteBus,
};
