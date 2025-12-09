/**
 * API response and error types
 */

import type { Account } from './account';

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
  details?: unknown;
}

export interface AccountListResponse {
  data: Account[];
  total?: number;
  page?: number;
  pageSize?: number;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}
