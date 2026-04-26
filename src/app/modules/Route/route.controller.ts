import { Request, Response } from 'express';
import { RouteService } from './route.service';
import { catchAsync, sendResponse } from '../../sharedfile';

const createRoute = catchAsync(async (req: Request, res: Response) => {
  const result = await RouteService.createRoute(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Route created successfully',
    data: result,
  });
});

const getAllRoutes = catchAsync(async (req: Request, res: Response) => {
  const result = await RouteService.getAllRoutes(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Routes fetched successfully',
    data: result,
  });
});

const getAllRoutesForDropdown = catchAsync(async (req, res) => {
  const result = await RouteService.getAllRoutesForDropdown();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Routes fetched successfully',
    data: result,
  });
});

const getRouteById = catchAsync(async (req: Request, res: Response) => {
  const result = await RouteService.getRouteById(req.params.id as string);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Route fetched successfully',
    data: result,
  });
});

const updateRoute = catchAsync(async (req: Request, res: Response) => {
  const result = await RouteService.updateRoute(req.params.id as string, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Route updated successfully',
    data: result,
  });
});

const deleteRoute = catchAsync(async (req: Request, res: Response) => {
  const result = await RouteService.deleteRoute(req.params.id as string);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Route deleted successfully',
    data: result,
  });
});

export const RouteController = {
  createRoute,
  getAllRoutes,
  getAllRoutesForDropdown,
  getRouteById,
  updateRoute,
  deleteRoute,
};
