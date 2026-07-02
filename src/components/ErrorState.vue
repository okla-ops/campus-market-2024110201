<script setup lang="ts">
defineProps<{ message?: string }>()
const emit = defineEmits<{ retry: [] }>()
</script>

<template>
  <div class="error-state">
    <p>{{ message || '数据加载失败' }}</p>
    <button class="retry-btn" @click="emit('retry')">重新加载</button>
  </div>
</template>

<style scoped>
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #c0392b;
  font-size: 14px;
  gap: 12px;
}
.retry-btn {
  padding: 8px 20px;
  border: 1px solid rgba(248,215,227,0.5);
  border-radius: 8px;
  background: transparent;
  font-size: 13px;
  cursor: pointer;
  color: #c0392b;
  transition: background 0.2s;
}
.retry-btn:hover { background: #fdecea; }
</style>
