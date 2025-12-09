<template>
  <q-form @submit.prevent="handleSubmit" class="login-form">
    <q-card>
      <q-card-section>
        <div class="text-h5 text-center">Login</div>
      </q-card-section>

      <q-card-section>
        <error-message
          v-if="error"
          :message="error"
          @dismiss="$emit('clearError')"
        />

        <q-input
          v-model="email"
          type="email"
          label="Email"
          outlined
          :rules="emailRules"
          lazy-rules
          class="q-mb-md"
        />

        <q-input
          v-model="password"
          :type="showPassword ? 'text' : 'password'"
          label="Password"
          outlined
          :rules="passwordRules"
          lazy-rules
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
      </q-card-section>

      <q-card-actions align="center" class="q-pa-md">
        <q-btn
          type="submit"
          color="primary"
          label="Login"
          :loading="loading"
          :disable="loading"
          class="full-width"
        />
      </q-card-actions>
    </q-card>
  </q-form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { QForm, QCard, QCardSection, QCardActions, QInput, QBtn, QIcon } from 'quasar';
import ErrorMessage from '@/components/common/ErrorMessage.vue';
import type { LoginCredentials } from '@/types/auth';

interface Props {
  loading?: boolean;
  error?: string;
}

withDefaults(defineProps<Props>(), {
  loading: false,
  error: '',
});

const emit = defineEmits<{
  submit: [credentials: LoginCredentials];
  clearError: [];
}>();

const email = ref('');
const password = ref('');
const showPassword = ref(false);

const emailRules = [
  (val: string) => !!val || 'Email is required',
  (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) || 'Please enter a valid email',
];

const passwordRules = [
  (val: string) => !!val || 'Password is required',
];

function handleSubmit(): void {
  emit('submit', {
    email: email.value,
    password: password.value,
  });
}
</script>

<style scoped>
.login-form {
  width: 100%;
  max-width: 400px;
}
</style>
