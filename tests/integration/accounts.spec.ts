import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useAccountsStore } from '@/stores/accounts';
import { apiClient } from '@/services/api/client';
import type { Account } from '@/types/account';

vi.mock('@/services/api/client');

describe('Accounts Integration', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const mockAccounts: Account[] = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      roleLevel: 'ADMIN',
      status: 'ON',
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      roleLevel: 'USER',
      status: 'ON',
    },
  ];

  it('successfully fetches accounts list', async () => {
    const mockResponse = {
      data: {
        data: mockAccounts,
      },
    };

    vi.mocked(apiClient.get).mockResolvedValue(mockResponse);

    const accountsStore = useAccountsStore();
    await accountsStore.fetchAccounts();

    expect(accountsStore.accounts).toHaveLength(2);
    expect(accountsStore.accounts[0].name).toBe('John Doe');
  });

  it('successfully fetches single account by ID', async () => {
    const mockResponse = {
      data: mockAccounts[0],
    };

    vi.mocked(apiClient.get).mockResolvedValue(mockResponse);

    const accountsStore = useAccountsStore();
    const account = await accountsStore.fetchAccountById('1');

    expect(account.name).toBe('John Doe');
    expect(account.email).toBe('john@example.com');
  });

  it('successfully creates new account', async () => {
    const newAccount: Account = {
      id: '3',
      name: 'New User',
      email: 'new@example.com',
      roleLevel: 'USER',
      status: 'ON',
    };

    const mockResponse = {
      data: newAccount,
    };

    vi.mocked(apiClient.post).mockResolvedValue(mockResponse);

    const accountsStore = useAccountsStore();
    const created = await accountsStore.createAccount({
      name: 'New User',
      email: 'new@example.com',
      password: 'password123',
      roleLevel: 'USER',
    });

    expect(created.name).toBe('New User');
    expect(accountsStore.accounts).toContainEqual(newAccount);
  });

  it('successfully updates account', async () => {
    const updatedAccount: Account = {
      ...mockAccounts[0],
      name: 'Updated Name',
    };

    const mockResponse = {
      data: updatedAccount,
    };

    vi.mocked(apiClient.patch).mockResolvedValue(mockResponse);

    const accountsStore = useAccountsStore();
    accountsStore.accounts = [...mockAccounts];

    const updated = await accountsStore.updateAccount('1', {
      name: 'Updated Name',
    });

    expect(updated.name).toBe('Updated Name');
  });

  it('successfully deletes account', async () => {
    vi.mocked(apiClient.delete).mockResolvedValue({ data: {} });

    const accountsStore = useAccountsStore();
    accountsStore.accounts = [...mockAccounts];

    await accountsStore.deleteAccount('1');

    expect(accountsStore.accounts).toHaveLength(1);
    expect(accountsStore.accounts[0].id).toBe('2');
  });

  it('handles fetch accounts error', async () => {
    vi.mocked(apiClient.get).mockRejectedValue(new Error('Network error'));

    const accountsStore = useAccountsStore();

    await expect(accountsStore.fetchAccounts()).rejects.toThrow('Network error');
    expect(accountsStore.error).toBeTruthy();
  });
});
