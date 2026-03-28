import { Request, Response } from 'express';

import { PaymentService } from './payment.service';
import { catchAsync, sendResponse } from '../../sharedfile';

const initializePayment = catchAsync(async (req: Request, res: Response) => {
  const result = await PaymentService.initializePayment(req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Payment initialized successfully',
    data: result,
  });
});

const handleStripeWebhook = catchAsync(async (req: Request, res: Response) => {
  // We specify req.body in generic catchAsync, 
  // but for Stripe webhooks, we may need the raw body if it is not already provided.
  const result = await PaymentService.handleStripeWebhook(req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Stripe webhook processed',
    data: result,
  });
});

const handleSSLCommerzWebhook = catchAsync(async (req: Request, res: Response) => {
  const result = await PaymentService.handleSSLCommerzWebhook(req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'SSLCommerz webhook processed',
    data: result,
  });
});

export const PaymentController = {
  initializePayment,
  handleStripeWebhook,
  handleSSLCommerzWebhook,
};
