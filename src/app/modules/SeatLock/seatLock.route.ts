import { Router } from 'express';

import { checkAuth } from '../../middlewares/checkAuth';
import { validateRequest } from '../../middlewares/validateRequest';
import { SeatLockValidation } from './seatLock.validation';
import { SeatLockController } from './seatLock.controller';

const router = Router();

// Lock seats (Passenger/Authenticated)
router.post(
  '/',
  checkAuth('PASSENGER'),
  validateRequest(SeatLockValidation.lockSeatsValidationSchema),
  SeatLockController.lockSeats
);

// Release lock (Passenger/Authenticated)
router.delete('/:id', checkAuth('PASSENGER', 'ADMIN', 'OPERATOR'), SeatLockController.releaseLock);

export const SeatLockRoutes = router;
