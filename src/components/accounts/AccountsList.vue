<template>
  <div class="accounts-list">
    <loading-spinner v-if="loading" message="Loading accounts..." />

    <div v-else>
      <!-- Search and Filter Section -->
      <div class="filter-section">
        <q-input
          v-model="searchQuery"
          outlined
          dense
          placeholder="搜尋姓名或電子郵件..."
          class="search-input"
        >
          <template #prepend>
            <q-icon name="search" />
          </template>
          <template #append>
            <q-icon
              v-if="searchQuery"
              name="clear"
              class="cursor-pointer"
              @click="searchQuery = ''"
            />
          </template>
        </q-input>

        <q-select
          v-model="roleFilter"
          :options="roleFilterOptions"
          outlined
          dense
          emit-value
          map-options
          clearable
          placeholder="篩選角色"
          class="role-filter"
        >
          <template #prepend>
            <q-icon name="filter_list" />
          </template>
        </q-select>

        <q-select
          v-model="statusFilter"
          :options="statusFilterOptions"
          outlined
          dense
          emit-value
          map-options
          clearable
          placeholder="篩選狀態"
          class="status-filter"
        >
          <template #prepend>
            <q-icon name="toggle_on" />
          </template>
        </q-select>
      </div>

      <div v-if="filteredAccounts.length === 0" class="empty-state">
        <q-icon name="search_off" size="64px" color="grey" />
        <p class="text-h6 text-grey">找不到符合條件的帳號</p>
        <q-btn
          v-if="searchQuery || roleFilter || statusFilter"
          flat
          color="primary"
          label="清除篩選"
          @click="clearFilters"
        />
      </div>

      <q-table
        v-else
        :rows="filteredAccounts"
        :columns="columns"
        row-key="id"
        flat
        bordered
        class="accounts-table"
      >
      <template #body-cell-status="props">
        <q-td :props="props">
          <q-badge
            :color="props.row.status === 'ON' ? 'positive' : 'negative'"
            :label="props.row.status === 'ON' ? '啟用' : '停用'"
          />
        </q-td>
      </template>

      <template #body-cell-roleLevel="props">
        <q-td :props="props">
          <q-chip
            :color="getRoleColor(props.row.roleLevel)"
            :label="getRoleLabel(props.row.roleLevel)"
            text-color="white"
            dense
            size="sm"
          />
        </q-td>
      </template>

      <template #body-cell-actions="props">
        <q-td :props="props">
          <div class="action-buttons">
            <q-btn
              flat
              dense
              round
              icon="edit"
              color="primary"
              size="sm"
              @click="handleEdit(props.row.id)"
            >
              <q-tooltip>編輯</q-tooltip>
            </q-btn>
            <q-btn
              flat
              dense
              round
              icon="delete"
              color="negative"
              size="sm"
              @click="handleDelete(props.row.id)"
            >
              <q-tooltip>刪除</q-tooltip>
            </q-btn>
          </div>
        </q-td>
      </template>
    </q-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { QTable, QTd, QBadge, QChip, QBtn, QTooltip, QIcon, QInput, QSelect } from 'quasar';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
import type { Account, RoleLevel, AccountStatus } from '@/types/account';

interface Props {
  accounts: Account[];
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
});

const emit = defineEmits<{
  edit: [accountId: string];
  delete: [accountId: string];
}>();

// Search and filter state
const searchQuery = ref('');
const roleFilter = ref<RoleLevel | null>(null);
const statusFilter = ref<AccountStatus | null>(null);

const roleFilterOptions = [
  { label: '管理員', value: 'ADMIN' },
  { label: '編輯', value: 'EDITOR' },
  { label: '用戶', value: 'USER' },
  { label: '客戶', value: 'CLIENT' },
];

const statusFilterOptions = [
  { label: '啟用', value: 'ON' },
  { label: '停用', value: 'OFF' },
];

const columns = [
  { name: 'name', label: '姓名', field: 'name', align: 'left' as const, sortable: true },
  { name: 'email', label: '電子郵件', field: 'email', align: 'left' as const, sortable: true },
  { name: 'roleLevel', label: '角色', field: 'roleLevel', align: 'center' as const, sortable: true },
  { name: 'status', label: '狀態', field: 'status', align: 'center' as const, sortable: true },
  { name: 'actions', label: '操作', field: 'actions', align: 'center' as const },
];

// Computed filtered accounts
const filteredAccounts = computed(() => {
  let filtered = [...props.accounts];

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(account =>
      account.name.toLowerCase().includes(query) ||
      account.email.toLowerCase().includes(query)
    );
  }

  // Apply role filter
  if (roleFilter.value) {
    filtered = filtered.filter(account => account.roleLevel === roleFilter.value);
  }

  // Apply status filter
  if (statusFilter.value) {
    filtered = filtered.filter(account => account.status === statusFilter.value);
  }

  return filtered;
});

function getRoleColor(role: RoleLevel): string {
  const colorMap: Record<RoleLevel, string> = {
    ADMIN: 'deep-purple',
    EDITOR: 'blue',
    USER: 'teal',
    CLIENT: 'orange',
  };
  return colorMap[role] || 'grey';
}

function getRoleLabel(role: RoleLevel): string {
  const labelMap: Record<RoleLevel, string> = {
    ADMIN: '管理員',
    EDITOR: '編輯',
    USER: '用戶',
    CLIENT: '客戶',
  };
  return labelMap[role] || role;
}

function clearFilters(): void {
  searchQuery.value = '';
  roleFilter.value = null;
  statusFilter.value = null;
}

function handleEdit(accountId: string): void {
  emit('edit', accountId);
}

function handleDelete(accountId: string): void {
  emit('delete', accountId);
}
</script>

<style scoped>
.accounts-list {
  width: 100%;
}

.filter-section {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.search-input {
  flex: 2;
  min-width: 250px;
}

.role-filter,
.status-filter {
  flex: 1;
  min-width: 150px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
  gap: 1rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.accounts-table {
  margin-top: 0;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
}

.accounts-table :deep(.q-table__top),
.accounts-table :deep(.q-table__bottom) {
  background-color: #fafafa;
}

.accounts-table :deep(thead tr) {
  background-color: #f5f5f5;
}

.accounts-table :deep(thead th) {
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.5px;
}

.accounts-table :deep(tbody tr:hover) {
  background-color: #f5f5f5;
}

.action-buttons {
  display: flex;
  gap: 0.25rem;
  justify-content: center;
}

@media (max-width: 768px) {
  .filter-section {
    flex-direction: column;
  }

  .search-input,
  .role-filter,
  .status-filter {
    width: 100%;
    min-width: 100%;
  }

  .accounts-table {
    font-size: 0.875rem;
  }

  .accounts-table :deep(th),
  .accounts-table :deep(td) {
    padding: 0.5rem;
  }
}
</style>
