# API Contracts: Member Management System (Actual API)

**Feature**: Member Management System
**Date**: 2025-12-09 (Updated with actual API structure)
**Base URL**: `https://api-frontend-interview-server.metcfire.com.tw/`
**API Documentation**: `https://api-frontend-interview-server.metcfire.com.tw/api-docs`

## Overview

This document defines the **actual** API contracts based on the API documentation screenshot. The API manages **accounts** with fields: `name`, `email`, `roleLevel`, and `status`.

**Authentication**: Test credentials can use any username/password (`[隨便打]`)

**Required Headers**: All API requests must include custom header `interviewerName: "Benben"` for interview tracking

## API Endpoints

### GET /

Root endpoint - likely returns API information or redirects.

**Request**:
```http
GET /
```

**Note**: Test this endpoint to discover its purpose.

---

### GET /accounts

Retrieve list of all accounts.

**Request**:
```http
GET /accounts
Authorization: Bearer {token}
interviewerName: Benben
```

**Response Structure** (to be verified):
```typescript
// Option 1: Simple array
type Response = Account[];

// Option 2: Paginated object
interface Response {
  data: Account[];
  total?: number;
  page?: number;
  pageSize?: number;
}
```

**Example Response**:
```json
[
  {
    "id": "1",
    "name": "John Doe",
    "email": "john@example.com",
    "roleLevel": "ADMIN",
    "status": "ON"
  },
  {
    "id": "2",
    "name": "Jane Smith",
    "email": "jane@example.com",
    "roleLevel": "USER",
    "status": "ON"
  }
]
```

**TypeScript**:
```typescript
async function getAccounts(): Promise<Account[]> {
  const response = await apiClient.get<Account[]>('/accounts');
  return AccountListResponseSchema.parse(response.data);
}
```

---

### GET /account/{id}

Retrieve a single account by ID.

**Request**:
```http
GET /account/{id}
Authorization: Bearer {token}
```

**Path Parameters**:
- `id` (required): Account identifier

**Success Response (200 OK)**:
```json
{
  "id": "1",
  "name": "John Doe",
  "email": "john@example.com",
  "roleLevel": "ADMIN",
  "status": "ON"
}
```

**TypeScript**:
```typescript
async function getAccountById(id: string): Promise<Account> {
  const response = await apiClient.get<Account>(`/account/${id}`);
  return AccountSchema.parse(response.data);
}
```

**Error Responses**:
- `404 Not Found`: Account not found
- `401 Unauthorized`: Invalid or missing token

---

### POST /create-account

Create a new account.

**Request**:
```http
POST /create-account
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "New User",
  "email": "newuser@example.com",
  "roleLevel": "USER",
  "status": "ON"
}
```

**Request Body** (`AccountFormDto`):
```typescript
interface AccountFormDto {
  name: string;      // required
  email: string;     // required
  roleLevel: string; // required: ADMIN, EDITOR, USER, CLIENT
  status: string;    // required: ON, OFF
}
```

**Success Response (201 Created)**:
```json
{
  "id": "3",
  "name": "New User",
  "email": "newuser@example.com",
  "roleLevel": "USER",
  "status": "ON"
}
```

**TypeScript**:
```typescript
async function createAccount(data: AccountFormDto): Promise<Account> {
  AccountFormDtoSchema.parse(data); // Validate before sending
  const response = await apiClient.post<Account>('/create-account', data);
  return AccountSchema.parse(response.data);
}
```

**Error Responses**:
- `400 Bad Request`: Validation failed (missing required fields, invalid email, etc.)
- `409 Conflict`: Email already exists
- `401 Unauthorized`: Invalid or missing token

---

### PATCH /update-account/{id}

Update an existing account.

**Request**:
```http
PATCH /update-account/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Updated Name",
  "email": "updated@example.com",
  "roleLevel": "EDITOR",
  "status": "ON"
}
```

**Path Parameters**:
- `id` (required): Account identifier

**Request Body** (`AccountFormDto`):
```typescript
interface AccountFormDto {
  name: string;      // required
  email: string;     // required
  roleLevel: string; // required
  status: string;    // required
}
```

**Success Response (200 OK)**:
```json
{
  "id": "1",
  "name": "Updated Name",
  "email": "updated@example.com",
  "roleLevel": "EDITOR",
  "status": "ON"
}
```

**TypeScript**:
```typescript
async function updateAccount(id: string, data: AccountFormDto): Promise<Account> {
  AccountFormDtoSchema.parse(data); // Validate before sending
  const response = await apiClient.patch<Account>(`/update-account/${id}`, data);
  return AccountSchema.parse(response.data);
}
```

**Error Responses**:
- `400 Bad Request`: Validation failed
- `404 Not Found`: Account not found
- `409 Conflict`: Email already exists (if changed)
- `401 Unauthorized`: Invalid or missing token

---

### DELETE /delete-account/{id}

Delete an account permanently.

**Request**:
```http
DELETE /delete-account/{id}
Authorization: Bearer {token}
```

**Path Parameters**:
- `id` (required): Account identifier

**Success Response (204 No Content or 200 OK)**:
```http
HTTP/1.1 204 No Content
```

Or:
```json
{
  "message": "Account deleted successfully"
}
```

**TypeScript**:
```typescript
async function deleteAccount(id: string): Promise<void> {
  await apiClient.delete(`/delete-account/${id}`);
}
```

**Error Responses**:
- `404 Not Found`: Account not found
- `401 Unauthorized`: Invalid or missing token

---

## Authentication (To Be Verified)

**Note**: Authentication endpoints not shown in the screenshot. Likely patterns:

### POST /auth/login or /login

```http
POST /login
Content-Type: application/json

{
  "username": "anything",
  "password": "anything"
}
```

**Response** (typical):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "1",
    "username": "admin",
    "email": "admin@example.com"
  }
}
```

**Action**: Test actual login endpoint to discover structure.

---

## Schemas (From API Docs)

### RoleLevel (Enum)

```typescript
type RoleLevel = 'ADMIN' | 'EDITOR' | 'USER' | 'CLIENT';
```

Values: `ADMIN`, `EDITOR`, `USER`, `CLIENT`

### AccountStatus (Enum)

```typescript
type AccountStatus = 'ON' | 'OFF';
```

Values: `ON`, `OFF`

### AccountFormDto (Request Body)

```typescript
interface AccountFormDto {
  name: string;      // required
  email: string;     // required
  roleLevel: string; // required (enum)
  status: string;    // required (enum)
}
```

All fields are **required** according to API documentation.

---

## Implementation: API Service

### src/services/api/accounts.ts

```typescript
import { apiClient } from './client';
import type { Account, AccountFormDto } from '@/types';
import { AccountSchema, AccountFormDtoSchema, AccountListResponseSchema } from '@/services/validation/schemas';

export const accountsService = {
  // GET /accounts
  async getAccounts(): Promise<Account[]> {
    const response = await apiClient.get<Account[]>('/accounts');

    // Handle both array and paginated responses
    const data = Array.isArray(response.data)
      ? response.data
      : response.data.data;

    return data.map(account => AccountSchema.parse(account));
  },

  // GET /account/{id}
  async getAccountById(id: string): Promise<Account> {
    const response = await apiClient.get<Account>(`/account/${id}`);
    return AccountSchema.parse(response.data);
  },

  // POST /create-account
  async createAccount(data: AccountFormDto): Promise<Account> {
    // Validate request before sending
    AccountFormDtoSchema.parse(data);

    const response = await apiClient.post<Account>('/create-account', data);
    return AccountSchema.parse(response.data);
  },

  // PATCH /update-account/{id}
  async updateAccount(id: string, data: AccountFormDto): Promise<Account> {
    // Validate request before sending
    AccountFormDtoSchema.parse(data);

    const response = await apiClient.patch<Account>(`/update-account/${id}`, data);
    return AccountSchema.parse(response.data);
  },

  // DELETE /delete-account/{id}
  async deleteAccount(id: string): Promise<void> {
    await apiClient.delete(`/delete-account/${id}`);
  }
};
```

---

## Error Handling

### Standard Error Response Format

```typescript
interface ApiError {
  message: string;
  code?: string;
  errors?: Record<string, string[]>; // Field validation errors
}
```

**Example Validation Error**:
```json
{
  "message": "Validation failed",
  "code": "VALIDATION_ERROR",
  "errors": {
    "email": ["Invalid email format", "Email already exists"],
    "name": ["Name is required"]
  }
}
```

### Axios Interceptor Error Handling

```typescript
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - redirect to login
      const authStore = useAuthStore();
      authStore.logout();
      router.push('/login');
    }

    // Map API errors to user-friendly messages
    const apiError: ApiError = error.response?.data || {
      message: 'An unexpected error occurred'
    };

    console.error('[API Error]', apiError);
    return Promise.reject(apiError);
  }
);
```

---

## Testing Strategy

### Contract Tests

```typescript
// tests/integration/accounts.spec.ts
describe('Accounts API Contract', () => {
  it('GET /accounts returns array of accounts', async () => {
    const accounts = await accountsService.getAccounts();

    expect(Array.isArray(accounts)).toBe(true);
    accounts.forEach(account => {
      expect(account).toHaveProperty('id');
      expect(account).toHaveProperty('name');
      expect(account).toHaveProperty('email');
      expect(account).toHaveProperty('roleLevel');
      expect(account).toHaveProperty('status');
    });
  });

  it('POST /create-account creates and returns account', async () => {
    const newAccount: AccountFormDto = {
      name: 'Test User',
      email: `test${Date.now()}@example.com`,
      roleLevel: 'USER',
      status: 'ON'
    };

    const created = await accountsService.createAccount(newAccount);

    expect(created.id).toBeDefined();
    expect(created.name).toBe(newAccount.name);
    expect(created.email).toBe(newAccount.email);
  });

  it('PATCH /update-account/{id} updates account', async () => {
    // First create an account
    const account = await accountsService.createAccount({
      name: 'Original Name',
      email: `original${Date.now()}@example.com`,
      roleLevel: 'USER',
      status: 'ON'
    });

    // Then update it
    const updated = await accountsService.updateAccount(account.id, {
      name: 'Updated Name',
      email: account.email,
      roleLevel: 'EDITOR',
      status: 'ON'
    });

    expect(updated.name).toBe('Updated Name');
    expect(updated.roleLevel).toBe('EDITOR');
  });
});
```

---

## Notes

✅ **API Structure Confirmed** from screenshot:
- ✅ Endpoints: `/accounts`, `/account/{id}`, `/create-account`, `/update-account/{id}`, `/delete-account/{id}`
- ✅ Schemas: `RoleLevel` (ADMIN/EDITOR/USER/CLIENT), `AccountStatus` (ON/OFF), `AccountFormDto`
- ✅ Required fields: name, email, roleLevel, status

⚠️ **To Be Discovered During Implementation**:
1. Authentication endpoints (login/logout)
2. Exact response structure for GET /accounts (array vs paginated object)
3. Error response format and codes
4. Rate limiting or request throttling
5. CORS configuration

**Frontend Implementation Priority**:
1. Test authentication flow first
2. Implement GET /accounts to verify response structure
3. Create account form with validation
4. Implement update and delete operations
5. Add error handling and user feedback

**Test Approach**:
- Use browser DevTools Network tab to inspect actual responses
- Start with Postman/Thunder Client to test endpoints before frontend integration
- Update TypeScript interfaces and Zod schemas based on real responses
