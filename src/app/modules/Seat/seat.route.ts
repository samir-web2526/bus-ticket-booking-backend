import { Router } from 'express';
import { SeatController } from './seat.controller';

const router = Router();

// // Get seat layout for a bus (Public)
// router.get('/bus/:busId', SeatController.getSeatLayoutByBusId);

// Get available seats for a schedule (Public)
router.get('/available/:scheduleId', SeatController.getAvailableSeats);

export const SeatRoutes = router;
