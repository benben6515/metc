<template>
  <q-dialog :model-value="modelValue" @update:model-value="handleUpdate">
    <q-card style="min-width: 350px">
      <q-card-section>
        <div class="text-h6">{{ title }}</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        {{ message }}
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          flat
          :label="cancelLabel"
          color="grey"
          @click="handleCancel"
        />
        <q-btn
          flat
          :label="confirmLabel"
          :color="confirmColor"
          @click="handleConfirm"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { QDialog, QCard, QCardSection, QCardActions, QBtn } from 'quasar';

interface Props {
  modelValue: boolean;
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmColor?: string;
}

withDefaults(defineProps<Props>(), {
  title: 'Confirm Action',
  confirmLabel: 'Confirm',
  cancelLabel: 'Cancel',
  confirmColor: 'primary',
});

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  confirm: [];
  cancel: [];
}>();

function handleUpdate(value: boolean): void {
  emit('update:modelValue', value);
}

function handleConfirm(): void {
  emit('confirm');
  emit('update:modelValue', false);
}

function handleCancel(): void {
  emit('cancel');
  emit('update:modelValue', false);
}
</script>

<style scoped>
/* Styles handled by Quasar components */
</style>
