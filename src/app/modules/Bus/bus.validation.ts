import { z } from 'zod';
import { BusType } from '../../../generated/enums';

const createBusValidationSchema = z.object({
  body: z.object({
    operatorId: z.string().min(1, 'Operator ID is required'),
    name: z.string().min(1, 'Bus name is required'),
    number: z.string().min(1, 'Bus number is required'),
    type: z.nativeEnum(BusType),
    totalSeats: z.number().int().positive('Total seats must be a positive integer'),
    pricePerSeat: z.number().positive('Price per seat must be a positive number'),
    isActive: z.boolean().optional(),
  }),
});

const updateBusValidationSchema = z.object({
  body: z.object({
    operatorId: z.string().optional(),
    name: z.string().optional(),
    number: z.string().optional(),
    type: z.nativeEnum(BusType).optional(),
    totalSeats: z.number().int().positive().optional(),
    pricePerSeat: z.number().positive().optional(),
    isActive: z.boolean().optional(),
  }),
});

export const BusValidation = {
  createBusValidationSchema,
  updateBusValidationSchema,
};
