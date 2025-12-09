# Data Model: Member Management System (Account API)

**Feature**: Member Management System
**Date**: 2025-12-09 (Updated with actual API structure)
**Purpose**: Define data entities, their attributes, relationships, and validation rules

## Overview

This document defines the frontend data model based on the **actual API documentation**. The API manages "accounts" (not "members") with fields: `name`, `email`, `roleLevel`, and `status`.

**API Base URL**: `https://api-frontend-interview-server.metcfire.com.tw/`

## Core Entities

### 1. Account

Represents an account in the system with role and status information.

**TypeScript Interface**:
```typescript
interface Account {
  id: string;
  name: string;
  email: string;
  roleLevel: RoleLevel;
  status: AccountStatus;
  createdAt?: string; // If provided by API
  updatedAt?: string; // If provided by API
}

type RoleLevel = 'ADMIN' | 'EDITOR' | 'USER' | 'CLIENT';
type AccountStatus = 'ON' | 'OFF';
```

**Attributes**:

| Field | Type | Required | Description | Validation |
|-------|------|----------|-------------|------------|
| id | string | Yes | Unique account identifier | Assigned by backend |
| name | string | Yes | Account holder's name | Min 1 char, non-empty |
| email | string | Yes | Account email address | Valid email format, unique |
| roleLevel | RoleLevel | Yes | Account role/permission level | Enum: ADMIN, EDITOR, USER, CLIENT |
| status | AccountStatus | Yes | Account active status | Enum: ON or OFF |
| createdAt | string | No | Creation timestamp | ISO 8601 datetime (if provided) |
| updatedAt | string | No | Last update timestamp | ISO 8601 datetime (if provided) |

**Zod Validation Schema**:
```typescript
import { z } from 'zod';

export const RoleLevelSchema = z.enum(['ADMIN', 'EDITOR', 'USER', 'CLIENT']);
export const AccountStatusSchema = z.enum(['ON', 'OFF']);

export const AccountSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  email: z.string().email(),
  roleLevel: RoleLevelSchema,
  status: AccountStatusSchema,
  createdAt: z.string().optional(),
  updatedAt: z.string().optional()
});

// For API responses (if paginated)
export const AccountListResponseSchema = z.object({
  data: z.array(AccountSchema),
  total: z.number().optional(),
  page: z.number().optional(),
  pageSize: z.number().optional()
});
```

**State Transitions**:
- `ON` → `OFF`: Account can be deactivated
- `OFF` → `ON`: Account can be reactivated
- Role transitions: Any role can be changed to any other role

**Business Rules**:
1. Email must be unique across all accounts
2. Status defaults to 'ON' when creating new accounts
3. `createdAt`, `updatedAt` are managed by backend (read-only from frontend)
4. Accounts can be permanently deleted via DELETE endpoint

---

### 2. AuthToken

Represents the authentication token received after successful login.

**TypeScript Interface**:
```typescript
interface AuthToken {
  accessToken: string;
  tokenType: string; // Usually "Bearer"
  expiresIn: number; // Seconds until expiration
  expiresAt: number; // Unix timestamp of expiration
}
```

**Attributes**:

| Field | Type | Required | Description | Validation |
|-------|------|----------|-------------|------------|
| accessToken | string | Yes | JWT or opaque token | Non-empty string |
| tokenType | string | Yes | Token type for Authorization header | Typically "Bearer" |
| expiresIn | number | Yes | TTL in seconds | Positive integer |
| expiresAt | number | Yes | Expiration timestamp | Unix timestamp (ms) |

**Zod Validation Schema**:
```typescript
export const AuthTokenSchema = z.object({
  accessToken: z.string().min(1),
  tokenType: z.string(),
  expiresIn: z.number().positive(),
  expiresAt: z.number().positive()
});
```

**Lifecycle**:
1. Created upon successful login
2. Stored in Pinia auth store
3. Persisted to localStorage for page refresh
4. Included in all API requests via Axios interceptor
5. Cleared on logout or expiration

---

### 3. User (Authenticated Admin)

Represents the currently authenticated administrator.

**TypeScript Interface**:
```typescript
interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin'; // Only admins can access this system
}
```

**Attributes**:

| Field | Type | Required | Description | Validation |
|-------|------|----------|-------------|------------|
| id | string | Yes | Unique user identifier | UUID format |
| username | string | Yes | Username for login | Non-empty string |
| email | string | Yes | User's email | Valid email format |
| role | string | Yes | User role | Fixed as 'admin' |

**Zod Validation Schema**:
```typescript
export const UserSchema = z.object({
  id: z.string().uuid(),
  username: z.string().min(1),
  email: z.string().email(),
  role: z.literal('admin')
});
```

---

### 4. LoginCredentials

Represents the data sent to login endpoint.

**TypeScript Interface**:
```typescript
interface LoginCredentials {
  username: string;
  password: string;
}
```

**Attributes**:

| Field | Type | Required | Description | Validation |
|-------|------|----------|-------------|------------|
| username | string | Yes | User's username | Non-empty string |
| password | string | Yes | User's password | Non-empty string |

**Zod Validation Schema**:
```typescript
export const LoginCredentialsSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required')
});
```

**Note**: According to task.md, test accounts can use any username/password.

---

### 5. AccountFormDto

Represents the data structure for creating or updating accounts (based on API `AccountFormDto` schema).

**TypeScript Interface**:
```typescript
interface AccountFormDto {
  name: string;
  email: string;
  roleLevel: RoleLevel;
  status: AccountStatus;
}

// For create operations (POST /create-account)
type CreateAccountPayload = AccountFormDto;

// For update operations (PATCH /update-account/{id})
type UpdateAccountPayload = AccountFormDto;
```

**Validation**:
```typescript
export const AccountFormDtoSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email format'),
  roleLevel: RoleLevelSchema,
  status: AccountStatusSchema
});

export const CreateAccountPayloadSchema = AccountFormDtoSchema;
export const UpdateAccountPayloadSchema = AccountFormDtoSchema;
```

---

## Data Relationships

```
┌─────────────────┐
│      User       │ 1 (Authenticated Admin)
│  (Auth Store)   │
└─────────────────┘
        │
        │ has
        │
        ▼
┌─────────────────┐
│   AuthToken     │ 1
│  (Auth Store)   │
└─────────────────┘
        │
        │ authorizes access to
        │
        ▼
┌─────────────────┐
│    Account      │ *
│(Accounts Store) │
└─────────────────┘
```

**Relationships**:
1. One authenticated User has one AuthToken
2. One AuthToken authorizes access to many Accounts
3. Accounts are independent entities with no foreign key relationships

---

## Pagination Model

**Note**: API response structure for `GET /accounts` will be discovered during implementation. It may return a simple array or include pagination metadata.

**Possible TypeScript Interfaces**:

**Option 1: Simple Array**:
```typescript
type AccountListResponse = Account[];
```

**Option 2: Paginated Response**:
```typescript
interface PaginatedResponse<T> {
  data: T[];
  total?: number;
  page?: number;
  pageSize?: number;
}

type AccountListResponse = PaginatedResponse<Account>;
```

**Zod Schema** (flexible to handle both):
```typescript
// Simple array
export const AccountListResponseSimpleSchema = z.array(AccountSchema);

// Or paginated
export const AccountListResponsePaginatedSchema = z.object({
  data: z.array(AccountSchema),
  total: z.number().optional(),
  page: z.number().optional(),
  pageSize: z.number().optional()
});

// Use union type to accept both
export const AccountListResponseSchema = z.union([
  AccountListResponseSimpleSchema,
  AccountListResponsePaginatedSchema
]);
```

---

## Error Response Model

API errors follow a standard structure.

**TypeScript Interface**:
```typescript
interface ApiError {
  message: string;
  code?: string;
  errors?: Record<string, string[]>; // Field-level validation errors
}
```

**Example Error Response**:
```json
{
  "message": "Validation failed",
  "code": "VALIDATION_ERROR",
  "errors": {
    "email": ["Email is already taken"],
    "phone": ["Invalid phone number format"]
  }
}
```

**Zod Schema**:
```typescript
export const ApiErrorSchema = z.object({
  message: z.string(),
  code: z.string().optional(),
  errors: z.record(z.array(z.string())).optional()
});
```

---

## Validation Rules Summary

### Account Validation

**Client-Side (Form Validation)**:
- Name: Required, minimum 1 character
- Email: Required, valid email format
- RoleLevel: Required, must be ADMIN, EDITOR, USER, or CLIENT
- Status: Required, must be ON or OFF

**Server-Side (API Response Validation)**:
- All required fields must be present
- Email must be valid format
- RoleLevel must be valid enum value
- Status must be valid enum value
- ID assigned by backend

### Authentication Validation

**Login Credentials**:
- Username: Required, non-empty
- Password: Required, non-empty

**Token Validation**:
- Access token: Required, non-empty string
- Token type: Required (typically "Bearer")
- ExpiresIn: Required, positive integer
- ExpiresAt: Required, valid timestamp

---

## State Management Schema

### Auth Store State

```typescript
interface AuthState {
  token: AuthToken | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
```

### Accounts Store State

```typescript
interface AccountsState {
  accounts: Account[];
  currentAccount: Account | null;
  searchQuery: string;
  filterStatus: AccountStatus | 'all';
  filterRole: RoleLevel | 'all';
  isLoading: boolean;
  error: string | null;
}
```

---

## TypeScript Type Exports

All types should be exported from `src/types/` for use across the application:

```typescript
// src/types/index.ts
export type { Account, RoleLevel, AccountStatus, AccountFormDto, CreateAccountPayload, UpdateAccountPayload };
export type { AuthToken, User, LoginCredentials };
export type { AccountListResponse };
export type { ApiError };
export type { AuthState, AccountsState };

// Also export Zod schemas
export {
  AccountSchema,
  RoleLevelSchema,
  AccountStatusSchema,
  AccountFormDtoSchema,
  CreateAccountPayloadSchema,
  UpdateAccountPayloadSchema,
  AuthTokenSchema,
  UserSchema,
  LoginCredentialsSchema,
  AccountListResponseSchema,
  ApiErrorSchema
} from './schemas';
```

---

## Notes

1. **API Schema Discovery**: Actual API response structure should be verified against API documentation at `https://api-frontend-interview-server.metcfire.com.tw/api-docs`

2. **Nullable vs Optional**: Use `null` for fields that can be explicitly null in responses, use optional (`?`) for fields that may be omitted

3. **Date Handling**: All dates are strings in ISO 8601 format; use `new Date(dateString)` for parsing, consider date-fns or dayjs for formatting

4. **Validation Strategy**:
   - Zod for runtime validation of API responses
   - TypeScript for compile-time type checking
   - Quasar's built-in validation for form inputs

5. **Schema Evolution**: If API schema changes, update both TypeScript interfaces and Zod schemas together to maintain type safety
