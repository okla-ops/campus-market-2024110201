<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{ modelValue: string; placeholder?: string }>()
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const input = ref(props.modelValue)

watch(input, (val) => {
  emit('update:modelValue', val)
})

watch(() => props.modelValue, (val) => {
  input.value = val
})
</script>

<template>
  <div class="search-bar">
    <input
      v-model="input"
      :placeholder="placeholder || '搜索...'"
      class="search-input"
    />
  </div>
</template>

<style scoped>
.search-bar { margin-bottom: 16px; }
.search-input {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid rgba(180,212,245,0.4);
  border-radius: 8px;
  font-size: 14px;
  background: rgba(255,255,255,0.8);
  outline: none;
  box-sizing: border-box;
  transition: border 0.2s;
}
.search-input:focus { border-color: #b4d4f5; }
</style>
