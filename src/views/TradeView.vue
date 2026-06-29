<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getTrades } from '@/api/trade'
import type { Trade } from '@/types'
import ItemCard from '@/components/ItemCard.vue'
import EmptyState from '@/components/EmptyState.vue'

const trades = ref<Trade[]>([])
const loading = ref(true)
const error = ref('')

onMounted(async () => {
  try {
    const res = await getTrades()
    trades.value = res.data
  } catch {
    error.value = '数据加载失败，请确认 Mock 服务已启动'
  } finally {
    loading.value = false
  }
})

function formatPrice(p: number): string {
  return `¥${p.toFixed(2)}`
}
</script>

<template>
  <section class="page">
    <h2>二手交易专区</h2>
    <div v-if="loading" class="state-msg">加载中...</div>
    <div v-else-if="error" class="state-msg error">{{ error }}</div>
    <EmptyState v-else-if="!trades.length" />
    <div v-else class="card-grid">
      <ItemCard
        v-for="item in trades"
        :key="item.id"
        :title="item.title"
        :tags="[
          { label: item.category },
          { label: item.condition },
        ]"
        :status-text="item.status === 'open' ? '在售' : '已下架'"
        :status-type="item.status"
        :extra="formatPrice(item.price)"
        :meta="[item.publisher, item.location, item.publishedAt]"
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
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}
</style>
