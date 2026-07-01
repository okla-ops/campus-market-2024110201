<script setup lang="ts">
import AppNav from './AppNav.vue'
import { useUserStore } from '@/stores/user'

const user = useUserStore()
</script>

<template>
  <header class="topbar">
    <div class="logo">✦ 校园轻集市</div>
    <AppNav />
    <div class="user-badge">
      <span class="user-avatar">{{ user.initial }}</span>
      <span class="user-name">{{ user.nickname }}</span>
    </div>
  </header>
</template>

<style scoped>
.user-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
}
.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #b4d4f5, #8bb8e8);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: #fff;
  flex-shrink: 0;
}
.user-name {
  font-size: 13px;
  color: #4a6a8a;
}
</style>

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
