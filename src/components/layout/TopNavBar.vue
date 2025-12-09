<template>
  <div class="top-nav-bar">
    <div class="nav-left">
      <div class="logo">
        <q-icon name="people" size="32px" />
      </div>
      <div class="nav-title">
        <h1 class="title">帳號管理系統</h1>
        <p class="subtitle">管理您的所有帳號</p>
      </div>
    </div>
    <q-btn
      flat
      icon="logout"
      label="登出"
      color="grey-8"
      @click="handleLogout"
    />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { QBtn, QIcon } from 'quasar';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();

function handleLogout(): void {
  authStore.logout();
  router.push({ name: 'Login' });
}
</script>

<style scoped>
.top-nav-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: white;
  border-bottom: 1px solid #e0e0e0;
}

.nav-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.logo {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.nav-title {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a1a1a;
}

.subtitle {
  margin: 0;
  font-size: 0.875rem;
  color: #666;
}

@media (max-width: 768px) {
  .top-nav-bar {
    padding: 1rem;
  }

  .title {
    font-size: 1.1rem;
  }

  .subtitle {
    font-size: 0.8rem;
  }
}
</style>
