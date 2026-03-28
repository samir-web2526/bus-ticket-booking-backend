import { Router } from 'express';
import { PaymentController } from './payment.controller';
import { checkAuth } from '../../middlewares/checkAuth';
import { validateRequest } from '../../middlewares/validateRequest';
import { PaymentValidation } from './payment.validation';

const router = Router();

// Initialize payment (Authenticated)
router.post(
  '/init',
  checkAuth('PASSENGER', 'ADMIN', 'OPERATOR'),
  validateRequest(PaymentValidation.initializePaymentValidationSchema),
  PaymentController.initializePayment
);

// Webhooks (Public)
router.post('/webhook/stripe', PaymentController.handleStripeWebhook);
router.post('/webhook/sslcommerz', PaymentController.handleSSLCommerzWebhook);

export const PaymentRoutes = router;
