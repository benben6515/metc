<template>
  <q-dialog :model-value="modelValue" @update:model-value="handleUpdate">
    <q-card style="min-width: 500px">
      <q-card-section>
        <div class="text-h6">新增帳號</div>
      </q-card-section>

      <q-card-section>
        <error-message
          v-if="error"
          :message="error"
          @dismiss="error = null"
        />

        <q-input
          v-model="formData.name"
          type="text"
          label="姓名 *"
          outlined
          placeholder="請輸入姓名"
          :rules="[val => !!val || '姓名為必填']"
          lazy-rules
          class="q-mb-md"
        />

        <q-input
          v-model="formData.email"
          type="email"
          label="電子郵件 *"
          outlined
          placeholder="email@example.com"
          :rules="[
            val => !!val || '電子郵件為必填',
            val => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) || '電子郵件格式不正確'
          ]"
          lazy-rules
          class="q-mb-md"
        />

        <q-select
          v-model="formData.roleLevel"
          :options="roleLevelOptions"
          label="角色 *"
          outlined
          emit-value
          map-options
          class="q-mb-md"
        />

        <q-select
          v-model="formData.status"
          :options="statusOptions"
          label="狀態 *"
          outlined
          emit-value
          map-options
          class="q-mb-md"
        />
      </q-card-section>

      <q-card-actions align="right" class="q-pa-md">
        <q-btn
          flat
          label="取消"
          color="grey"
          @click="handleCancel"
        />
        <q-btn
          label="新增帳號"
          color="primary"
          :loading="isLoading"
          :disable="isLoading || !isFormValid"
          @click="handleSubmit"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { QDialog, QCard, QCardSection, QCardActions, QInput, QSelect, QBtn } from 'quasar';
import ErrorMessage from '@/components/common/ErrorMessage.vue';
import { useAccountsStore } from '@/stores/accounts';
import type { RoleLevel, AccountStatus } from '@/types/account';

interface Props {
  modelValue: boolean;
}

defineProps<Props>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  success: [accountId: string];
}>();

const accountsStore = useAccountsStore();

const formData = ref({
  name: '',
  email: '',
  password: 'password123', // Default password
  roleLevel: 'USER' as RoleLevel,
  status: 'ON' as AccountStatus,
});

const isLoading = ref(false);
const error = ref<string | null>(null);

const roleLevelOptions = [
  { label: '管理員', value: 'ADMIN' },
  { label: '編輯', value: 'EDITOR' },
  { label: '用戶', value: 'USER' },
  { label: '客戶', value: 'CLIENT' },
];

const statusOptions = [
  { label: '啟用', value: 'ON' },
  { label: '停用', value: 'OFF' },
];

const isFormValid = computed(() => {
  return formData.value.name &&
         formData.value.email &&
         /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.value.email);
});

function handleUpdate(value: boolean): void {
  emit('update:modelValue', value);
}

async function handleSubmit(): Promise<void> {
  if (!isFormValid.value) return;

  isLoading.value = true;
  error.value = null;

  try {
    const newAccount = await accountsStore.createAccount({
      name: formData.value.name,
      email: formData.value.email,
      password: formData.value.password,
      roleLevel: formData.value.roleLevel,
    });

    // If status needs to be set to OFF, update it
    if (formData.value.status === 'OFF') {
      await accountsStore.updateAccount(newAccount.id, {
        status: 'OFF',
      });
    }

    emit('success', newAccount.id);
    emit('update:modelValue', false);

    // Reset form
    formData.value = {
      name: '',
      email: '',
      password: 'password123',
      roleLevel: 'USER',
      status: 'ON',
    };
  } catch (err) {
    // Show user-friendly error message
    if (err instanceof Error) {
      // Check if it's a Zod validation error
      if (err.message.includes('invalid_type') || err.message.includes('Required')) {
        error.value = '建立帳號失敗：資料格式錯誤';
      } else if (err.message.includes('404')) {
        error.value = '建立帳號失敗：API 端點不存在';
      } else if (err.message.includes('400')) {
        error.value = '建立帳號失敗：資料驗證失敗';
      } else {
        error.value = '建立帳號失敗：' + err.message;
      }
    } else {
      error.value = '建立帳號失敗，請稍後再試';
    }
  } finally {
    isLoading.value = false;
  }
}

function handleCancel(): void {
  emit('update:modelValue', false);
  // Reset form
  formData.value = {
    name: '',
    email: '',
    password: 'password123',
    roleLevel: 'USER',
    status: 'ON',
  };
  error.value = null;
}
</script>

<style scoped>
/* Styles handled by Quasar components */
</style>
