<script setup lang="ts">
defineProps<{ message?: string }>()
</script>

<template>
  <div class="loading-state">
    <div class="spinner"></div>
    <p>{{ message || '数据加载中...' }}</p>
  </div>
</template>

<style scoped>
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #6a8bb0;
  font-size: 14px;
}
.spinner {
  width: 36px;
  height: 36px;
  border: 3px solid rgba(180,212,245,0.3);
  border-top-color: #b4d4f5;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: 12px;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
