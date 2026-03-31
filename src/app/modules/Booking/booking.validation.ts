import { z } from 'zod';

const createBookingValidationSchema = z.object({
  body: z.object({
    scheduleId: z.string().min(1, 'Schedule ID is required').uuid(),
  }),
});

export const BookingValidation = {
  createBookingValidationSchema,
};
