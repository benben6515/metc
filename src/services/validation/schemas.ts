/**
 * Zod validation schemas for runtime type checking
 */

import { z } from 'zod';

export const RoleLevelSchema = z.enum(['ADMIN', 'EDITOR', 'USER', 'CLIENT']);

export const AccountStatusSchema = z.enum(['ON', 'OFF']);

export const AccountSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  roleLevel: RoleLevelSchema,
  status: AccountStatusSchema,
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export const AccountFormDtoSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  roleLevel: RoleLevelSchema,
});

export const AccountUpdateDtoSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
  roleLevel: RoleLevelSchema.optional(),
  status: AccountStatusSchema.optional(),
});

export const LoginCredentialsSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  roleLevel: RoleLevelSchema,
  status: AccountStatusSchema,
});

export const LoginResponseSchema = z.object({
  token: z.string(),
  user: UserSchema,
});

export const AccountListResponseSchema = z.object({
  data: z.array(AccountSchema),
  total: z.number().optional(),
  page: z.number().optional(),
  pageSize: z.number().optional(),
});
