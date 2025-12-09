/**
 * Pinia accounts store for managing account data
 */

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Account, AccountFormDto, AccountUpdateDto } from '@/types/account';
import type { AccountListResponse } from '@/types/api';
import { apiClient } from '@/services/api/client';
import { AccountSchema, AccountListResponseSchema } from '@/services/validation/schemas';
import { logger } from '@/utils/logger';

export const useAccountsStore = defineStore('accounts', () => {
  // State
  const accounts = ref<Account[]>([]);
  const currentAccount = ref<Account | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // Getters
  const accountCount = computed(() => accounts.value.length);
  const activeAccounts = computed(() => accounts.value.filter(acc => acc.status === 'ON'));

  // Actions
  async function fetchAccounts(): Promise<void> {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await apiClient.get<AccountListResponse>('/accounts');

      // Try to validate response, but if it fails, use raw data
      try {
        const validatedData = AccountListResponseSchema.parse(response.data);
        accounts.value = validatedData.data;
      } catch (validationError) {
        // If validation fails, check if response.data is an array
        logger.warn('Response validation failed, trying raw data', validationError);
        if (Array.isArray(response.data)) {
          accounts.value = response.data as Account[];
        } else if (response.data && Array.isArray((response.data as any).data)) {
          accounts.value = (response.data as any).data as Account[];
        } else {
          throw new Error('Cannot parse accounts response');
        }
      }

      logger.info('Accounts fetched successfully', { count: accounts.value.length });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch accounts';
      error.value = errorMessage;
      logger.error('Fetch accounts error', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchAccountById(id: string): Promise<Account> {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await apiClient.get<Account>(`/account/${id}`);

      // Validate response
      const validatedData = AccountSchema.parse(response.data);
      currentAccount.value = validatedData;

      logger.info('Account fetched successfully', { accountId: id });
      return validatedData;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch account';
      error.value = errorMessage;
      logger.error('Fetch account error', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function createAccount(accountData: AccountFormDto): Promise<Account> {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await apiClient.post<Account>('/create-account', accountData);

      // Try to validate response, but if it fails, use raw data
      let accountResult: Account;
      try {
        accountResult = AccountSchema.parse(response.data);
      } catch (validationError) {
        // If validation fails, try to use the raw response data
        logger.warn('Response validation failed, using raw data', validationError);
        accountResult = response.data as Account;
      }

      accounts.value.push(accountResult);

      logger.info('Account created successfully', { accountId: accountResult.id });
      return accountResult;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create account';
      error.value = errorMessage;
      logger.error('Create account error', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function updateAccount(id: string, accountData: AccountUpdateDto): Promise<Account> {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await apiClient.patch<Account>(`/update-account/${id}`, accountData);

      // Validate response
      const validatedData = AccountSchema.parse(response.data);

      // Update in local state
      const index = accounts.value.findIndex(acc => acc.id === id);
      if (index !== -1) {
        accounts.value[index] = validatedData;
      }

      logger.info('Account updated successfully', { accountId: id });
      return validatedData;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update account';
      error.value = errorMessage;
      logger.error('Update account error', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function deleteAccount(id: string): Promise<void> {
    isLoading.value = true;
    error.value = null;

    try {
      await apiClient.delete(`/delete-account/${id}`);

      // Remove from local state
      accounts.value = accounts.value.filter(acc => acc.id !== id);

      logger.info('Account deleted successfully', { accountId: id });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete account';
      error.value = errorMessage;
      logger.error('Delete account error', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  return {
    // State
    accounts,
    currentAccount,
    isLoading,
    error,
    // Getters
    accountCount,
    activeAccounts,
    // Actions
    fetchAccounts,
    fetchAccountById,
    createAccount,
    updateAccount,
    deleteAccount,
  };
});
