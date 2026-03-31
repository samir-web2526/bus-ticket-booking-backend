import { Request, Response } from 'express';
import { BookingService } from './booking.service';
import { catchAsync, sendResponse } from '../../sharedfile';
import { UserRole } from '../../../generated/enums';

const createBooking = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const scheduleId = req.body.scheduleId;
  const result = await BookingService.createBooking({
    userId: user?.id,
    scheduleId,
  });
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Booking created successfully',
    data: result,
  });
});

const getMyBookings = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const result = await BookingService.getMyBookings(user?.id as string);
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
  const bookingId = req.params.id;
  const { id: userId, role } = req.user;
  const result = await BookingService.getBookingById(bookingId as string, userId as string, role as UserRole);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Booking details fetched successfully',
    data: result,
  });
});

const cancelBooking = catchAsync(async (req: Request, res: Response) => {
  const bookingId = req.params.id;
  const user = req.user;
  const result = await BookingService.cancelBooking(bookingId as string, user?.id as string);
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
