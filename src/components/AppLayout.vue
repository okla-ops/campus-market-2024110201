<script setup lang="ts">
import AppHeader from './AppHeader.vue'
</script>

<template>
  <div class="layout-bg">
    <div class="layout">
      <AppHeader />
      <main class="content">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<style scoped>
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

.layout {
  width: 100%;
  max-width: 1100px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  backdrop-filter: blur(4px);
}

.content {
  flex: 1;
  padding: 24px 32px;
}
</style>
