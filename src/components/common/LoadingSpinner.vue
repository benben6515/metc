<template>
  <div class="loading-spinner-container" :class="{ 'fullscreen': fullscreen }">
    <q-spinner-dots
      :color="color"
      :size="size"
    />
    <p v-if="message" class="loading-message">{{ message }}</p>
  </div>
</template>

<script setup lang="ts">
import { QSpinnerDots } from 'quasar';

interface Props {
  fullscreen?: boolean;
  color?: string;
  size?: string;
  message?: string;
}

withDefaults(defineProps<Props>(), {
  fullscreen: false,
  color: 'primary',
  size: '50px',
  message: '',
});
</script>

<style scoped>
.loading-spinner-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.loading-spinner-container.fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.9);
  z-index: 9999;
}

.loading-message {
  margin-top: 1rem;
  color: #666;
  font-size: 0.9rem;
}
</style>
