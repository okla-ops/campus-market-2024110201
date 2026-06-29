<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getErrands } from '@/api/errand'
import type { Errand } from '@/types'
import ItemCard from '@/components/ItemCard.vue'
import EmptyState from '@/components/EmptyState.vue'

const items = ref<Errand[]>([])
const loading = ref(true)
const error = ref('')

onMounted(async () => {
  try {
    const res = await getErrands()
    items.value = res.data
  } catch {
    error.value = '数据加载失败，请确认 Mock 服务已启动'
  } finally {
    loading.value = false
  }
})

function formatReward(r: number): string {
  return `¥${r.toFixed(2)}`
}
</script>

<template>
  <section class="page">
    <h2>跑腿代办</h2>
    <div v-if="loading" class="state-msg">加载中...</div>
    <div v-else-if="error" class="state-msg error">{{ error }}</div>
    <EmptyState v-else-if="!items.length" />
    <div v-else class="card-list">
      <ItemCard
        v-for="item in items"
        :key="item.id"
        :title="item.title"
        :subtitle="item.taskType"
        :extra="formatReward(item.reward)"
        :status-text="item.status === 'open' ? '待接单' : '已完成'"
        :status-type="item.status"
        :meta="[
          `取件：${item.pickup}`,
          `送达：${item.delivery}`,
          `截止：${item.deadline}`,
          `发布人：${item.publisher}`,
        ]"
        :description="item.description"
      />
    </div>
  </section>
</template>

<style scoped>
.page { padding-bottom: 32px; }
h2 { margin: 0 0 20px; color: #0c1424; font-size: 22px; }
.state-msg { text-align: center; color: #6a8bb0; padding: 40px; }
.state-msg.error { color: #c0392b; }
.card-list { display: flex; flex-direction: column; gap: 12px; }
</style>
