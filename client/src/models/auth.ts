import { z } from 'zod';
import { UserModel } from './userModel';

export interface AuthResponse {
  success: boolean;
  message: string;
  accessToken: string;
  userData: UserModel;
}

export interface LoginRequest {
  email: string;
  password: string;
}

// Zod schemas for validation
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

