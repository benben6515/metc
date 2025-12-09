/**
 * Pinia authentication store
 */

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { User, LoginCredentials, LoginResponse } from '@/types/auth';
import { apiClient } from '@/services/api/client';
import { LoginResponseSchema } from '@/services/validation/schemas';
import { logger } from '@/utils/logger';

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null);
  const token = ref<string | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // Getters
  const isAuthenticated = computed(() => !!token.value && !!user.value);
  const userRole = computed(() => user.value?.roleLevel || null);

  // Actions
  async function login(credentials: LoginCredentials): Promise<void> {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await apiClient.post<LoginResponse>('/login', credentials);

      // Validate response
      const validatedData = LoginResponseSchema.parse(response.data);

      token.value = validatedData.token;
      user.value = validatedData.user;

      // Persist token
      localStorage.setItem('authToken', validatedData.token);

      logger.info('User logged in successfully', { userId: user.value.id });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      error.value = errorMessage;
      logger.error('Login error', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function logout(): Promise<void> {
    try {
      // Call logout endpoint if available
      await apiClient.post('/logout');
    } catch (err) {
      logger.warn('Logout API call failed', err);
    } finally {
      // Clear local state regardless of API success
      user.value = null;
      token.value = null;
      localStorage.removeItem('authToken');
      logger.info('User logged out');
    }
  }

  function initializeAuth(): void {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      token.value = storedToken;
      // Note: User data should be fetched from API in real implementation
      // For now, we'll let the router guard handle redirecting to fetch user
    }
  }

  return {
    // State
    user,
    token,
    isLoading,
    error,
    // Getters
    isAuthenticated,
    userRole,
    // Actions
    login,
    logout,
    initializeAuth,
  };
});
