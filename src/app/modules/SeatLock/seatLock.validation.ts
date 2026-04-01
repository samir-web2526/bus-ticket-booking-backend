import { z } from 'zod';

const lockSeatsValidationSchema = z.object({
  body: z.object({
    seatIds: z.array(z.string().uuid()).min(1, 'At least one seat must be selected'),
    scheduleId: z.string().min(1, 'Schedule ID is required').uuid(),
  }),
});

const releaseAllLocksValidationSchema = z.object({
  params: z.object({
    scheduleId: z.string().min(1, 'Schedule ID is required').uuid(),
  }),
});

const releaseLockValidationSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Lock ID is required').uuid(),
  }),
});

export const SeatLockValidation = {
  lockSeatsValidationSchema,
  releaseAllLocksValidationSchema,
  releaseLockValidationSchema,
};
