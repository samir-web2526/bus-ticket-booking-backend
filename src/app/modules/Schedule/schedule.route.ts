import { Router } from 'express';
import { ScheduleController } from './schedule.controller';
import { checkAuth } from '../../middlewares/checkAuth';
import { validateRequest } from '../../middlewares/validateRequest';
import { ScheduleValidation } from './schedule.validation';

const router = Router();

// Create schedule (Operator/Admin)
router.post(
  '/',
  checkAuth('OPERATOR', 'ADMIN'),
  validateRequest(ScheduleValidation.createScheduleValidationSchema),
  ScheduleController.createSchedule
);

// Get all schedules (Public) - with search/filter
router.get('/', ScheduleController.getAllSchedules);

// Get specific schedule (Public)
router.get('/:id', ScheduleController.getScheduleById);

// Update schedule (Operator/Admin)
router.patch(
  '/:id',
  checkAuth('OPERATOR', 'ADMIN'),
  validateRequest(ScheduleValidation.updateScheduleValidationSchema),
  ScheduleController.updateSchedule
);

// Delete schedule (Operator/Admin)
router.delete('/:id', checkAuth('OPERATOR', 'ADMIN'), ScheduleController.deleteSchedule);

export const ScheduleRoutes = router;
