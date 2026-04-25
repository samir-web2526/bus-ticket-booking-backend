import { z } from 'zod';
import { UserRole, UserStatus } from '../../../generated/enums';

// const createUserValidationSchema = z.object({
//   body: z.object({
//     name: z.string().min(1, 'Name is required'),
//     email: z.string().email('Invalid email address'),
//     password: z.string().min(6, 'Password must be at least 6 characters long'),
//     phone: z.string().optional(),
//     profileImage: z.string().url().optional(),

//     companyName: z.string().min(1, 'Company name is required'),
//     tradeLicense: z.string().min(1, 'Trade license is required'),
//     nid: z.string().min(1, 'NID is required'),
//     address: z.string().min(1, 'Address is required'),
//   }),
// });

const createUserValidationSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
    phone: z.string().optional(),

    profileImage: z
      .string()
      .url('Invalid image URL')
      .optional()
      .or(z.literal('')),

    companyName: z.string().min(1, 'Company name is required'),
    tradeLicense: z.string().min(1, 'Trade license is required'),
    nid: z.string().min(1, 'NID is required'),
    address: z.string().min(1, 'Address is required'),
  }),
});

const updateUserValidationSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    phone: z.string().optional(),
    profileImage: z.string().url().optional(),
  }),
});

const updateUserByAdminValidationSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    profileImage: z.string().url().optional(),
    status: z.nativeEnum(UserStatus).optional(),
  }),
});

export const UserValidation = {
  createUserValidationSchema,
  updateUserValidationSchema,
  updateUserByAdminValidationSchema
};
