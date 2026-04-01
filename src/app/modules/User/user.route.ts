import { Router } from 'express';
import { UserController } from './user.controller';
import { checkAuth } from '../../middlewares/checkAuth';
import { validateRequest } from '../../middlewares/validateRequest';
import { UserValidation } from './user.validation';

const router = Router();

// Create Operator or Admin (Admin only)
router.post(
  '/',
  checkAuth('ADMIN'),
  validateRequest(UserValidation.createUserValidationSchema),
  UserController.createUser
);

// Get all users (Admin only)
router.get('/', checkAuth('ADMIN'), UserController.getAllUsers);

// Get current user profile (Authenticated)
router.get('/me', checkAuth('ADMIN', 'OPERATOR', 'PASSENGER'), UserController.getMe);

// Update own profile (Authenticated)
router.patch(
  '/me',
  checkAuth('ADMIN', 'OPERATOR', 'PASSENGER'),
  validateRequest(UserValidation.updateUserValidationSchema),
  UserController.updateMe
);

// Get user by ID (Admin only)
router.get('/:id', checkAuth('ADMIN'), UserController.getUserById);

// Update user (Admin only)
router.patch(
  '/:id',
  checkAuth('ADMIN'),
  validateRequest(UserValidation.updateUserByAdminValidationSchema),
  UserController.updateUser
);

// Delete user (Admin only)
router.delete('/:id', checkAuth('ADMIN'), UserController.deleteUser);

export const UserRoutes = router;
