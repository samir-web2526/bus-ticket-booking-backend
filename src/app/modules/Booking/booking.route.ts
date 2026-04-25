import { Router } from 'express';
import { BookingController } from './booking.controller';
import { checkAuth } from '../../middlewares/checkAuth';
import { validateRequest } from '../../middlewares/validateRequest';
import { BookingValidation } from './booking.validation';

const router = Router();

// Create booking (Passenger)
router.post(
  '/',
  checkAuth('PASSENGER'),
  validateRequest(BookingValidation.createBookingValidationSchema),
  BookingController.createBooking
);

// My bookings (Passenger)
router.get('/my-bookings', checkAuth('PASSENGER'), BookingController.getMyBookings);

// All bookings (Admin/Operator)
router.get('/all-bookings', checkAuth('ADMIN', 'OPERATOR'), BookingController.getAllBookings);

router.get('/operator', checkAuth('OPERATOR'), BookingController.getOperatorBookings);

// Booking details (Authenticated)
router.get('/:id', checkAuth('PASSENGER', 'ADMIN', 'OPERATOR'), BookingController.getBookingById);

// Cancel booking (Passenger)
router.patch('/:id/cancel', checkAuth('PASSENGER'), BookingController.cancelBooking);

export const BookingRoutes = router;
