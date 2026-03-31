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
  const user = (req as any).user;
  const result = await SeatLockService.releaseLock(req.params.id as string, user?.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Seat lock released successfully',
    data: result,
  });
});

export const SeatLockController = {
  lockSeats,
  releaseLock,
};
