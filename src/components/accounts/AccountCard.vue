<template>
  <q-card class="account-card">
    <q-card-section class="card-header">
      <div class="user-info">
        <div class="avatar">
          <q-icon name="person" size="32px" />
        </div>
        <div class="user-details">
          <div class="name">{{ account.name }}</div>
          <q-badge
            :color="account.status === 'ON' ? 'positive' : 'grey-6'"
            :label="account.status === 'ON' ? '啟用' : '停用'"
            class="status-badge"
          />
        </div>
      </div>
    </q-card-section>

    <q-card-section class="card-body">
      <div class="info-row">
        <q-icon name="email" size="18px" color="grey-6" />
        <span class="info-text">{{ account.email }}</span>
      </div>

      <div class="info-row">
        <q-icon name="person" size="18px" color="grey-6" />
        <span class="info-text">{{ getRoleLabel(account.roleLevel) }}</span>
      </div>

      <div class="info-row">
        <q-icon name="calendar_today" size="18px" color="grey-6" />
        <span class="info-text">{{ formatDate(account.createdAt) }}</span>
      </div>
    </q-card-section>

    <q-card-section class="card-actions">
      <q-btn
        flat
        icon="edit"
        label="編輯"
        color="primary"
        class="action-btn edit-btn"
        @click="handleEdit"
      />
      <q-btn
        flat
        icon="delete"
        label="刪除"
        color="negative"
        class="action-btn delete-btn"
        @click="handleDelete"
      />
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { QCard, QCardSection, QIcon, QBadge, QBtn } from 'quasar';
import type { Account, RoleLevel } from '@/types/account';

interface Props {
  account: Account;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  edit: [accountId: string];
  delete: [accountId: string];
}>();

function getRoleLabel(role: RoleLevel): string {
  const labelMap: Record<RoleLevel, string> = {
    ADMIN: '管理員',
    EDITOR: '編輯',
    USER: '用戶',
    CLIENT: '客戶',
  };
  return labelMap[role] || role;
}

function formatDate(dateString?: string): string {
  if (!dateString) {
    return new Date().toISOString().split('T')[0];
  }
  return new Date(dateString).toISOString().split('T')[0];
}

function handleEdit(): void {
  emit('edit', props.account.id);
}

function handleDelete(): void {
  emit('delete', props.account.id);
}
</script>

<style scoped>
.account-card {
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.account-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.card-header {
  padding: 1.5rem 1.5rem 1rem;
}

.user-info {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.avatar {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.user-details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
}

.name {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1a1a1a;
}

.status-badge {
  align-self: flex-start;
  font-size: 0.75rem;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
}

.card-body {
  padding: 0 1.5rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.info-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.info-text {
  font-size: 0.9rem;
  color: #666;
}

.card-actions {
  padding: 0.75rem 1.5rem 1.5rem;
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  flex: 1;
  font-weight: 500;
  text-transform: none;
  border-radius: 8px;
  padding: 0.5rem 1rem;
}

.edit-btn {
  background: rgba(102, 126, 234, 0.1);
}

.delete-btn {
  background: rgba(244, 67, 54, 0.1);
}
</style>
