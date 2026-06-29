<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getTrades } from '@/api/trade'
import { getLostFounds } from '@/api/lostFound'
import { getGroupBuys } from '@/api/groupBuy'
import { getErrands } from '@/api/errand'

const stats = ref({
  trades: 0,
  lostFounds: 0,
  groupBuys: 0,
  errands: 0,
})
const loading = ref(true)

onMounted(async () => {
  try {
    const [trades, lostFounds, groupBuys, errands] = await Promise.all([
      getTrades(),
      getLostFounds(),
      getGroupBuys(),
      getErrands(),
    ])
    stats.value = {
      trades: trades.data.length,
      lostFounds: lostFounds.data.length,
      groupBuys: groupBuys.data.length,
      errands: errands.data.length,
    }
  } catch {
    // 静默处理
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <section class="page">
    <div class="welcome">
      <h2>欢迎来到校园轻集市</h2>
      <p class="welcome-desc">校园专属交易、互助、信息发布平台</p>
    </div>

    <div class="stats" v-if="!loading">
      <router-link to="/trade" class="stat-card">
        <span class="stat-icon">📦</span>
        <span class="stat-label">二手交易</span>
        <span class="stat-num">{{ stats.trades }}</span>
      </router-link>
      <router-link to="/lostfound" class="stat-card">
        <span class="stat-icon">🔍</span>
        <span class="stat-label">失物招领</span>
        <span class="stat-num">{{ stats.lostFounds }}</span>
      </router-link>
      <router-link to="/groupbuy" class="stat-card">
        <span class="stat-icon">🤝</span>
        <span class="stat-label">拼单互助</span>
        <span class="stat-num">{{ stats.groupBuys }}</span>
      </router-link>
      <router-link to="/errand" class="stat-card">
        <span class="stat-icon">🏃</span>
        <span class="stat-label">跑腿代办</span>
        <span class="stat-num">{{ stats.errands }}</span>
      </router-link>
    </div>

    <div class="notice">
      <h3>📢 平台公告</h3>
      <p>欢迎使用校园轻集市！请文明交易，注意甄别信息真伪。如有问题请联系管理员。</p>
    </div>

    <div class="tips">
      <h3>💡 使用提示</h3>
      <ul>
        <li>发布二手商品请填写详细的描述和价格</li>
        <li>失物招领请注明丢失/捡到的时间和地点</li>
        <li>拼单请注意截止时间，及时跟进进度</li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.page { padding-bottom: 32px; }

.welcome { margin-bottom: 28px; }
.welcome h2 { margin: 0 0 6px; color: #0c1424; font-size: 24px; }
.welcome-desc { margin: 0; color: #6a8bb0; font-size: 14px; }

.stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 28px; }
.stat-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 20px 12px;
  background: rgba(255,255,255,0.85);
  border-radius: 12px;
  text-decoration: none;
  border: 1px solid rgba(180,212,245,0.3);
  transition: transform 0.2s;
}
.stat-card:hover { transform: translateY(-3px); }
.stat-icon { font-size: 32px; }
.stat-label { font-size: 13px; color: #4a6a8a; }
.stat-num { font-size: 22px; font-weight: 700; color: #0c1424; }

.notice, .tips {
  background: rgba(255,255,255,0.7);
  border-radius: 12px;
  padding: 18px 20px;
  margin-bottom: 16px;
  border: 1px solid rgba(180,212,245,0.2);
}
.notice h3, .tips h3 { margin: 0 0 8px; font-size: 15px; color: #0c1424; }
.notice p { margin: 0; font-size: 13px; color: #6a8bb0; line-height: 1.6; }
.tips ul { margin: 0; padding-left: 18px; }
.tips li { font-size: 13px; color: #6a8bb0; line-height: 1.8; }
</style>
