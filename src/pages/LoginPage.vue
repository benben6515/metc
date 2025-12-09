<template>
  <div class="login-page">
    <div class="login-container">
      <q-card class="login-card">
        <!-- Icon -->
        <div class="login-icon">
          <q-icon name="login" size="32px" />
        </div>

        <!-- Title -->
        <div class="login-title">歡迎回來</div>
        <div class="login-subtitle">請登入您的帳號以繼續</div>

        <q-card-section class="form-section">
          <q-form @submit.prevent="handleLogin">
            <!-- Email Field -->
            <div class="form-label">電子郵件</div>
            <q-input
              v-model="email"
              type="email"
              outlined
              placeholder="your@email.com"
              class="q-mb-md"
            >
              <template #prepend>
                <q-icon name="email" color="grey-6" />
              </template>
            </q-input>

            <!-- Password Field -->
            <div class="form-label">密碼</div>
            <q-input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              outlined
              placeholder="········"
              class="q-mb-md"
            >
              <template #prepend>
                <q-icon name="lock" color="grey-6" />
              </template>
              <template #append>
                <q-icon
                  :name="showPassword ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  color="grey-6"
                  @click="showPassword = !showPassword"
                />
              </template>
            </q-input>

            <!-- Remember me and Forgot password -->
            <div class="remember-row">
              <q-checkbox v-model="rememberMe" label="記住我" dense />
              <a href="#" class="forgot-link">忘記密碼？</a>
            </div>

            <!-- Login Button -->
            <q-btn
              type="submit"
              color="primary"
              label="登入"
              icon-right="arrow_forward"
              unelevated
              :loading="isLoading"
              :disable="isLoading"
              class="full-width login-btn"
            />

            <!-- Info Message -->
            <div class="info-message">
              <q-icon name="lightbulb" size="18px" color="info" />
              <span>提示：輸入任意電子郵件和密碼即可登入</span>
            </div>
          </q-form>
        </q-card-section>

        <!-- Error Message -->
        <q-card-section v-if="error" class="error-section">
          <error-message
            :message="error"
            @dismiss="error = null"
          />
        </q-card-section>
      </q-card>

      <!-- Register Link -->
      <div class="register-link">
        還沒有帳號？<a @click="showRegisterDialog = true">立即註冊</a>
      </div>
    </div>

    <!-- Register Dialog -->
    <register-dialog
      v-model="showRegisterDialog"
      @success="handleRegisterSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { QCard, QCardSection, QForm, QInput, QBtn, QCheckbox, QIcon, useQuasar } from 'quasar';
import ErrorMessage from '@/components/common/ErrorMessage.vue';
import RegisterDialog from '@/components/accounts/RegisterDialog.vue';
import { useAuthStore } from '@/stores/auth';
import { useAccountsStore } from '@/stores/accounts';

const router = useRouter();
const authStore = useAuthStore();
const accountsStore = useAccountsStore();
const $q = useQuasar();

const email = ref('');
const password = ref('');
const showPassword = ref(false);
const rememberMe = ref(false);
const isLoading = ref(false);
const error = ref<string | null>(null);
const showRegisterDialog = ref(false);

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

function handleRegisterSuccess(): void {
  // Show success toast
  $q.notify({
    type: 'positive',
    message: '註冊成功！正在為您登入...',
    position: 'top-right',
    timeout: 2000,
  });

  // Close the dialog
  showRegisterDialog.value = false;

  // The RegisterDialog already handles auto-login for ADMIN users
  // and redirects to the accounts page
}
</script>

<style scoped>
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #e8eaf6;
  padding: 1rem;
}

.login-container {
  width: 100%;
  max-width: 400px;
}

.login-card {
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  padding: 2rem 1.5rem;
}

.login-icon {
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin: 0 auto 1.5rem;
}

.login-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1a1a1a;
  text-align: center;
  margin-bottom: 0.5rem;
}

.login-subtitle {
  font-size: 0.9rem;
  color: #666;
  text-align: center;
  margin-bottom: 2rem;
}

.form-section {
  padding: 0 !important;
}

.form-label {
  font-size: 0.9rem;
  font-weight: 500;
  color: #333;
  margin-bottom: 0.5rem;
}

.remember-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.forgot-link {
  color: #667eea;
  text-decoration: none;
  font-size: 0.9rem;
  cursor: pointer;
}

.forgot-link:hover {
  text-decoration: underline;
}

.login-btn {
  height: 48px;
  font-size: 1rem;
  font-weight: 500;
  text-transform: none;
  margin-bottom: 1rem;
}

.info-message {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: #e3f2fd;
  border-radius: 8px;
  font-size: 0.85rem;
  color: #1976d2;
}

.error-section {
  padding: 0 0 1rem 0 !important;
}

.register-link {
  text-align: center;
  margin-top: 1.5rem;
  color: #666;
  font-size: 0.9rem;
}

.register-link a {
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
  cursor: pointer;
}

.register-link a:hover {
  text-decoration: underline;
}

@media (max-width: 600px) {
  .login-page {
    padding: 0.5rem;
  }

  .login-card {
    padding: 1.5rem 1rem;
  }

  .login-title {
    font-size: 1.3rem;
  }

  .login-subtitle {
    font-size: 0.85rem;
  }
}
</style>
