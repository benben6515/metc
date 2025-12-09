<template>
  <q-dialog :model-value="modelValue" @update:model-value="handleUpdate">
    <q-card style="min-width: 500px">
      <q-card-section>
        <div class="text-h6">編輯帳號</div>
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
          label="儲存變更"
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
import { ref, computed, watch } from 'vue';
import { QDialog, QCard, QCardSection, QCardActions, QInput, QSelect, QBtn } from 'quasar';
import ErrorMessage from '@/components/common/ErrorMessage.vue';
import { useAccountsStore } from '@/stores/accounts';
import type { RoleLevel, AccountStatus, Account } from '@/types/account';

interface Props {
  modelValue: boolean;
  account: Account | null;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  success: [accountId: string];
}>();

const accountsStore = useAccountsStore();

const formData = ref({
  name: '',
  email: '',
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

// Watch for account changes to populate form
watch(() => props.account, (newAccount) => {
  if (newAccount) {
    formData.value = {
      name: newAccount.name,
      email: newAccount.email,
      roleLevel: newAccount.roleLevel,
      status: newAccount.status || 'ON', // Default to 'ON' if not set
    };
  }
}, { immediate: true });

function handleUpdate(value: boolean): void {
  emit('update:modelValue', value);
}

async function handleSubmit(): Promise<void> {
  if (!isFormValid.value || !props.account) return;

  isLoading.value = true;
  error.value = null;

  try {
    await accountsStore.updateAccount(props.account.id, {
      name: formData.value.name,
      email: formData.value.email,
      roleLevel: formData.value.roleLevel,
      status: formData.value.status,
    });

    emit('success', props.account.id);
    emit('update:modelValue', false);
  } catch (err) {
    // Show user-friendly error message
    console.error('Update account error:', err);

    if (err instanceof Error) {
      const errorMessage = err.message;

      // Check for specific error patterns
      if (errorMessage.includes('invalid_type') || errorMessage.includes('Required') || errorMessage.includes('expected')) {
        error.value = '更新帳號失敗：請確認所有必填欄位已正確填寫';
      } else if (errorMessage.includes('404')) {
        error.value = '更新帳號失敗：帳號不存在';
      } else if (errorMessage.includes('400')) {
        error.value = '更新帳號失敗：資料驗證失敗';
      } else if (errorMessage.includes('email')) {
        error.value = '更新帳號失敗：電子郵件格式不正確';
      } else {
        error.value = '更新帳號失敗，請稍後再試';
      }
    } else {
      error.value = '更新帳號失敗，請稍後再試';
    }
  } finally {
    isLoading.value = false;
  }
}

function handleCancel(): void {
  emit('update:modelValue', false);
  error.value = null;
}
</script>

<style scoped>
:deep(.q-card) {
  border-radius: 12px;
}

:deep(.text-h6) {
  font-weight: 600;
  color: #1a1a1a;
}

:deep(.q-field__label) {
  font-weight: 500;
}

:deep(.q-btn) {
  font-weight: 500;
  text-transform: none;
}

:deep(.q-btn--flat) {
  font-weight: 400;
}
</style>
