<template>
  <div class="accounts-page">
    <div class="page-header">
      <div class="header-content">
        <h1 class="text-h4">帳號管理系統</h1>
        <div class="subtitle">管理您的所有帳號</div>
      </div>
      <q-btn
        color="primary"
        icon="add"
        label="新增帳號"
        size="md"
        unelevated
        @click="showRegisterDialog = true"
      />
    </div>

    <!-- Statistics Cards -->
    <div class="stats-container">
      <q-card class="stat-card">
        <q-card-section>
          <div class="stat-icon">
            <q-icon name="people" size="32px" color="primary" />
          </div>
          <div class="stat-value">{{ accountsStore.accountCount }}</div>
          <div class="stat-label">總帳號數</div>
        </q-card-section>
      </q-card>

      <q-card class="stat-card">
        <q-card-section>
          <div class="stat-icon">
            <q-icon name="check_circle" size="32px" color="positive" />
          </div>
          <div class="stat-value">{{ accountsStore.activeAccounts.length }}</div>
          <div class="stat-label">啟用帳號</div>
        </q-card-section>
      </q-card>

      <q-card class="stat-card">
        <q-card-section>
          <div class="stat-icon">
            <q-icon name="admin_panel_settings" size="32px" color="deep-purple" />
          </div>
          <div class="stat-value">{{ adminCount }}</div>
          <div class="stat-label">管理員</div>
        </q-card-section>
      </q-card>

      <q-card class="stat-card">
        <q-card-section>
          <div class="stat-icon">
            <q-icon name="cancel" size="32px" color="negative" />
          </div>
          <div class="stat-value">{{ inactiveCount }}</div>
          <div class="stat-label">停用帳號</div>
        </q-card-section>
      </q-card>
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
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { QBtn, QCard, QCardSection, QIcon, useQuasar } from 'quasar';
import AccountsList from '@/components/accounts/AccountsList.vue';
import RegisterDialog from '@/components/accounts/RegisterDialog.vue';
import ErrorMessage from '@/components/common/ErrorMessage.vue';
import ConfirmDialog from '@/components/common/ConfirmDialog.vue';
import { useAccountsStore } from '@/stores/accounts';

const router = useRouter();
const accountsStore = useAccountsStore();
const $q = useQuasar();

const showRegisterDialog = ref(false);
const showDeleteDialog = ref(false);
const accountToDelete = ref<string | null>(null);

// Computed statistics
const adminCount = computed(() => accountsStore.accounts.filter(acc => acc.roleLevel === 'ADMIN').length);
const inactiveCount = computed(() => accountsStore.accounts.filter(acc => acc.status === 'OFF').length);

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
  background: linear-gradient(to bottom, #f8f9fa 0%, #e9ecef 100%);
  padding: 2rem;
}

.page-header {
  max-width: 1200px;
  margin: 0 auto 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.header-content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.page-header .text-h4 {
  margin: 0;
  color: #1a1a1a;
  font-weight: 700;
}

.page-header .subtitle {
  color: #666;
  font-size: 0.9rem;
}

.stats-container {
  max-width: 1200px;
  margin: 0 auto 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
}

.stat-card {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.stat-card :deep(.q-card__section) {
  padding: 1.5rem;
  text-align: center;
}

.stat-icon {
  margin-bottom: 1rem;
}

.stat-value {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 0.9rem;
  color: #666;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.accounts-page :deep(.accounts-list) {
  max-width: 1200px;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .accounts-page {
    padding: 1rem;
  }

  .page-header {
    flex-direction: column;
    gap: 1.5rem;
    align-items: flex-start;
    padding: 1.5rem;
  }

  .stats-container {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1rem;
  }

  .stat-value {
    font-size: 2rem;
  }
}
</style>
