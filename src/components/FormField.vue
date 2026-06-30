<script setup lang="ts">
defineProps<{
  label: string
  required?: boolean
  error?: string
}>()
</script>

<template>
  <label class="form-field">
    <span class="field-label">
      {{ label }}
      <span v-if="required" class="required">*</span>
    </span>
    <slot />
    <span v-if="error" class="field-error">{{ error }}</span>
  </label>
</template>

<style scoped>
.form-field {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.field-label {
  font-size: 13px;
  color: #4a6a8a;
}
.required {
  color: #e74c3c;
  margin-left: 2px;
}
.field-error {
  font-size: 12px;
  color: #e74c3c;
}
</style>
