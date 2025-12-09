/**
 * Vue Router configuration with authentication guards
 */

import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { logger } from '@/utils/logger';

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/pages/LoginPage.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/pages/RegisterPage.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/',
    name: 'Home',
    redirect: '/login',
  },
  {
    path: '/accounts',
    name: 'Accounts',
    component: () => import('@/pages/AccountsPage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/accounts/create',
    name: 'CreateAccount',
    component: () => import('@/pages/CreateAccountPage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/accounts/:id/edit',
    name: 'EditAccount',
    component: () => import('@/pages/EditAccountPage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    redirect: '/login',
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// Navigation guard for authentication
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const requiresAuth = to.meta.requiresAuth !== false;

  logger.debug('Navigation guard', {
    to: to.path,
    from: from.path,
    requiresAuth,
    isAuthenticated: authStore.isAuthenticated,
  });

  if (requiresAuth && !authStore.isAuthenticated) {
    logger.warn('Unauthorized access attempt', { path: to.path });
    next({ name: 'Login', query: { redirect: to.fullPath } });
  } else if ((to.name === 'Login' || to.name === 'Register') && authStore.isAuthenticated) {
    // Redirect to accounts if already authenticated
    next({ name: 'Accounts' });
  } else {
    next();
  }
});

export default router;
