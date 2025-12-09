<template>
  <div class="accounts-page">
    <!-- Top Navigation -->
    <top-nav-bar />

    <!-- Main Content -->
    <div class="page-content">
      <!-- Search and Add Button -->
      <div class="search-section">
        <q-input
          v-model="searchQuery"
          outlined
          placeholder="搜尋帳號（姓名、郵件、角色）..."
          class="search-input"
        >
          <template #prepend>
            <q-icon name="search" />
          </template>
        </q-input>
        <q-btn
          color="primary"
          icon="add"
          label="新增帳號"
          unelevated
          class="add-btn"
          @click="showRegisterDialog = true"
        />
      </div>

      <!-- Statistics Cards -->
      <div class="stats-container">
        <q-card class="stat-card">
          <q-card-section>
            <div class="stat-label">總帳號數</div>
            <div class="stat-value">{{ accountsStore.accountCount }}</div>
          </q-card-section>
        </q-card>

        <q-card class="stat-card">
          <q-card-section>
            <div class="stat-label">啟用中</div>
            <div class="stat-value">{{ accountsStore.activeAccounts.length }}</div>
          </q-card-section>
        </q-card>

        <q-card class="stat-card">
          <q-card-section>
            <div class="stat-label">已停用</div>
            <div class="stat-value">{{ inactiveCount }}</div>
          </q-card-section>
        </q-card>
      </div>

      <error-message
        v-if="accountsStore.error"
        :message="accountsStore.error"
        @dismiss="accountsStore.error = null"
      />

      <!-- Loading State -->
      <loading-spinner v-if="accountsStore.isLoading" message="載入中..." />

      <!-- Empty State -->
      <div v-else-if="filteredAccounts.length === 0" class="empty-state">
        <q-icon name="search_off" size="64px" color="grey" />
        <p class="text-h6 text-grey">找不到符合條件的帳號</p>
      </div>

      <!-- Account Cards Grid -->
      <div v-else class="accounts-grid">
        <account-card
          v-for="account in filteredAccounts"
          :key="account.id"
          :account="account"
          @edit="handleEdit"
          @delete="handleDelete"
        />
      </div>
    </div>

    <register-dialog
      v-model="showRegisterDialog"
      @success="handleRegisterSuccess"
    />

    <edit-account-dialog
      v-model="showEditDialog"
      :account="accountToEdit"
      @success="handleEditSuccess"
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
import { ref, computed, onMounted } from 'vue';
import { QBtn, QCard, QCardSection, QIcon, QInput, useQuasar } from 'quasar';
import TopNavBar from '@/components/layout/TopNavBar.vue';
import AccountCard from '@/components/accounts/AccountCard.vue';
import RegisterDialog from '@/components/accounts/RegisterDialog.vue';
import EditAccountDialog from '@/components/accounts/EditAccountDialog.vue';
import ErrorMessage from '@/components/common/ErrorMessage.vue';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
import ConfirmDialog from '@/components/common/ConfirmDialog.vue';
import { useAccountsStore } from '@/stores/accounts';
import type { Account } from '@/types/account';

const accountsStore = useAccountsStore();
const $q = useQuasar();

const searchQuery = ref('');
const showRegisterDialog = ref(false);
const showEditDialog = ref(false);
const showDeleteDialog = ref(false);
const accountToEdit = ref<Account | null>(null);
const accountToDelete = ref<string | null>(null);

// Computed statistics
const inactiveCount = computed(() => accountsStore.accounts.filter(acc => acc.status === 'OFF').length);

// Filtered accounts based on search
const filteredAccounts = computed(() => {
  if (!searchQuery.value) {
    return accountsStore.accounts;
  }

  const query = searchQuery.value.toLowerCase();
  return accountsStore.accounts.filter(account =>
    account.name.toLowerCase().includes(query) ||
    account.email.toLowerCase().includes(query) ||
    account.roleLevel.toLowerCase().includes(query)
  );
});

onMounted(async () => {
  await accountsStore.fetchAccounts();
});

function handleRegisterSuccess(): void {
  // Refresh the accounts list
  accountsStore.fetchAccounts();

  // Show success notification
  $q.notify({
    type: 'positive',
    message: '帳號建立成功',
    position: 'top-right',
    timeout: 2000,
    actions: [
      { label: '關閉', color: 'white', handler: () => {} }
    ]
  });
}

function handleEdit(accountId: string): void {
  const account = accountsStore.accounts.find(acc => acc.id === accountId);
  if (account) {
    accountToEdit.value = account;
    showEditDialog.value = true;
  }
}

function handleEditSuccess(): void {
  // Refresh the accounts list
  accountsStore.fetchAccounts();

  // Show success notification
  $q.notify({
    type: 'positive',
    message: '帳號更新成功',
    position: 'top-right',
    timeout: 2000,
    actions: [
      { label: '關閉', color: 'white', handler: () => {} }
    ]
  });
}

function handleDelete(accountId: string): void {
  accountToDelete.value = accountId;
  showDeleteDialog.value = true;
}

async function confirmDelete(): Promise<void> {
  if (accountToDelete.value) {
    try {
      await accountsStore.deleteAccount(accountToDelete.value);

      // Show success notification
      $q.notify({
        type: 'positive',
        message: '帳號已成功刪除',
        position: 'top-right',
        timeout: 2000,
        actions: [
          { label: '關閉', color: 'white', handler: () => {} }
        ]
      });
    } catch (error) {
      // Show error notification
      $q.notify({
        type: 'negative',
        message: '刪除帳號失敗',
        position: 'top-right',
        timeout: 3000,
        actions: [
          { label: '關閉', color: 'white', handler: () => {} }
        ]
      });
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
  min-height: 100vh;
  background: #f5f5f5;
}

.page-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
}

.search-section {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.search-input {
  flex: 1;
}

.add-btn {
  flex-shrink: 0;
  font-weight: 500;
  text-transform: none;
  padding: 0 2rem;
}

.stats-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.stat-card :deep(.q-card__section) {
  padding: 1.5rem;
}

.stat-label {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 0.5rem;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: #1a1a1a;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.accounts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
}

@media (max-width: 1024px) {
  .accounts-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  }
}

@media (max-width: 768px) {
  .page-content {
    padding: 1rem;
  }

  .search-section {
    flex-direction: column;
  }

  .stats-container {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .accounts-grid {
    grid-template-columns: 1fr;
  }
}
</style>
