<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getTrades } from '@/api/trade'
import type { Trade } from '@/types'
import ItemCard from '@/components/ItemCard.vue'
import EmptyState from '@/components/EmptyState.vue'
import LoadingState from '@/components/LoadingState.vue'
import ErrorState from '@/components/ErrorState.vue'
import SearchBar from '@/components/SearchBar.vue'
import { useFavoriteStore } from '@/stores/favorite'

const fav = useFavoriteStore()
const trades = ref<Trade[]>([])
const loading = ref(true)
const error = ref('')
const keyword = ref('')

const filteredTrades = computed(() => {
  if (!keyword.value.trim()) return trades.value
  const q = keyword.value.trim().toLowerCase()
  return trades.value.filter(
    (item) =>
      item.title.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.location.toLowerCase().includes(q)
  )
})

async function fetchData() {
  loading.value = true
  error.value = ''
  try {
    const res = await getTrades()
    trades.value = res.data
  } catch {
    error.value = '数据加载失败，请确认 Mock 服务已启动'
  } finally {
    loading.value = false
  }
}

onMounted(fetchData)

function formatPrice(p: number): string {
  return `¥${p.toFixed(2)}`
}
</script>

<template>
  <section class="page">
    <h2>二手交易专区</h2>

    <SearchBar v-model="keyword" placeholder="搜索标题、描述、分类、地点..." />

    <LoadingState v-if="loading" />
    <ErrorState v-else-if="error" @retry="fetchData" />
    <EmptyState v-else-if="!filteredTrades.length" message="没有找到匹配的商品" />
    <div v-else class="card-grid">
      <ItemCard
        v-for="item in filteredTrades"
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
      >
        <template #footer>
          <button
            :class="['fav-btn', { active: fav.isFav('trade', item.id) }]"
            @click="fav.toggle('trade', item.id, item.title)"
          >
            {{ fav.isFav('trade', item.id) ? '❤️ 已收藏' : '🤍 收藏' }}
          </button>
        </template>
      </ItemCard>
    </div>
  </section>
</template>

<style scoped>
.page { padding-bottom: 32px; }
h2 { margin: 0 0 20px; color: #0c1424; font-size: 22px; }
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}
.fav-btn {
  padding: 4px 12px;
  border: 1px solid rgba(180,212,245,0.4);
  border-radius: 6px;
  background: transparent;
  font-size: 12px;
  cursor: pointer;
  color: #6a8bb0;
  transition: all 0.2s;
}
.fav-btn:hover { background: rgba(248,215,227,0.3); transform: scale(1.05); }
.fav-btn.active {
  background: #f8d7e3;
  border-color: #f8d7e3;
  color: #c0392b;
}
</style>
