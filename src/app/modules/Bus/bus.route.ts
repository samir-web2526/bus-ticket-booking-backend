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

router.get('/', BusController.getAllBuses);

router.get('/my', checkAuth('OPERATOR', 'ADMIN'), BusController.getMyBuses);

router.get('/:id', BusController.getBusById);

router.patch(
  '/:id',
  checkAuth('OPERATOR', 'ADMIN'),
  validateRequest(BusValidation.updateBusValidationSchema),
  BusController.updateBus
);

router.delete('/:id', checkAuth('OPERATOR', 'ADMIN'), BusController.deleteBus);

export const BusRoutes = router;
