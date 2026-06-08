import { z } from 'zod';
import { RECORD_STATUS_OPTIONS, IC_TYPE_OPTIONS, GENDER_OPTIONS } from '@constants/global';

export interface UserModel {
  id: number | 0;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  phone?: string | null;
  isEmailVerified?: boolean | false;
  genderId: number | null;
  createdDate: string;
  dateOfBirth?: string | null;
  icNumber?: string | null;
  icTypeId?: number | null;
  isLockedOut?: boolean | false;
  recordStatusId?: number | null;
  roleId?: number[] | null;
}

export const UserFormSchema = z.object({
  id: z.coerce.number().optional().default(0),
  userId: z.coerce.number().optional().default(0),
  firstName: z.string().min(2, 'First name must be between 2 and 100 characters').max(100, 'First name must be between 2 and 100 characters'),
  lastName: z.string().min(2, 'Last name must be between 2 and 100 characters').max(100, 'Last name must be between 2 and 100 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  isEmailVerified: z.boolean().optional().default(false),
  genderId: z.coerce.number().optional().default(GENDER_OPTIONS.Undisclosed),
  createdDate: z.string().optional().default(new Date().toISOString()),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  icNumber: z.string().optional(),
  icTypeId: z.coerce.number().optional().default(IC_TYPE_OPTIONS.NRIC),
  isLockedOut: z.boolean().optional().default(false),
  recordStatusId: z.coerce.number().optional().default(RECORD_STATUS_OPTIONS.Public),
  roleId: z.array(z.coerce.number()).optional().default([]),
});

export type UserFormData = z.infer<typeof UserFormSchema>;

export const CreateUserFormSchema = UserFormSchema.extend({
  password: z.string().min(6, 'Password must be at least 6 characters').max(100, 'Password must be at most 100 characters'),
});

export type CreateUserFormData = z.infer<typeof CreateUserFormSchema>;

//---------------------------------------------------------

export interface UserAnalytics {
  totalUsers: number;
  verifiedUsers: number;
  unverifiedUsers: number;
  genderDistribution: { genderId: number; count: number }[];
  newUsersLast7Days: number;
  newUsersLast30Days: number;
}



