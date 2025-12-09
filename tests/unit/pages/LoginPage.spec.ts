import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import LoginPage from '@/pages/LoginPage.vue';
import LoginForm from '@/components/auth/LoginForm.vue';
import { useAuthStore } from '@/stores/auth';

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

describe('LoginPage', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('renders LoginForm component', () => {
    const wrapper = mount(LoginPage);

    expect(wrapper.findComponent(LoginForm).exists()).toBe(true);
  });

  it('passes loading state to LoginForm', async () => {
    const authStore = useAuthStore();
    authStore.isLoading = true;

    const wrapper = mount(LoginPage);
    await wrapper.vm.$nextTick();

    const loginForm = wrapper.findComponent(LoginForm);
    expect(loginForm.props('loading')).toBe(true);
  });

  it('passes error message to LoginForm', async () => {
    const authStore = useAuthStore();
    authStore.error = 'Invalid credentials';

    const wrapper = mount(LoginPage);
    await wrapper.vm.$nextTick();

    const loginForm = wrapper.findComponent(LoginForm);
    expect(loginForm.props('error')).toBe('Invalid credentials');
  });

  it('calls auth store login when form is submitted', async () => {
    const wrapper = mount(LoginPage);

    const authStore = useAuthStore();
    authStore.login = vi.fn().mockResolvedValue(undefined);

    const loginForm = wrapper.findComponent(LoginForm);
    await loginForm.vm.$emit('submit', {
      email: 'test@example.com',
      password: 'password123',
    });

    expect(authStore.login).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });
  });
});
