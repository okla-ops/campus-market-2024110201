<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getLostFounds } from '@/api/lostFound'
import type { LostFound } from '@/types'
import ItemCard from '@/components/ItemCard.vue'
import EmptyState from '@/components/EmptyState.vue'

const items = ref<LostFound[]>([])
const loading = ref(true)
const error = ref('')

onMounted(async () => {
  try {
    const res = await getLostFounds()
    items.value = res.data
  } catch {
    error.value = '数据加载失败，请确认 Mock 服务已启动'
  } finally {
    loading.value = false
  }
})

const lostItems = computed(() => items.value.filter((i) => i.type === '丢失'))
const foundItems = computed(() => items.value.filter((i) => i.type === '捡到'))
</script>

<template>
  <section class="page">
    <h2>失物认领板块</h2>
    <div v-if="loading" class="state-msg">加载中...</div>
    <div v-else-if="error" class="state-msg error">{{ error }}</div>
    <template v-else>
      <section class="section">
        <h3 class="section-title">
          <span class="dot dot-lost"></span> 寻物启事 ({{ lostItems.length }})
        </h3>
        <EmptyState v-if="!lostItems.length" message="暂无寻物信息" />
        <div v-else class="card-list">
          <ItemCard
            v-for="item in lostItems"
            :key="item.id"
            :title="item.title"
            :subtitle="item.itemName"
            :status-text="item.status === 'open' ? '寻找中' : '已找到'"
            :status-type="item.status"
            :meta="[`地点：${item.location}`, `时间：${item.lostTime}`, `联系人：${item.contact}`]"
            :description="item.description"
          />
        </div>
      </section>

      <section class="section">
        <h3 class="section-title">
          <span class="dot dot-found"></span> 失物招领 ({{ foundItems.length }})
        </h3>
        <EmptyState v-if="!foundItems.length" message="暂无招领信息" />
        <div v-else class="card-list">
          <ItemCard
            v-for="item in foundItems"
            :key="item.id"
            :title="item.title"
            :subtitle="item.itemName"
            :status-text="item.status === 'open' ? '待认领' : '已认领'"
            :status-type="item.status"
            :meta="[`地点：${item.location}`, `时间：${item.foundTime}`, `联系人：${item.contact}`]"
            :description="item.description"
          />
        </div>
      </section>
    </template>
  </section>
</template>

<style scoped>
.page { padding-bottom: 32px; }
h2 { margin: 0 0 20px; color: #0c1424; font-size: 22px; }
.state-msg { text-align: center; color: #6a8bb0; padding: 40px; }
.state-msg.error { color: #c0392b; }

.section { margin-bottom: 28px; }
.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 12px;
  font-size: 16px;
  color: #0c1424;
}
.dot {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
}
.dot-lost { background: #f8d7e3; }
.dot-found { background: #b4d4f5; }

.card-list { display: flex; flex-direction: column; gap: 12px; }
</style>
