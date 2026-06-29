<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getGroupBuys } from '@/api/groupBuy'
import type { GroupBuy } from '@/types'
import EmptyState from '@/components/EmptyState.vue'

const items = ref<GroupBuy[]>([])
const loading = ref(true)
const error = ref('')

onMounted(async () => {
  try {
    const res = await getGroupBuys()
    items.value = res.data
  } catch {
    error.value = '数据加载失败，请确认 Mock 服务已启动'
  } finally {
    loading.value = false
  }
})

function progressPercent(item: GroupBuy): number {
  if (item.targetCount <= 0) return 0
  return Math.min(Math.round((item.currentCount / item.targetCount) * 100), 100)
}
</script>

<template>
  <section class="page">
    <h2>拼单互助</h2>
    <div v-if="loading" class="state-msg">加载中...</div>
    <div v-else-if="error" class="state-msg error">{{ error }}</div>
    <EmptyState v-else-if="!items.length" />
    <div v-else class="card-grid">
      <article v-for="item in items" :key="item.id" class="card">
        <div class="card-head">
          <div class="card-left">
            <span class="type-tag">{{ item.type }}</span>
            <h3>{{ item.title }}</h3>
          </div>
          <span :class="['badge', item.status === 'open' ? 'badge-open' : 'badge-closed']">
            {{ item.status === 'open' ? '进行中' : '已结束' }}
          </span>
        </div>

        <div class="progress-wrap">
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: progressPercent(item) + '%' }"></div>
          </div>
          <span class="progress-text">{{ item.currentCount }} / {{ item.targetCount }} 人</span>
        </div>

        <div class="meta">
          <span>⏰ {{ item.deadline }}</span>
          <span>📍 {{ item.location }}</span>
          <span>👤 {{ item.publisher }}</span>
        </div>
        <p class="desc">{{ item.description }}</p>
      </article>
    </div>
  </section>
</template>

<style scoped>
.page { padding-bottom: 32px; }
h2 { margin: 0 0 20px; color: #0c1424; font-size: 22px; }
.state-msg { text-align: center; color: #6a8bb0; padding: 40px; }
.state-msg.error { color: #c0392b; }

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
}

.card {
  background: rgba(255,255,255,0.85);
  border-radius: 12px;
  padding: 18px;
  border: 1px solid rgba(180,212,245,0.3);
  transition: transform 0.2s;
}
.card:hover { transform: translateY(-2px); }

.card-head {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
}
.card-left { flex: 1; }
.card-left h3 { margin: 4px 0 0; font-size: 15px; color: #0c1424; }

.type-tag {
  display: inline-block;
  font-size: 11px;
  padding: 2px 10px;
  border-radius: 10px;
  background: #f0f7fe;
  color: #4a7a9c;
}

.badge {
  font-size: 11px;
  padding: 2px 10px;
  border-radius: 10px;
  white-space: nowrap;
  height: fit-content;
}
.badge-open { background: #e8f5e9; color: #2e7d32; }
.badge-closed { background: #f5f5f5; color: #999; }

.progress-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}
.progress-bar {
  flex: 1;
  height: 8px;
  background: #f0f7fe;
  border-radius: 4px;
  overflow: hidden;
}
.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #b4d4f5, #8bb8e8);
  border-radius: 4px;
  transition: width 0.6s ease;
}
.progress-text { font-size: 12px; color: #4a6a8a; white-space: nowrap; }

.meta {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 14px;
  font-size: 12px;
  color: #6a8bb0;
  margin-bottom: 8px;
}
.desc { margin: 0; font-size: 13px; color: #6a8bb0; line-height: 1.5; }
</style>
