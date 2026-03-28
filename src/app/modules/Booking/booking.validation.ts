import { z } from 'zod';

const createBookingValidationSchema = z.object({
  body: z.object({
    scheduleId: z.string().min(1, 'Schedule ID is required' ).uuid(),
    totalFare: z.number().positive('Total fare must be a positive number'),
  }),
});

export const BookingValidation = {
  createBookingValidationSchema,
};
