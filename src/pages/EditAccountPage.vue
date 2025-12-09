<template>
  <div class="edit-account-page">
    <loading-spinner v-if="!accountsStore.currentAccount && accountsStore.isLoading" fullscreen message="Loading account..." />

    <div v-else class="page-container">
      <account-form
        v-if="accountsStore.currentAccount"
        mode="edit"
        :account="accountsStore.currentAccount"
        :loading="accountsStore.isLoading"
        :error="accountsStore.error || ''"
        @submit="handleUpdate"
        @cancel="handleCancel"
        @clear-error="clearError"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import AccountForm from '@/components/accounts/AccountForm.vue';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
import { useAccountsStore } from '@/stores/accounts';
import type { AccountUpdateDto } from '@/types/account';

const router = useRouter();
const route = useRoute();
const accountsStore = useAccountsStore();

onMounted(async () => {
  const accountId = route.params.id as string;
  if (accountId) {
    await accountsStore.fetchAccountById(accountId);
  }
});

async function handleUpdate(data: AccountUpdateDto): Promise<void> {
  const accountId = route.params.id as string;
  try {
    await accountsStore.updateAccount(accountId, data);
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
.edit-account-page {
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
