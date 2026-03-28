import { Request, Response } from 'express';
import { BookingService } from './booking.service';
import { catchAsync, sendResponse } from '../../sharedfile';

const createBooking = catchAsync(async (req: Request, res: Response) => {
  const user = (req as any).user;
  const result = await BookingService.createBooking({
    ...req.body,
    userId: user?.id,
  });
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Booking created successfully',
    data: result,
  });
});

const getMyBookings = catchAsync(async (req: Request, res: Response) => {
  const user = (req as any).user;
  const result = await BookingService.getMyBookings(user?.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'My bookings fetched successfully',
    data: result,
  });
});

const getAllBookings = catchAsync(async (req: Request, res: Response) => {
  const result = await BookingService.getAllBookings();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'All bookings fetched successfully',
    data: result,
  });
});

const getBookingById = catchAsync(async (req: Request, res: Response) => {
  const result = await BookingService.getBookingById(req.params.id as string);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Booking details fetched successfully',
    data: result,
  });
});

const cancelBooking = catchAsync(async (req: Request, res: Response) => {
  const user = (req as any).user;
  const result = await BookingService.cancelBooking(req.params.id as string, user?.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Booking cancelled successfully',
    data: result,
  });
});

export const BookingController = {
  createBooking,
  getMyBookings,
  getAllBookings,
  getBookingById,
  cancelBooking,
};
