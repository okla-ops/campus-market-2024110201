<script setup lang="ts"></script>

<template>
  <div class="app-container">
    <header>
      <h1>校园轻集市</h1>
      <p>AI 辅助前端工程实践种子项目</p>
    </header>

    <nav>
      <router-link to="/home">首页</router-link>
      <router-link to="/list">列表</router-link>
      <router-link to="/publish">发布</router-link>
      <router-link to="/message">消息</router-link>
      <router-link to="/profile">我的</router-link>
    </nav>

    <main>
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.app-container {
  max-width: 960px;
  margin: 0 auto;
  padding: 16px;
}

header {
  text-align: center;
  margin-bottom: 16px;
}

nav {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-bottom: 24px;
}

nav a {
  padding: 8px 16px;
  text-decoration: none;
  color: #333;
  border-radius: 6px;
  background: #f0f0f0;
}

nav a:hover {
  background: #e0e0e0;
}

main {
  padding: 16px 0;
}
</style>