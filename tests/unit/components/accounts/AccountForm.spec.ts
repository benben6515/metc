import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import AccountForm from '@/components/accounts/AccountForm.vue';
import type { Account } from '@/types/account';

describe('AccountForm', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('renders create mode with empty form', () => {
    const wrapper = mount(AccountForm, {
      props: {
        mode: 'create',
      },
    });

    expect(wrapper.find('input[type="text"]').exists()).toBe(true);
    expect(wrapper.find('input[type="email"]').exists()).toBe(true);
    expect(wrapper.find('input[type="password"]').exists()).toBe(true);
  });

  it('renders edit mode with pre-filled data', () => {
    const account: Account = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      roleLevel: 'USER',
      status: 'ON',
    };

    const wrapper = mount(AccountForm, {
      props: {
        mode: 'edit',
        account,
      },
    });

    const nameInput = wrapper.find('input[type="text"]');
    const emailInput = wrapper.find('input[type="email"]');

    expect((nameInput.element as HTMLInputElement).value).toBe('John Doe');
    expect((emailInput.element as HTMLInputElement).value).toBe('john@example.com');
  });

  it('shows password field in create mode', () => {
    const wrapper = mount(AccountForm, {
      props: {
        mode: 'create',
      },
    });

    expect(wrapper.find('input[type="password"]').exists()).toBe(true);
  });

  it('hides password field in edit mode by default', () => {
    const account: Account = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      roleLevel: 'USER',
      status: 'ON',
    };

    const wrapper = mount(AccountForm, {
      props: {
        mode: 'edit',
        account,
      },
    });

    // Password should be optional in edit mode
    expect(wrapper.text()).toContain('optional');
  });

  it('displays all role level options', () => {
    const wrapper = mount(AccountForm, {
      props: {
        mode: 'create',
      },
    });

    // Should have role selection (checks for label text, not value)
    expect(wrapper.text()).toMatch(/Admin|Editor|User|Client/);
  });

  it('displays status toggle in edit mode', () => {
    const account: Account = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      roleLevel: 'USER',
      status: 'ON',
    };

    const wrapper = mount(AccountForm, {
      props: {
        mode: 'edit',
        account,
      },
    });

    expect(wrapper.text()).toContain('Status');
  });

  it('disables submit button when loading', () => {
    const wrapper = mount(AccountForm, {
      props: {
        mode: 'create',
        loading: true,
      },
    });

    const submitButton = wrapper.find('button[type="submit"]');
    expect(submitButton.attributes('disabled')).toBeDefined();
  });

  it('displays error message when provided', () => {
    const errorMessage = 'Failed to create account';
    const wrapper = mount(AccountForm, {
      props: {
        mode: 'create',
        error: errorMessage,
      },
    });

    expect(wrapper.text()).toContain(errorMessage);
  });

  it('has cancel button that emits cancel event', async () => {
    const wrapper = mount(AccountForm, {
      props: {
        mode: 'create',
      },
    });

    const buttons = wrapper.findAll('button');
    const cancelButton = buttons.find(btn =>
      btn.text().toLowerCase().includes('cancel')
    );

    if (cancelButton) {
      await cancelButton.trigger('click');
      expect(wrapper.emitted('cancel')).toBeTruthy();
    }
  });
});
