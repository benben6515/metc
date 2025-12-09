<template>
  <q-form @submit.prevent="handleSubmit" class="account-form">
    <q-card>
      <q-card-section>
        <div class="text-h5">{{ mode === 'create' ? 'Create Account' : 'Edit Account' }}</div>
      </q-card-section>

      <q-card-section>
        <error-message
          v-if="error"
          :message="error"
          @dismiss="$emit('clearError')"
        />

        <q-input
          v-model="formData.name"
          type="text"
          label="Name *"
          outlined
          :rules="nameRules"
          lazy-rules
          class="q-mb-md"
        />

        <q-input
          v-model="formData.email"
          type="email"
          label="Email *"
          outlined
          :rules="emailRules"
          lazy-rules
          class="q-mb-md"
        />

        <q-input
          v-model="formData.password"
          :type="showPassword ? 'text' : 'password'"
          :label="mode === 'create' ? 'Password *' : 'Password (optional)'"
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

        <q-select
          v-model="formData.roleLevel"
          :options="roleLevelOptions"
          label="Role Level *"
          outlined
          emit-value
          map-options
          class="q-mb-md"
        />

        <q-toggle
          v-if="mode === 'edit'"
          v-model="statusToggle"
          label="Status"
          left-label
          class="q-mb-md"
        >
          <template #default>
            <q-badge :color="statusToggle ? 'positive' : 'negative'" class="q-ml-sm">
              {{ statusToggle ? 'ON' : 'OFF' }}
            </q-badge>
          </template>
        </q-toggle>
      </q-card-section>

      <q-card-actions align="right" class="q-pa-md">
        <q-btn
          flat
          label="Cancel"
          color="grey"
          @click="handleCancel"
        />
        <q-btn
          type="submit"
          :label="mode === 'create' ? 'Create' : 'Update'"
          color="primary"
          :loading="loading"
          :disable="loading"
        />
      </q-card-actions>
    </q-card>
  </q-form>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { QForm, QCard, QCardSection, QCardActions, QInput, QSelect, QToggle, QBtn, QIcon, QBadge } from 'quasar';
import ErrorMessage from '@/components/common/ErrorMessage.vue';
import type { Account, AccountFormDto, AccountUpdateDto, RoleLevel } from '@/types/account';

interface Props {
  mode: 'create' | 'edit';
  account?: Account;
  loading?: boolean;
  error?: string;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  error: '',
});

const emit = defineEmits<{
  submit: [data: AccountFormDto | AccountUpdateDto];
  cancel: [];
  clearError: [];
}>();

const formData = ref({
  name: props.account?.name || '',
  email: props.account?.email || '',
  password: '',
  roleLevel: props.account?.roleLevel || 'USER' as RoleLevel,
});

const statusToggle = ref(props.account?.status === 'ON');
const showPassword = ref(false);

const roleLevelOptions = [
  { label: 'Admin', value: 'ADMIN' },
  { label: 'Editor', value: 'EDITOR' },
  { label: 'User', value: 'USER' },
  { label: 'Client', value: 'CLIENT' },
];

const nameRules = [
  (val: string) => !!val || 'Name is required',
  (val: string) => val.length >= 2 || 'Name must be at least 2 characters',
];

const emailRules = [
  (val: string) => !!val || 'Email is required',
  (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) || 'Please enter a valid email',
];

const passwordRules = computed(() => {
  if (props.mode === 'create') {
    return [
      (val: string) => !!val || 'Password is required',
      (val: string) => val.length >= 6 || 'Password must be at least 6 characters',
    ];
  }
  return [
    (val: string) => !val || val.length >= 6 || 'Password must be at least 6 characters if provided',
  ];
});

// Watch for account changes in edit mode
watch(() => props.account, (newAccount) => {
  if (newAccount && props.mode === 'edit') {
    formData.value.name = newAccount.name;
    formData.value.email = newAccount.email;
    formData.value.roleLevel = newAccount.roleLevel;
    statusToggle.value = newAccount.status === 'ON';
  }
}, { immediate: true });

function handleSubmit(): void {
  if (props.mode === 'create') {
    const data: AccountFormDto = {
      name: formData.value.name,
      email: formData.value.email,
      password: formData.value.password,
      roleLevel: formData.value.roleLevel,
    };
    emit('submit', data);
  } else {
    const data: AccountUpdateDto = {
      name: formData.value.name,
      email: formData.value.email,
      roleLevel: formData.value.roleLevel,
      status: statusToggle.value ? 'ON' : 'OFF',
    };
    if (formData.value.password) {
      data.password = formData.value.password;
    }
    emit('submit', data);
  }
}

function handleCancel(): void {
  emit('cancel');
}
</script>

<style scoped>
.account-form {
  width: 100%;
  max-width: 600px;
}
</style>
