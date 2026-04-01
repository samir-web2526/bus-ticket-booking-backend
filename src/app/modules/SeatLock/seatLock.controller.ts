import { Request, Response } from 'express';

import { SeatLockService } from './seatLock.service';
import { catchAsync, sendResponse } from '../../sharedfile';

const lockSeats = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const result = await SeatLockService.lockSeats(req.body, user?.id as string);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Seats locked successfully for 10 minutes',
    data: result,
  });
});

const releaseLock = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = req.user;
  const result = await SeatLockService.releaseLock(id as string, user?.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Seat lock released successfully',
    data: result,
  });
});

const releaseAllLocks = catchAsync(async (req: Request, res: Response) => {
  const { scheduleId } = req.params;
  const user = req.user;
  const result = await SeatLockService.releaseAllLocks(scheduleId as string, user?.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'All seat locks released successfully',
    data: result,
  });
});

export const SeatLockController = {
  lockSeats,
  releaseLock,
  releaseAllLocks
};
