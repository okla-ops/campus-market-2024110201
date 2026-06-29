<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getProfile } from '@/api/profile'
import type { Profile } from '@/types'

const profile = ref<Profile | null>(null)
const loading = ref(true)
const error = ref('')

onMounted(async () => {
  try {
    const res = await getProfile()
    profile.value = res.data
  } catch {
    error.value = '数据加载失败，请确认 Mock 服务已启动'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <section class="page">
    <h2>个人主页</h2>
    <div v-if="loading" class="state-msg">加载中...</div>
    <div v-else-if="error" class="state-msg error">{{ error }}</div>
    <template v-else-if="profile">
      <div class="profile-card">
        <div class="avatar">{{ profile.nickname.charAt(0) }}</div>
        <h3>{{ profile.nickname }}</h3>
        <div class="profile-info">
          <div class="info-row"><span class="info-label">学号</span><span>{{ profile.studentId }}</span></div>
          <div class="info-row"><span class="info-label">学院</span><span>{{ profile.college }}</span></div>
          <div class="info-row"><span class="info-label">手机</span><span>{{ profile.phone }}</span></div>
        </div>
      </div>

      <div class="menu-list">
        <router-link to="/publish" class="menu-item">
          <span class="menu-icon">📝</span>
          <span class="menu-label">我的发布</span>
          <span class="menu-count">{{ profile.publishedCount }}</span>
          <span class="menu-arrow">›</span>
        </router-link>
        <div class="menu-item">
          <span class="menu-icon">⭐</span>
          <span class="menu-label">我的收藏</span>
          <span class="menu-arrow">›</span>
        </div>
        <div class="menu-item">
          <span class="menu-icon">⚙️</span>
          <span class="menu-label">账号设置</span>
          <span class="menu-arrow">›</span>
        </div>
        <div class="menu-item">
          <span class="menu-icon">📖</span>
          <span class="menu-label">使用帮助</span>
          <span class="menu-arrow">›</span>
        </div>
      </div>
    </template>
  </section>
</template>

<style scoped>
.page { padding-bottom: 32px; }
h2 { margin: 0 0 20px; color: #0c1424; font-size: 22px; }
.state-msg { text-align: center; color: #6a8bb0; padding: 40px; }
.state-msg.error { color: #c0392b; }

.profile-card {
  text-align: center;
  padding: 32px 20px;
  background: rgba(255,255,255,0.85);
  border-radius: 12px;
  border: 1px solid rgba(180,212,245,0.3);
  margin-bottom: 20px;
}
.avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: linear-gradient(135deg, #b4d4f5, #8bb8e8);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: #fff;
  margin: 0 auto 12px;
}
.profile-card h3 { margin: 0 0 16px; font-size: 18px; color: #0c1424; }
.profile-info { text-align: left; max-width: 280px; margin: 0 auto; }
.info-row {
  display: flex;
  justify-content: space-between;
  padding: 6px 0;
  font-size: 13px;
  color: #4a6a8a;
  border-bottom: 1px solid rgba(180,212,245,0.15);
}
.info-row:last-child { border-bottom: none; }
.info-label { color: #6a8bb0; }

.menu-list { display: flex; flex-direction: column; gap: 8px; }
.menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  background: rgba(255,255,255,0.85);
  border-radius: 10px;
  border: 1px solid rgba(180,212,245,0.2);
  text-decoration: none;
  cursor: pointer;
  transition: background 0.2s;
}
.menu-item:hover { background: rgba(255,255,255,0.95); }
.menu-icon { font-size: 18px; }
.menu-label { flex: 1; font-size: 14px; color: #0c1424; }
.menu-count {
  font-size: 12px;
  color: #fff;
  background: #b4d4f5;
  padding: 1px 8px;
  border-radius: 8px;
}
.menu-arrow { font-size: 18px; color: #a0b8d0; }
</style>
