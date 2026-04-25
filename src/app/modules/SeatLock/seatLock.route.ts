import { Router } from 'express';

import { checkAuth } from '../../middlewares/checkAuth';
import { validateRequest } from '../../middlewares/validateRequest';
import { SeatLockValidation } from './seatLock.validation';
import { SeatLockController } from './seatLock.controller';

const router = Router();

router.post(
  '/',
  checkAuth('PASSENGER'),
  validateRequest(SeatLockValidation.lockSeatsValidationSchema),
  SeatLockController.lockSeats
);

router.get(
  '/:scheduleId',
  checkAuth('PASSENGER'),
  SeatLockController.getActiveLocks
);


router.delete(
  '/all/:scheduleId',
  checkAuth('PASSENGER'),
  validateRequest(SeatLockValidation.releaseAllLocksValidationSchema),
  SeatLockController.releaseAllLocks
);

router.delete(
  '/:id',
  checkAuth('PASSENGER'),
  validateRequest(SeatLockValidation.releaseLockValidationSchema),
  SeatLockController.releaseLock
);

router.post(
  '/',
  checkAuth('PASSENGER'),
  validateRequest(SeatLockValidation.lockSeatsValidationSchema),
  SeatLockController.lockSeats
);

// ✅ /all/:scheduleId অবশ্যই /:scheduleId এর আগে
router.delete(
  '/all/:scheduleId',
  checkAuth('PASSENGER'),
  validateRequest(SeatLockValidation.releaseAllLocksValidationSchema),
  SeatLockController.releaseAllLocks
);

// ✅ GET ও /:id এর আগে
router.get(
  '/schedule/:scheduleId',
  checkAuth('PASSENGER'),
  SeatLockController.getActiveLocks
);

router.delete(
  '/:id',
  checkAuth('PASSENGER'),
  validateRequest(SeatLockValidation.releaseLockValidationSchema),
  SeatLockController.releaseLock
);

export const SeatLockRoutes = router;
