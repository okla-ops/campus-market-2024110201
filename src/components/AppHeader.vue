<script setup lang="ts">
import AppNav from './AppNav.vue'
</script>

<template>
  <header class="topbar">
    <div class="logo">✦ 校园轻集市</div>
    <AppNav />
  </header>
</template>

<style scoped>
.topbar {
  display: flex;
  align-items: center;
  gap: 40px;
  padding: 0 32px;
  height: 60px;
  background: rgba(255, 255, 255, 0.85);
  border-bottom: 1px solid rgba(180, 212, 245, 0.3);
  position: sticky;
  top: 0;
  z-index: 100;
}
.logo {
  font-size: 18px;
  font-weight: 700;
  color: #0c1424;
  white-space: nowrap;
  letter-spacing: 1px;
}
</style>
