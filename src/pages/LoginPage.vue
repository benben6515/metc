<template>
  <div class="login-page">
    <div class="login-container">
      <q-card>
        <q-card-section>
          <div class="text-h5 text-center">Login</div>
        </q-card-section>

        <q-card-section>
          <error-message
            v-if="error"
            :message="error"
            @dismiss="error = null"
          />

          <q-form @submit.prevent="handleLogin">
            <q-input
              v-model="email"
              type="email"
              label="Email"
              outlined
              class="q-mb-md"
            />

            <q-input
              v-model="password"
              type="password"
              label="Password (any text)"
              outlined
              class="q-mb-md"
            />

            <q-btn
              type="submit"
              color="primary"
              label="Login"
              :loading="isLoading"
              :disable="isLoading"
              class="full-width q-mb-md"
            />

            <div class="text-center">
              <q-btn
                flat
                label="Don't have an account? Register"
                color="primary"
                @click="goToRegister"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { QCard, QCardSection, QForm, QInput, QBtn, useQuasar } from 'quasar';
import ErrorMessage from '@/components/common/ErrorMessage.vue';
import { useAuthStore } from '@/stores/auth';
import { useAccountsStore } from '@/stores/accounts';

const router = useRouter();
const authStore = useAuthStore();
const accountsStore = useAccountsStore();
const $q = useQuasar();

const email = ref('');
const password = ref('');
const isLoading = ref(false);
const error = ref<string | null>(null);

async function handleLogin(): Promise<void> {
  if (!email.value) {
    error.value = 'Please enter your email';
    return;
  }

  isLoading.value = true;
  error.value = null;

  try {
    // Fetch all accounts and find the user
    await accountsStore.fetchAccounts();

    console.log('Accounts loaded:', accountsStore.accounts);
    console.log('Looking for email:', email.value);

    const user = accountsStore.accounts.find(acc => acc.email === email.value);

    if (!user) {
      error.value = `Account not found for ${email.value}. Please register first.`;
      isLoading.value = false;
      return;
    }

    console.log('User found:', user);

    if (user.roleLevel !== 'ADMIN') {
      error.value = `Only ADMIN users can login. Your role: ${user.roleLevel}`;
      isLoading.value = false;
      return;
    }

    // Set auth state
    authStore.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      roleLevel: user.roleLevel,
      status: user.status || 'ON',
    };
    authStore.token = 'mock-token-' + user.id;
    localStorage.setItem('authToken', authStore.token);

    console.log('Auth state set, redirecting...');

    // Show success notification
    $q.notify({
      type: 'positive',
      message: `歡迎回來，${user.name}！`,
      position: 'top-right',
      timeout: 2000,
    });

    // Redirect to accounts page
    await router.push({ name: 'Accounts' });
  } catch (err) {
    console.error('Login error:', err);
    error.value = err instanceof Error ? `Failed to login: ${err.message}` : 'Failed to login. Please try again.';
  } finally {
    isLoading.value = false;
  }
}

function goToRegister(): void {
  router.push({ name: 'Register' });
}
</script>

<style scoped>
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1rem;
}

.login-container {
  width: 100%;
  max-width: 450px;
}

.login-container :deep(.q-card) {
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

.text-h5 {
  font-weight: 600;
  color: #1a1a1a;
}

@media (max-width: 600px) {
  .login-page {
    padding: 0.5rem;
  }

  .login-container {
    max-width: 100%;
  }
}
</style>
