<template>
  <div class="register-page">
    <div class="register-container">
      <q-card>
        <q-card-section>
          <div class="text-h5 text-center">Register</div>
        </q-card-section>

        <q-card-section>
          <error-message
            v-if="accountsStore.error"
            :message="accountsStore.error"
            @dismiss="accountsStore.error = null"
          />

          <q-form @submit.prevent="handleRegister">
            <q-input
              v-model="formData.name"
              type="text"
              label="Name *"
              outlined
              :rules="[val => !!val || 'Name is required']"
              class="q-mb-md"
            />

            <q-input
              v-model="formData.email"
              type="email"
              label="Email *"
              outlined
              :rules="[
                val => !!val || 'Email is required',
                val => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) || 'Invalid email'
              ]"
              class="q-mb-md"
            />

            <q-input
              v-model="formData.password"
              :type="showPassword ? 'text' : 'password'"
              label="Password *"
              outlined
              :rules="[val => !!val || 'Password is required']"
              class="q-mb-md"
            >
              <template #append>
                <q-icon
                  :name="showPassword ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="showPassword = !showPassword"
                />
              </template>
            </q-input>

            <q-select
              v-model="formData.roleLevel"
              :options="roleLevelOptions"
              label="Role Level *"
              outlined
              emit-value
              map-options
              class="q-mb-md"
            />

            <q-btn
              type="submit"
              color="primary"
              label="Register"
              :loading="accountsStore.isLoading"
              :disable="accountsStore.isLoading"
              class="full-width q-mb-md"
            />

            <div class="text-center">
              <q-btn
                flat
                label="Already have an account? Login"
                color="primary"
                @click="goToLogin"
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
import { QCard, QCardSection, QForm, QInput, QSelect, QBtn, QIcon } from 'quasar';
import ErrorMessage from '@/components/common/ErrorMessage.vue';
import { useAccountsStore } from '@/stores/accounts';
import { useAuthStore } from '@/stores/auth';
import type { RoleLevel } from '@/types/account';

const router = useRouter();
const accountsStore = useAccountsStore();
const authStore = useAuthStore();

const formData = ref({
  name: '',
  email: '',
  password: 'password123', // Default password for now
  roleLevel: 'ADMIN' as RoleLevel, // Default to ADMIN for testing
});

const showPassword = ref(false);

const roleLevelOptions = [
  { label: 'Admin', value: 'ADMIN' },
  { label: 'Editor', value: 'EDITOR' },
  { label: 'User', value: 'USER' },
  { label: 'Client', value: 'CLIENT' },
];

async function handleRegister(): Promise<void> {
  try {
    // Create the account
    const newAccount = await accountsStore.createAccount(formData.value);

    // Auto-login after registration if user is ADMIN
    if (newAccount.roleLevel === 'ADMIN') {
      // Set auth state directly
      authStore.user = {
        id: newAccount.id,
        name: newAccount.name,
        email: newAccount.email,
        roleLevel: newAccount.roleLevel,
        status: newAccount.status || 'ON',
      };
      authStore.token = 'mock-token-' + newAccount.id;
      localStorage.setItem('authToken', authStore.token);

      // Redirect to accounts page
      await router.push({ name: 'Accounts' });
    } else {
      // Redirect to login if not admin
      await router.push({ name: 'Login' });
    }
  } catch (error) {
    // Show user-friendly error message
    if (accountsStore.error) {
      if (accountsStore.error.includes('invalid_type') || accountsStore.error.includes('Required')) {
        accountsStore.error = '註冊失敗：資料格式錯誤';
      } else if (accountsStore.error.includes('404')) {
        accountsStore.error = '註冊失敗：API 端點不存在';
      } else if (accountsStore.error.includes('400')) {
        accountsStore.error = '註冊失敗：資料驗證失敗';
      }
    }
  }
}

function goToLogin(): void {
  router.push({ name: 'Login' });
}
</script>

<style scoped>
.register-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.register-container {
  width: 100%;
  max-width: 500px;
  padding: 2rem;
}
</style>
