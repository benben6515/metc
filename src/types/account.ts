/**
 * Account entity types based on API contract
 */

export type RoleLevel = 'ADMIN' | 'EDITOR' | 'USER' | 'CLIENT';

export type AccountStatus = 'ON' | 'OFF';

export interface Account {
  id: string;
  name: string;
  email: string;
  roleLevel: RoleLevel;
  status: AccountStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface AccountFormDto {
  name: string;
  email: string;
  password: string;
  roleLevel: RoleLevel;
}

export interface AccountUpdateDto {
  name?: string;
  email?: string;
  password?: string;
  roleLevel?: RoleLevel;
  status?: AccountStatus;
}
