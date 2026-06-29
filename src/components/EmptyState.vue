<script setup lang="ts">
defineProps<{
  message?: string
}>()
</script>

<template>
  <div class="empty">
    <span class="empty-icon">📭</span>
    <p class="empty-text">{{ message || '暂无数据' }}</p>
  </div>
</template>

<style scoped>
.empty {
  padding: 60px 32px;
  text-align: center;
}
.empty-icon { font-size: 48px; opacity: 0.4; }
.empty-text {
  margin: 12px 0 0;
  font-size: 15px;
  color: #a0b8d0;
}
</style>
