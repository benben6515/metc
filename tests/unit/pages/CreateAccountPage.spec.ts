import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import CreateAccountPage from '@/pages/CreateAccountPage.vue';
import AccountForm from '@/components/accounts/AccountForm.vue';
import { useAccountsStore } from '@/stores/accounts';

const mockPush = vi.fn();

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe('CreateAccountPage', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    mockPush.mockClear();
  });

  it('renders AccountForm in create mode', () => {
    const wrapper = mount(CreateAccountPage);
    const form = wrapper.findComponent(AccountForm);

    expect(form.exists()).toBe(true);
    expect(form.props('mode')).toBe('create');
  });

  it('passes loading state to form', () => {
    const accountsStore = useAccountsStore();
    accountsStore.isLoading = true;

    const wrapper = mount(CreateAccountPage);
    const form = wrapper.findComponent(AccountForm);

    expect(form.props('loading')).toBe(true);
  });

  it('passes error message to form', () => {
    const accountsStore = useAccountsStore();
    accountsStore.error = 'Failed to create account';

    const wrapper = mount(CreateAccountPage);
    const form = wrapper.findComponent(AccountForm);

    expect(form.props('error')).toBe('Failed to create account');
  });

  it('calls createAccount when form is submitted', async () => {
    const wrapper = mount(CreateAccountPage);
    const accountsStore = useAccountsStore();
    accountsStore.createAccount = vi.fn().mockResolvedValue({
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      roleLevel: 'USER',
      status: 'ON',
    });

    const form = wrapper.findComponent(AccountForm);
    await form.vm.$emit('submit', {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      roleLevel: 'USER',
    });

    expect(accountsStore.createAccount).toHaveBeenCalledWith({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      roleLevel: 'USER',
    });
  });

  it('redirects to accounts page on successful create', async () => {
    const wrapper = mount(CreateAccountPage);
    const accountsStore = useAccountsStore();
    accountsStore.createAccount = vi.fn().mockResolvedValue({
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      roleLevel: 'USER',
      status: 'ON',
    });

    const form = wrapper.findComponent(AccountForm);
    await form.vm.$emit('submit', {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      roleLevel: 'USER',
    });

    await flushPromises();

    expect(mockPush).toHaveBeenCalledWith({ name: 'Accounts' });
  });

  it('redirects to accounts page when cancel is clicked', async () => {
    const wrapper = mount(CreateAccountPage);
    const form = wrapper.findComponent(AccountForm);

    await form.vm.$emit('cancel');

    expect(mockPush).toHaveBeenCalledWith({ name: 'Accounts' });
  });
});
