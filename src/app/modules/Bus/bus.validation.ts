import { z } from 'zod';
import { BusType } from '../../../generated/enums';

const createBusValidationSchema = z.object({
  body: z.object({
    operatorId: z.string().optional(),
    name: z.string().min(1, 'Bus name is required'),
    number: z.string().min(1, 'Bus number is required'),
    type: z.nativeEnum(BusType),
    totalSeats: z.number().int().positive('Total seats must be a positive integer'),
    pricePerSeat: z.number().positive('Price per seat must be a positive number'),
    vipSeats: z.number().int().positive().optional(),
    vipPrice: z.number().positive().optional(),
    deluxeSeats: z.number().int().positive().optional(),
    deluxePrice: z.number().positive().optional(),
    isActive: z.boolean().optional(),
  }),
});

const updateBusValidationSchema = z.object({
  body: z.object({
    operatorId: z.string().optional(),
    name: z.string().optional(),
    number: z.string().optional(),
    type: z.nativeEnum(BusType).optional(),
    pricePerSeat: z.number().positive().optional(),
    vipPrice: z.number().positive().optional(),
    deluxePrice: z.number().positive().optional(),
    isActive: z.boolean().optional(),
  }),
});

export const BusValidation = {
  createBusValidationSchema,
  updateBusValidationSchema,
};
