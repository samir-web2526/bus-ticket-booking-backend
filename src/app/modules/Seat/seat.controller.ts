import { Request, Response } from 'express';

import { SeatService } from './seat.service';
import { catchAsync, sendResponse } from '../../sharedfile';

// const getSeatLayoutByBusId = catchAsync(async (req: Request, res: Response) => {
//   const result = await SeatService.getSeatLayoutByBusId(req.params.busId as string);
//   sendResponse(res, {
//     statusCode: 200,
//     success: true,
//     message: 'Seat layout fetched successfully',
//     data: result,
//   });
// });

const getAvailableSeats = catchAsync(async (req: Request, res: Response) => {
  const result = await SeatService.getAvailableSeats(req.params.scheduleId as string);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Available seats fetched successfully',
    data: result,
  });
});

export const SeatController = {
  // getSeatLayoutByBusId,
  getAvailableSeats,
};
