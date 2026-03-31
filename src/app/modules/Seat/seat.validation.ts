// import { z } from 'zod';

// const createSeatValidationSchema = z.object({
//   body: z.object({
//     busId: z.string().min(1, 'Bus ID is required').uuid(),
//     number: z.string().min(1, 'Seat number is required'),
//     type: z.string().optional(),
//     row: z.number().int().positive(),
//     column: z.number().int().positive(),
//     price: z.number().positive(),
//   }),
// });

// export const SeatValidation = {
//   createSeatValidationSchema,
// };
