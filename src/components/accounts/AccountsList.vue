<template>
  <div class="accounts-list">
    <loading-spinner v-if="loading" message="Loading accounts..." />

    <div v-else-if="accounts.length === 0" class="empty-state">
      <q-icon name="inbox" size="64px" color="grey" />
      <p class="text-h6 text-grey">No accounts found</p>
    </div>

    <q-table
      v-else
      :rows="accounts"
      :columns="columns"
      row-key="id"
      flat
      bordered
      class="accounts-table"
    >
      <template #body-cell-status="props">
        <q-td :props="props">
          <q-badge :color="props.row.status === 'ON' ? 'positive' : 'negative'">
            {{ props.row.status }}
          </q-badge>
        </q-td>
      </template>

      <template #body-cell-roleLevel="props">
        <q-td :props="props">
          <q-chip
            :color="getRoleColor(props.row.roleLevel)"
            text-color="white"
            dense
          >
            {{ props.row.roleLevel }}
          </q-chip>
        </q-td>
      </template>

      <template #body-cell-actions="props">
        <q-td :props="props">
          <q-btn
            flat
            dense
            round
            icon="edit"
            color="primary"
            size="sm"
            @click="handleEdit(props.row.id)"
          >
            <q-tooltip>Edit</q-tooltip>
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
            <q-tooltip>Delete</q-tooltip>
          </q-btn>
        </q-td>
      </template>
    </q-table>
  </div>
</template>

<script setup lang="ts">
import { QTable, QTd, QBadge, QChip, QBtn, QTooltip, QIcon } from 'quasar';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
import type { Account, RoleLevel } from '@/types/account';

interface Props {
  accounts: Account[];
  loading?: boolean;
}

withDefaults(defineProps<Props>(), {
  loading: false,
});

const emit = defineEmits<{
  edit: [accountId: string];
  delete: [accountId: string];
}>();

const columns = [
  { name: 'name', label: 'Name', field: 'name', align: 'left' as const, sortable: true },
  { name: 'email', label: 'Email', field: 'email', align: 'left' as const, sortable: true },
  { name: 'roleLevel', label: 'Role', field: 'roleLevel', align: 'center' as const, sortable: true },
  { name: 'status', label: 'Status', field: 'status', align: 'center' as const, sortable: true },
  { name: 'actions', label: 'Actions', field: 'actions', align: 'center' as const },
];

function getRoleColor(role: RoleLevel): string {
  const colorMap: Record<RoleLevel, string> = {
    ADMIN: 'deep-purple',
    EDITOR: 'blue',
    USER: 'teal',
    CLIENT: 'orange',
  };
  return colorMap[role] || 'grey';
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

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
}

.accounts-table {
  margin-top: 1rem;
}
</style>
