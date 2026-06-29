<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()

const navItems = [
  { path: '/home', label: '首页' },
  { path: '/trade', label: '二手交易' },
  { path: '/lostfound', label: '失物认领' },
  { path: '/groupbuy', label: '拼单互助' },
  { path: '/errand', label: '跑腿代办' },
  { path: '/publish', label: '发布' },
  { path: '/message', label: '消息' },
  { path: '/profile', label: '我的' },
]
</script>

<template>
  <nav class="nav">
    <router-link
      v-for="item in navItems"
      :key="item.path"
      :to="item.path"
      :class="{ active: route.path === item.path }"
    >
      {{ item.label }}
    </router-link>
  </nav>
</template>

<style scoped>
.nav {
  display: flex;
  gap: 2px;
}
.nav a {
  padding: 8px 16px;
  text-decoration: none;
  color: #6a8bb0;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s;
}
.nav a:hover {
  background: rgba(180, 212, 245, 0.3);
  color: #0c1424;
}
.nav a.active {
  background: rgba(180, 212, 245, 0.6);
  color: #0c1424;
  font-weight: 500;
}
</style>
