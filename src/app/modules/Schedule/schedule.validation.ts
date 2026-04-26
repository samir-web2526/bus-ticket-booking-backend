import { z } from 'zod';

// const createScheduleValidationSchema = z.object({
//   body: z.object({
//     busId: z.string().min(1, 'Bus ID is required'),
//     routeId: z.string().min(1, 'Route ID is required'),
//     departure: z.string().transform((val) => new Date(val)),
//     arrival: z.string().transform((val) => new Date(val)),
//     status: z.string().optional(),
//   }),
// });

const createScheduleValidationSchema = z.object({
  body: z.object({
    busId: z.string().min(1, 'Bus ID is required'),
    routeId: z.string().min(1, 'Route ID is required'),

    departure: z.string()
      .min(1, 'Departure time is required')
      .transform((val) => new Date(val))
      .refine((date) => !isNaN(date.getTime()), {
        message: 'Invalid departure datetime',
      }),

    arrival: z.string()
      .min(1, 'Arrival time is required')
      .transform((val) => new Date(val))
      .refine((date) => !isNaN(date.getTime()), {
        message: 'Invalid arrival datetime',
      }),

    status: z.enum(['scheduled', 'cancelled', 'completed']).optional(),
  }),
});

const updateScheduleValidationSchema = z.object({
  body: z.object({
    busId: z.string().optional(),
    routeId: z.string().optional(),
    departure: z.string().optional(),
    arrival: z.string().optional(),
    fare: z.number().positive().optional(),
    status: z.string().optional(),
  }),
});

export const ScheduleValidation = {
  createScheduleValidationSchema,
  updateScheduleValidationSchema,
};

