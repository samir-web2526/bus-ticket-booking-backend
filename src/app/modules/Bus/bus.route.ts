import { Router } from 'express';
import { BusController } from './bus.controller';
import { checkAuth } from '../../middlewares/checkAuth';
import { validateRequest } from '../../middlewares/validateRequest';
import { BusValidation } from './bus.validation';

const router = Router();

router.post(
  '/',
  checkAuth('OPERATOR', 'ADMIN'),
  validateRequest(BusValidation.createBusValidationSchema),
  BusController.createBus
);

// Get all buses (Public/Operator)
router.get('/', BusController.getAllBuses);

// Get specific bus (Public)
router.get('/:id', BusController.getBusById);

// Update bus (Operator/Admin)
router.patch(
  '/:id',
  checkAuth('OPERATOR', 'ADMIN'),
  validateRequest(BusValidation.updateBusValidationSchema),
  BusController.updateBus
);

// Delete bus (Operator/Admin)
router.delete('/:id', checkAuth('OPERATOR', 'ADMIN'), BusController.deleteBus);

export const BusRoutes = router;
