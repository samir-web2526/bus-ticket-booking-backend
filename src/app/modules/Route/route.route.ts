import { Router } from 'express';
import { RouteController } from './route.controller';
import { checkAuth } from '../../middlewares/checkAuth';
import { validateRequest } from '../../middlewares/validateRequest';
import { RouteValidation } from './route.validation';

const router = Router();

// Create route (Admin)
router.post(
  '/',
  checkAuth('OPERATOR', 'ADMIN'),
  validateRequest(RouteValidation.createRouteValidationSchema),
  RouteController.createRoute
);

// Get all routes (Public)
router.get('/', RouteController.getAllRoutes);

// Get specific route (Public)
router.get('/:id', RouteController.getRouteById);

// Update route (Admin)
router.patch(
  '/:id',
  checkAuth('ADMIN'),
  validateRequest(RouteValidation.updateRouteValidationSchema),
  RouteController.updateRoute
);

// Delete route (Admin)
router.delete('/:id', checkAuth('ADMIN'), RouteController.deleteRoute);

export const RouteRoutes = router;
