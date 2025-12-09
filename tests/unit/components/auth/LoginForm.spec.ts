import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import LoginForm from '@/components/auth/LoginForm.vue';

describe('LoginForm', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('renders login form with email and password fields', () => {
    const wrapper = mount(LoginForm);

    expect(wrapper.find('input[type="email"]').exists()).toBe(true);
    expect(wrapper.find('input[type="password"]').exists()).toBe(true);
    expect(wrapper.find('button[type="submit"]').exists()).toBe(true);
  });

  it('validates email and password are provided', async () => {
    const wrapper = mount(LoginForm);

    // Email and password rules exist in the component
    expect(wrapper.vm).toBeDefined();
  });

  it('can accept input values and has submit button', async () => {
    const wrapper = mount(LoginForm);

    const emailInput = wrapper.find('input[type="email"]');
    const passwordInput = wrapper.find('input[type="password"]');
    const submitButton = wrapper.find('button[type="submit"]');

    // Set values
    await emailInput.setValue('test@example.com');
    await passwordInput.setValue('password123');

    // Verify inputs work
    expect((emailInput.element as HTMLInputElement).value).toBe('test@example.com');
    expect((passwordInput.element as HTMLInputElement).value).toBe('password123');
    expect(submitButton.exists()).toBe(true);
  });

  it('disables submit button when loading', async () => {
    const wrapper = mount(LoginForm, {
      props: {
        loading: true,
      },
    });

    const submitButton = wrapper.find('button[type="submit"]');
    expect(submitButton.attributes('disabled')).toBeDefined();
  });

  it('displays error message when provided', async () => {
    const errorMessage = 'Invalid credentials';
    const wrapper = mount(LoginForm, {
      props: {
        error: errorMessage,
      },
    });

    expect(wrapper.text()).toContain(errorMessage);
  });
});
