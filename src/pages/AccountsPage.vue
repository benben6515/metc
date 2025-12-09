<template>
  <div class="accounts-page">
    <div class="page-header">
      <h1 class="text-h4">帳號管理系統</h1>
      <div class="subtitle">管理您的所有帳號</div>
      <q-btn
        color="primary"
        icon="add"
        label="新增帳號"
        @click="showRegisterDialog = true"
      />
    </div>

    <error-message
      v-if="accountsStore.error"
      :message="accountsStore.error"
      @dismiss="accountsStore.error = null"
    />

    <accounts-list
      :accounts="accountsStore.accounts"
      :loading="accountsStore.isLoading"
      @edit="handleEdit"
      @delete="handleDelete"
    />

    <register-dialog
      v-model="showRegisterDialog"
      @success="handleRegisterSuccess"
    />

    <confirm-dialog
      v-model="showDeleteDialog"
      title="Delete Account"
      message="Are you sure you want to delete this account? This action cannot be undone."
      confirm-label="Delete"
      confirm-color="negative"
      @confirm="confirmDelete"
      @cancel="cancelDelete"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { QBtn } from 'quasar';
import AccountsList from '@/components/accounts/AccountsList.vue';
import RegisterDialog from '@/components/accounts/RegisterDialog.vue';
import ErrorMessage from '@/components/common/ErrorMessage.vue';
import ConfirmDialog from '@/components/common/ConfirmDialog.vue';
import { useAccountsStore } from '@/stores/accounts';

const router = useRouter();
const accountsStore = useAccountsStore();

const showRegisterDialog = ref(false);
const showDeleteDialog = ref(false);
const accountToDelete = ref<string | null>(null);

onMounted(async () => {
  await accountsStore.fetchAccounts();
});

function handleRegisterSuccess(): void {
  // Refresh the accounts list
  accountsStore.fetchAccounts();
}

function handleEdit(accountId: string): void {
  router.push({ name: 'EditAccount', params: { id: accountId } });
}

function handleDelete(accountId: string): void {
  accountToDelete.value = accountId;
  showDeleteDialog.value = true;
}

async function confirmDelete(): Promise<void> {
  if (accountToDelete.value) {
    try {
      await accountsStore.deleteAccount(accountToDelete.value);
    } catch (error) {
      // Error is handled by the store
    }
  }
  accountToDelete.value = null;
}

function cancelDelete(): void {
  accountToDelete.value = null;
}
</script>

<style scoped>
.accounts-page {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  position: relative;
}

.page-header .text-h4 {
  margin: 0;
}

.page-header .subtitle {
  position: absolute;
  top: 40px;
  left: 0;
  color: #666;
  font-size: 0.9rem;
}

@media (max-width: 600px) {
  .page-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
}
</style>
