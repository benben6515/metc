import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useAuthStore } from '@/stores/auth';
import { apiClient } from '@/services/api/client';

vi.mock('@/services/api/client');

describe('Auth Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    localStorage.clear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('initializes with null user and token', () => {
    const authStore = useAuthStore();

    expect(authStore.user).toBeNull();
    expect(authStore.token).toBeNull();
    expect(authStore.isAuthenticated).toBe(false);
  });

  it('sets user and token on successful login', async () => {
    const mockResponse = {
      data: {
        token: 'test-token',
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

    expect(authStore.token).toBe('test-token');
    expect(authStore.user?.email).toBe('test@example.com');
    expect(authStore.isAuthenticated).toBe(true);
  });

  it('sets error on failed login', async () => {
    vi.mocked(apiClient.post).mockRejectedValue(new Error('Login failed'));

    const authStore = useAuthStore();

    await expect(authStore.login({
      email: 'test@example.com',
      password: 'wrongpassword',
    })).rejects.toThrow('Login failed');

    expect(authStore.error).toBe('Login failed');
    expect(authStore.isAuthenticated).toBe(false);
  });

  it('clears user and token on logout', async () => {
    const authStore = useAuthStore();
    authStore.token = 'test-token';
    authStore.user = {
      id: '1',
      name: 'Test',
      email: 'test@example.com',
      roleLevel: 'USER',
      status: 'ON',
    };

    vi.mocked(apiClient.post).mockResolvedValue({ data: {} });

    await authStore.logout();

    expect(authStore.token).toBeNull();
    expect(authStore.user).toBeNull();
    expect(authStore.isAuthenticated).toBe(false);
  });

  it('returns correct user role', () => {
    const authStore = useAuthStore();

    expect(authStore.userRole).toBeNull();

    authStore.user = {
      id: '1',
      name: 'Admin User',
      email: 'admin@example.com',
      roleLevel: 'ADMIN',
      status: 'ON',
    };

    expect(authStore.userRole).toBe('ADMIN');
  });
});
