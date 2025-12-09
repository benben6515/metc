<template>
  <q-banner
    v-if="message"
    :class="`bg-${type} text-white`"
    rounded
  >
    <template #avatar>
      <q-icon :name="iconName" />
    </template>
    <div>{{ message }}</div>
    <template v-if="dismissible" #action>
      <q-btn
        flat
        color="white"
        label="Dismiss"
        @click="handleDismiss"
      />
    </template>
  </q-banner>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { QBanner, QIcon, QBtn } from 'quasar';

interface Props {
  message: string;
  type?: 'negative' | 'warning' | 'info';
  dismissible?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  type: 'negative',
  dismissible: true,
});

const emit = defineEmits<{
  dismiss: [];
}>();

const iconName = computed(() => {
  switch (props.type) {
    case 'negative':
      return 'error';
    case 'warning':
      return 'warning';
    case 'info':
      return 'info';
    default:
      return 'error';
  }
});

function handleDismiss(): void {
  emit('dismiss');
}
</script>

<style scoped>
/* Styles handled by Quasar classes */
</style>
