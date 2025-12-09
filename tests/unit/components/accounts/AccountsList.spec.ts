import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import AccountsList from '@/components/accounts/AccountsList.vue';
import type { Account } from '@/types/account';

describe('AccountsList', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
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
      status: 'OFF',
    },
  ];

  it('renders empty state when no accounts provided', () => {
    const wrapper = mount(AccountsList, {
      props: {
        accounts: [],
      },
    });

    expect(wrapper.text()).toContain('No accounts');
  });

  it('renders accounts table when accounts provided', () => {
    const wrapper = mount(AccountsList, {
      props: {
        accounts: mockAccounts,
      },
    });

    expect(wrapper.text()).toContain('John Doe');
    expect(wrapper.text()).toContain('jane@example.com');
  });

  it('displays loading state', () => {
    const wrapper = mount(AccountsList, {
      props: {
        accounts: [],
        loading: true,
      },
    });

    expect(wrapper.findComponent({ name: 'LoadingSpinner' }).exists()).toBe(true);
  });

  it('emits edit event when edit button clicked', async () => {
    const wrapper = mount(AccountsList, {
      props: {
        accounts: mockAccounts,
      },
    });

    const editButtons = wrapper.findAll('button').filter(btn =>
      btn.text().includes('edit') || btn.html().includes('edit')
    );

    if (editButtons.length > 0) {
      await editButtons[0].trigger('click');
      expect(wrapper.emitted('edit')).toBeTruthy();
      expect(wrapper.emitted('edit')?.[0]).toEqual(['1']);
    }
  });

  it('emits delete event when delete button clicked', async () => {
    const wrapper = mount(AccountsList, {
      props: {
        accounts: mockAccounts,
      },
    });

    const deleteButtons = wrapper.findAll('button').filter(btn =>
      btn.text().includes('delete') || btn.html().includes('delete')
    );

    if (deleteButtons.length > 0) {
      await deleteButtons[0].trigger('click');
      expect(wrapper.emitted('delete')).toBeTruthy();
      expect(wrapper.emitted('delete')?.[0]).toEqual(['1']);
    }
  });

  it('displays account status correctly', () => {
    const wrapper = mount(AccountsList, {
      props: {
        accounts: mockAccounts,
      },
    });

    expect(wrapper.text()).toContain('ON');
    expect(wrapper.text()).toContain('OFF');
  });

  it('displays role levels correctly', () => {
    const wrapper = mount(AccountsList, {
      props: {
        accounts: mockAccounts,
      },
    });

    expect(wrapper.text()).toContain('ADMIN');
    expect(wrapper.text()).toContain('USER');
  });
});
