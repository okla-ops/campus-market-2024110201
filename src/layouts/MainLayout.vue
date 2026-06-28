<script setup lang="ts">
/**
 * MainLayout - 全局公共布局组件
 * 集成顶部导航栏 + 页面内容容器 + 动态渐变背景
 */
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
  <div class="layout-bg">
    <div class="layout">
      <header class="topbar">
        <div class="logo">✦ 校园轻集市</div>
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
      </header>

      <main class="content">
        <!-- 子页面出口 -->
        <RouterView />
      </main>
    </div>
  </div>
</template>

<style scoped>
/* 渐变背景层 — 柔和的低饱和度缓慢动画 */
.layout-bg {
  position: fixed;
  inset: 0;
  display: flex;
  justify-content: center;
  background: linear-gradient(-45deg, #fcfdff, #f0f7fe, #f8f4ff, #f0f7fe);
  background-size: 400% 400%;
  animation: gradientShift 16s ease infinite;
  overflow-y: auto;
}

@keyframes gradientShift {
  0%   { background-position: 0% 50%; }
  25%  { background-position: 100% 0%; }
  50%  { background-position: 100% 100%; }
  75%  { background-position: 0% 100%; }
  100% { background-position: 0% 50%; }
}

/* 页面容器 — 白色半透明卡片质感 */
.layout {
  width: 100%;
  max-width: 1100px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  backdrop-filter: blur(4px);
}

/* 顶部导航 */
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

/* 内容区域 */
.content {
  flex: 1;
  padding: 24px 32px;
}
</style>
