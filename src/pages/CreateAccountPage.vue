<template>
  <div class="create-account-page">
    <div class="page-container">
      <account-form
        mode="create"
        :loading="accountsStore.isLoading"
        :error="accountsStore.error || ''"
        @submit="handleCreate"
        @cancel="handleCancel"
        @clear-error="clearError"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import AccountForm from '@/components/accounts/AccountForm.vue';
import { useAccountsStore } from '@/stores/accounts';
import type { AccountFormDto, AccountUpdateDto } from '@/types/account';

const router = useRouter();
const accountsStore = useAccountsStore();

async function handleCreate(data: AccountFormDto | AccountUpdateDto): Promise<void> {
  try {
    // In create mode, data should always be AccountFormDto
    await accountsStore.createAccount(data as AccountFormDto);
    await router.push({ name: 'Accounts' });
  } catch (error) {
    // Error is handled by the store
  }
}

function handleCancel(): void {
  router.push({ name: 'Accounts' });
}

function clearError(): void {
  accountsStore.error = null;
}
</script>

<style scoped>
.create-account-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 2rem;
}

.page-container {
  width: 100%;
  max-width: 600px;
}
</style>
