import { Router } from 'express';
import { SeatController } from './seat.controller';

const router = Router();

router.get('/available/:scheduleId', SeatController.getAvailableSeats);

export const SeatRoutes = router;
