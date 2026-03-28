import { Request, Response } from 'express';

import { UserService } from './user.service';
import { catchAsync, sendResponse } from '../../sharedfile';

const createUser = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.createUser(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'User created successfully',
    data: result,
  });
});

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.getAllUsers(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Users fetched successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getMe = catchAsync(async (req: Request, res: Response) => {
  const { id, role } = req.user;
  const result = await UserService.getMe(id, role);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Profile fetched successfully',
    data: result,
  });
});

const updateMe = catchAsync(async (req: Request, res: Response) => {
  const user = (req as any).user;
  const result = await UserService.updateMe(user.id, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Profile updated successfully',
    data: result,
  });
});

const getUserById = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.getUserById(req.params.id as string);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User fetched successfully',
    data: result,
  });
});

const updateUser = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.updateUser(req.params.id as string, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User updated successfully',
    data: result,
  });
});

const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.deleteUser(req.params.id as string);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User deleted successfully',
    data: result,
  });
});

export const UserController = {
  createUser,
  getAllUsers,
  getMe,
  updateMe,
  getUserById,
  updateUser,
  deleteUser,
};
