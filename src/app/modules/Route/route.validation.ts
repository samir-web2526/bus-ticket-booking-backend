import { z } from 'zod';

const createRouteValidationSchema = z.object({
  body: z.object({
    sourceCity: z.string().min(1, 'Source city is required'),
    destinationCity: z.string().min(1, 'Destination city is required'),
    distanceKm: z.number().positive('Distance must be a positive number'),
    estimatedTimeMinutes: z.number().int().positive('Estimated time must be a positive integer'),
    stops: z.any().optional(),
  }),
});

const updateRouteValidationSchema = z.object({
  body: z.object({
    sourceCity: z.string().optional(),
    destinationCity: z.string().optional(),
    distanceKm: z.number().positive().optional(),
    estimatedTimeMinutes: z.number().int().positive().optional(),
    stops: z.any().optional(),
  }),
});

export const RouteValidation = {
  createRouteValidationSchema,
  updateRouteValidationSchema,
};
