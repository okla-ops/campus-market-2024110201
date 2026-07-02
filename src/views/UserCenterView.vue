<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useFavoriteStore } from '@/stores/favorite'
import { getTrades } from '@/api/trade'
import { getLostFounds } from '@/api/lostFound'
import { getGroupBuys } from '@/api/groupBuy'
import { getErrands } from '@/api/errand'
import EmptyState from '@/components/EmptyState.vue'

const router = useRouter()
const user = useUserStore()
const fav = useFavoriteStore()

const loading = ref(true)
const myPublishCount = ref(0)

onMounted(async () => {
  if (!user.isLoggedIn) {
    loading.value = false
    return
  }
  try {
    const [trades, lost, buys, errs] = await Promise.all([
      getTrades(),
      getLostFounds(),
      getGroupBuys(),
      getErrands(),
    ])
    const me = user.nickname
    myPublishCount.value =
      trades.data.filter((i) => i.publisher === me).length +
      lost.data.filter((i) => i.publisher === me).length +
      buys.data.filter((i) => i.publisher === me).length +
      errs.data.filter((i) => i.publisher === me).length
  } catch {
    // 静默处理
  } finally {
    loading.value = false
  }
})

function handleLogout() {
  user.logout()
  router.push('/home')
}
</script>

<template>
  <section class="page">
    <h2>个人主页</h2>

    <div v-if="!user.isLoggedIn" class="unlogged">
      <p>您尚未登录，请先登录后查看个人主页</p>
      <router-link to="/login" class="btn btn-primary">前往登录</router-link>
    </div>

    <template v-else>
      <div class="profile-card">
        <div class="avatar">{{ user.initial }}</div>
        <h3>{{ user.nickname }}</h3>
        <div class="profile-info">
          <div class="info-row"><span class="info-label">学号</span><span>{{ user.studentId }}</span></div>
          <div class="info-row"><span class="info-label">学院</span><span>{{ user.college }}</span></div>
          <div class="info-row"><span class="info-label">手机</span><span>{{ user.phone }}</span></div>
        </div>
        <button class="btn-logout" @click="handleLogout">退出登录</button>
      </div>

      <div class="menu-list">
        <router-link to="/publish" class="menu-item">
          <span class="menu-icon">📝</span>
          <span class="menu-label">我的发布</span>
          <span class="menu-count">{{ loading ? '...' : myPublishCount }}</span>
          <span class="menu-arrow">›</span>
        </router-link>
        <router-link to="/trade" class="menu-item">
          <span class="menu-icon">⭐</span>
          <span class="menu-label">我的收藏</span>
          <span class="menu-count" v-if="fav.count">{{ fav.count }}</span>
          <span class="menu-arrow">›</span>
        </router-link>
        <div class="menu-item" @click="handleLogout" style="cursor:pointer">
          <span class="menu-icon">🚪</span>
          <span class="menu-label">退出登录</span>
          <span class="menu-arrow">›</span>
        </div>
      </div>

      <div class="fav-section" v-if="fav.count">
        <h3>我的收藏 ({{ fav.count }})</h3>
        <div class="fav-list">
          <div v-for="item in fav.items" :key="`${item.type}-${item.id}`" class="fav-item">
            <span class="fav-type">{{ item.type }}</span>
            <span class="fav-title">{{ item.title }}</span>
            <button class="fav-remove" @click="fav.toggle(item.type, item.id, item.title)">取消</button>
          </div>
        </div>
      </div>
      <EmptyState v-else message="暂无收藏" />
    </template>
  </section>
</template>

<style scoped>
.page { padding-bottom: 32px; max-width: 600px; }
h2 { margin: 0 0 20px; color: #0c1424; font-size: 22px; }
h3 { margin: 0 0 12px; font-size: 15px; color: #0c1424; }

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

.menu-list { display: flex; flex-direction: column; gap: 8px; margin-bottom: 24px; }
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
  color: inherit;
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

.fav-section {
  background: rgba(255,255,255,0.85);
  border-radius: 12px;
  padding: 18px;
  border: 1px solid rgba(180,212,245,0.3);
}
.fav-list { display: flex; flex-direction: column; gap: 8px; }
.fav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  background: rgba(240,247,254,0.4);
  border-radius: 8px;
  font-size: 13px;
}
.fav-type {
  font-size: 11px;
  padding: 1px 6px;
  border-radius: 4px;
  background: #b4d4f5;
  color: #fff;
  white-space: nowrap;
}
.fav-title { flex: 1; color: #0c1424; }
.fav-remove {
  padding: 2px 10px;
  border: 1px solid rgba(248,215,227,0.5);
  border-radius: 6px;
  background: transparent;
  font-size: 12px;
  cursor: pointer;
  color: #c0392b;
}
.fav-remove:hover { background: #fdecea; }
.unlogged { text-align: center; padding: 60px 20px; color: #6a8bb0; }
.unlogged p { margin-bottom: 16px; font-size: 14px; }
.btn {
  display: inline-block;
  padding: 10px 24px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  text-decoration: none;
}
.btn-primary {
  background: linear-gradient(135deg, #b4d4f5, #8bb8e8);
  color: #fff;
}
.btn-primary:hover { opacity: 0.9; }
.btn-logout {
  margin-top: 12px;
  padding: 6px 16px;
  border: 1px solid rgba(248,215,227,0.5);
  border-radius: 6px;
  background: transparent;
  font-size: 12px;
  cursor: pointer;
  color: #c0392b;
}
.btn-logout:hover { background: #fdecea; }
</style>
