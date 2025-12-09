import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import EditAccountPage from '@/pages/EditAccountPage.vue';
import AccountForm from '@/components/accounts/AccountForm.vue';
import { useAccountsStore } from '@/stores/accounts';
import type { Account } from '@/types/account';

const mockPush = vi.fn();
const mockRoute = {
  params: { id: '1' },
};

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  useRoute: () => mockRoute,
}));

describe('EditAccountPage', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    mockPush.mockClear();
    mockRoute.params.id = '1';
  });

  const mockAccount: Account = {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    roleLevel: 'USER',
    status: 'ON',
  };

  it('fetches account on mount', async () => {
    const accountsStore = useAccountsStore();
    accountsStore.fetchAccountById = vi.fn().mockResolvedValue(mockAccount);

    mount(EditAccountPage);
    await flushPromises();

    expect(accountsStore.fetchAccountById).toHaveBeenCalledWith('1');
  });

  it('renders AccountForm in edit mode', async () => {
    const accountsStore = useAccountsStore();
    accountsStore.fetchAccountById = vi.fn().mockResolvedValue(mockAccount);
    accountsStore.currentAccount = mockAccount;

    const wrapper = mount(EditAccountPage);
    await flushPromises();

    const form = wrapper.findComponent(AccountForm);
    expect(form.exists()).toBe(true);
    expect(form.props('mode')).toBe('edit');
  });

  it('passes account data to form', async () => {
    const accountsStore = useAccountsStore();
    accountsStore.fetchAccountById = vi.fn().mockResolvedValue(mockAccount);
    accountsStore.currentAccount = mockAccount;

    const wrapper = mount(EditAccountPage);
    await flushPromises();

    const form = wrapper.findComponent(AccountForm);
    expect(form.props('account')).toEqual(mockAccount);
  });

  it('calls updateAccount when form is submitted', async () => {
    const accountsStore = useAccountsStore();
    accountsStore.fetchAccountById = vi.fn().mockResolvedValue(mockAccount);
    accountsStore.currentAccount = mockAccount;
    accountsStore.updateAccount = vi.fn().mockResolvedValue({
      ...mockAccount,
      name: 'Updated Name',
    });

    const wrapper = mount(EditAccountPage);
    await flushPromises();

    const form = wrapper.findComponent(AccountForm);
    await form.vm.$emit('submit', {
      name: 'Updated Name',
      email: 'john@example.com',
      roleLevel: 'USER',
      status: 'ON',
    });

    expect(accountsStore.updateAccount).toHaveBeenCalledWith('1', {
      name: 'Updated Name',
      email: 'john@example.com',
      roleLevel: 'USER',
      status: 'ON',
    });
  });

  it('redirects to accounts page on successful update', async () => {
    const accountsStore = useAccountsStore();
    accountsStore.fetchAccountById = vi.fn().mockResolvedValue(mockAccount);
    accountsStore.currentAccount = mockAccount;
    accountsStore.updateAccount = vi.fn().mockResolvedValue(mockAccount);

    const wrapper = mount(EditAccountPage);
    await flushPromises();

    const form = wrapper.findComponent(AccountForm);
    await form.vm.$emit('submit', {
      name: 'Updated Name',
    });

    await flushPromises();

    expect(mockPush).toHaveBeenCalledWith({ name: 'Accounts' });
  });

  it('redirects to accounts page when cancel is clicked', async () => {
    const accountsStore = useAccountsStore();
    accountsStore.fetchAccountById = vi.fn().mockResolvedValue(mockAccount);
    accountsStore.currentAccount = mockAccount;

    const wrapper = mount(EditAccountPage);
    await flushPromises();

    const form = wrapper.findComponent(AccountForm);
    await form.vm.$emit('cancel');

    expect(mockPush).toHaveBeenCalledWith({ name: 'Accounts' });
  });

  it('shows loading state while fetching', () => {
    const accountsStore = useAccountsStore();
    accountsStore.isLoading = true;
    accountsStore.fetchAccountById = vi.fn().mockImplementation(() => new Promise(() => {}));

    const wrapper = mount(EditAccountPage);

    expect(wrapper.findComponent({ name: 'LoadingSpinner' }).exists()).toBe(true);
  });
});
