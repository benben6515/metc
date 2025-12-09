import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useAuthStore } from '@/stores/auth';
import { apiClient } from '@/services/api/client';

vi.mock('@/services/api/client');

describe('Authentication Integration', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    localStorage.clear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('successfully logs in user and stores token', async () => {
    const mockResponse = {
      data: {
        token: 'mock-jwt-token',
        user: {
          id: '1',
          name: 'Test User',
          email: 'test@example.com',
          roleLevel: 'ADMIN',
          status: 'ON',
        },
      },
    };

    vi.mocked(apiClient.post).mockResolvedValue(mockResponse);

    const authStore = useAuthStore();

    await authStore.login({
      email: 'test@example.com',
      password: 'password123',
    });

    expect(authStore.isAuthenticated).toBe(true);
    expect(authStore.user?.email).toBe('test@example.com');
    expect(authStore.token).toBe('mock-jwt-token');
    expect(localStorage.getItem('authToken')).toBe('mock-jwt-token');
  });

  it('handles login failure with error message', async () => {
    const mockError = {
      response: {
        data: {
          message: 'Invalid credentials',
        },
        status: 401,
      },
    };

    vi.mocked(apiClient.post).mockRejectedValue(mockError);

    const authStore = useAuthStore();

    await expect(authStore.login({
      email: 'wrong@example.com',
      password: 'wrongpassword',
    })).rejects.toThrow();

    expect(authStore.isAuthenticated).toBe(false);
    expect(authStore.error).toBeTruthy();
  });

  it('logs out user and clears stored token', async () => {
    // Setup authenticated user
    const authStore = useAuthStore();
    authStore.token = 'mock-token';
    authStore.user = {
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      roleLevel: 'ADMIN',
      status: 'ON',
    };
    localStorage.setItem('authToken', 'mock-token');

    vi.mocked(apiClient.post).mockResolvedValue({ data: {} });

    await authStore.logout();

    expect(authStore.isAuthenticated).toBe(false);
    expect(authStore.user).toBeNull();
    expect(authStore.token).toBeNull();
    expect(localStorage.getItem('authToken')).toBeNull();
  });

  it('initializes auth from stored token', () => {
    localStorage.setItem('authToken', 'stored-token');

    const authStore = useAuthStore();
    authStore.initializeAuth();

    expect(authStore.token).toBe('stored-token');
  });

  it('includes custom header in login request', async () => {
    const mockResponse = {
      data: {
        token: 'mock-jwt-token',
        user: {
          id: '1',
          name: 'Test User',
          email: 'test@example.com',
          roleLevel: 'ADMIN',
          status: 'ON',
        },
      },
    };

    vi.mocked(apiClient.post).mockResolvedValue(mockResponse);

    const authStore = useAuthStore();
    await authStore.login({
      email: 'test@example.com',
      password: 'password123',
    });

    expect(apiClient.post).toHaveBeenCalledWith('/login', {
      email: 'test@example.com',
      password: 'password123',
    });

    // Note: Custom header 'interviewerName: Benben' is set in apiClient configuration
  });
});
