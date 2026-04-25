import { Request, Response } from 'express';

import { BusService } from './bus.service';
import { catchAsync, sendResponse } from '../../sharedfile';

const createBus = catchAsync(async (req: Request, res: Response) => {
  const operatorId = req.user.role === "ADMIN" ? req.body.operatorId : req.user.id;
  const result = await BusService.createBus(req.body, operatorId);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Bus created successfully',
    data: result,
  });
});

const getAllBuses = catchAsync(async (req: Request, res: Response) => {
  const result = await BusService.getAllBuses(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Buses fetched successfully',
    data: result,
  });
});

const getMyBuses = catchAsync(async (req: Request, res: Response) => {
  const operator = req.user;
  const result = await BusService.getMyBuses(operator.id as string, req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'My buses fetched successfully',
    data: result,
  });
});

const getBusById = catchAsync(async (req: Request, res: Response) => {
  const busId = req.params.id as string;
  const result = await BusService.getBusById(busId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Bus fetched successfully',
    data: result,
  });
});

const updateBus = catchAsync(async (req: Request, res: Response) => {
  const busId = req.params.id as string;
  const { id: userId, role } = req.user;
  const result = await BusService.updateBus(busId, userId, role, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Bus updated successfully',
    data: result,
  });
});

const deleteBus = catchAsync(async (req: Request, res: Response) => {
  const busId = req.params.id as string;
  const { id: userId, role } = req.user;
  const result = await BusService.deleteBus(busId, userId, role);
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
  getMyBuses,
  getBusById,
  updateBus,
  deleteBus,
};
