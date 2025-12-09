import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import AccountsPage from '@/pages/AccountsPage.vue';
import AccountsList from '@/components/accounts/AccountsList.vue';
import { useAccountsStore } from '@/stores/accounts';

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

describe('AccountsPage', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('renders AccountsList component', () => {
    const wrapper = mount(AccountsPage);
    expect(wrapper.findComponent(AccountsList).exists()).toBe(true);
  });

  it('fetches accounts on mount', () => {
    const accountsStore = useAccountsStore();
    accountsStore.fetchAccounts = vi.fn().mockResolvedValue(undefined);

    mount(AccountsPage);

    expect(accountsStore.fetchAccounts).toHaveBeenCalled();
  });

  it('passes accounts from store to AccountsList', async () => {
    const accountsStore = useAccountsStore();
    accountsStore.accounts = [
      {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        roleLevel: 'USER',
        status: 'ON',
      },
    ];

    const wrapper = mount(AccountsPage);
    await wrapper.vm.$nextTick();

    const accountsList = wrapper.findComponent(AccountsList);
    expect(accountsList.props('accounts')).toEqual(accountsStore.accounts);
  });

  it('passes loading state to AccountsList', async () => {
    const accountsStore = useAccountsStore();
    accountsStore.isLoading = true;

    const wrapper = mount(AccountsPage);
    await wrapper.vm.$nextTick();

    const accountsList = wrapper.findComponent(AccountsList);
    expect(accountsList.props('loading')).toBe(true);
  });
});
