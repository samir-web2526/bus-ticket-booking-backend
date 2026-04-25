import { Router } from 'express';
import express from 'express';
import { PaymentController } from './payment.controller';
import { checkAuth } from '../../middlewares/checkAuth';
import { validateRequest } from '../../middlewares/validateRequest';
import { PaymentValidation } from './payment.validation';

const router = Router();

// Initialize payment (Authenticated — creates Stripe Checkout Session)
router.post(
  '/init',
  checkAuth('PASSENGER', 'ADMIN', 'OPERATOR'),
  validateRequest(PaymentValidation.initializePaymentValidationSchema),
  PaymentController.initializePayment
);

// Stripe Webhook (Public — uses raw body for signature verification)
router.post(
  '/webhook/stripe',
  express.raw({ type: 'application/json' }),
  PaymentController.handleStripeWebhook
);

// Get payment by booking ID (Authenticated)
router.get(
  '/booking/:bookingId',
  checkAuth('PASSENGER', 'ADMIN', 'OPERATOR'),
  PaymentController.getPaymentByBookingId
);

// Get all payments (Admin only)
router.get(
  '/',
  checkAuth('ADMIN'),
  PaymentController.getAllPayments
);

export const PaymentRoutes = router;
