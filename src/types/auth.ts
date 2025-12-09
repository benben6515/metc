/**
 * Authentication-related types
 */

import type { RoleLevel, AccountStatus } from './account';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthToken {
  token: string;
  expiresAt?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  roleLevel: RoleLevel;
  status: AccountStatus;
}

export interface LoginResponse {
  token: string;
  user: User;
}
