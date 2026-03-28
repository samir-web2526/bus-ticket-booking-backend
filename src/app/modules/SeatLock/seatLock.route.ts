import { Router } from 'express';
import { SeatLockController } from './seatLock.controller';
import { checkAuth } from '../../middlewares/checkAuth';
import { validateRequest } from '../../middlewares/validateRequest';
import { SeatLockValidation } from './seatLock.validation';

const router = Router();

// Lock seats (Passenger/Authenticated)
router.post(
  '/',
  checkAuth('PASSENGER', 'ADMIN', 'OPERATOR'),
  validateRequest(SeatLockValidation.lockSeatsValidationSchema),
  SeatLockController.lockSeats
);

// Release lock (Passenger/Authenticated)
router.delete('/:id', checkAuth('PASSENGER', 'ADMIN', 'OPERATOR'), SeatLockController.releaseLock);

export const SeatLockRoutes = router;
