<template>
  <div class="login-page">
    <div class="login-container">
      <login-form
        :loading="authStore.isLoading"
        :error="authStore.error || ''"
        @submit="handleLogin"
        @clear-error="clearError"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import LoginForm from '@/components/auth/LoginForm.vue';
import { useAuthStore } from '@/stores/auth';
import type { LoginCredentials } from '@/types/auth';

const router = useRouter();
const authStore = useAuthStore();

async function handleLogin(credentials: LoginCredentials): Promise<void> {
  try {
    await authStore.login(credentials);
    // Redirect to accounts page on successful login
    await router.push({ name: 'Accounts' });
  } catch (error) {
    // Error is already set in the auth store
  }
}

function clearError(): void {
  authStore.error = null;
}
</script>

<style scoped>
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 2rem;
}
</style>
