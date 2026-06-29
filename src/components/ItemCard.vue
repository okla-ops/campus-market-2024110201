<script setup lang="ts">
interface CardProps {
  title: string
  subtitle?: string
  tags?: { label: string; color?: string }[]
  statusText?: string
  statusType?: 'open' | 'closed' | 'done'
  meta?: string[]
  description?: string
  extra?: string
}

defineProps<CardProps>()
</script>

<template>
  <article class="item-card">
    <div class="card-head">
      <div class="card-left">
        <span v-if="subtitle" class="subtitle">{{ subtitle }}</span>
        <h3>{{ title }}</h3>
      </div>
      <div class="card-right" v-if="statusText">
        <span v-if="extra" class="extra">{{ extra }}</span>
        <span :class="['status-badge', `status-${statusType || 'open'}`]">
          {{ statusText }}
        </span>
      </div>
    </div>

    <div v-if="tags?.length" class="tags">
      <span
        v-for="t in tags"
        :key="t.label"
        class="tag"
        :style="t.color ? { background: t.color + '22', color: t.color } : {}"
      >
        {{ t.label }}
      </span>
    </div>

    <div v-if="meta?.length" class="meta">
      <span v-for="(m, i) in meta" :key="i">{{ m }}</span>
    </div>

    <p v-if="description" class="desc">{{ description }}</p>
  </article>
</template>

<style scoped>
.item-card {
  background: rgba(255,255,255,0.85);
  border-radius: 12px;
  padding: 18px;
  border: 1px solid rgba(180,212,245,0.3);
  transition: transform 0.2s, box-shadow 0.2s;
}
.item-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(180,212,245,0.3);
}

.card-head {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 10px;
}
.card-left { flex: 1; min-width: 0; }
.card-left h3 {
  margin: 4px 0 0;
  font-size: 15px;
  color: #0c1424;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.card-right { text-align: right; white-space: nowrap; }

.subtitle {
  display: inline-block;
  font-size: 11px;
  padding: 2px 10px;
  border-radius: 10px;
  background: #f0f7fe;
  color: #4a7a9c;
}

.extra {
  display: block;
  font-size: 17px;
  font-weight: 700;
  color: #e6c88c;
  margin-bottom: 4px;
}

.status-badge {
  display: inline-block;
  font-size: 11px;
  padding: 2px 10px;
  border-radius: 10px;
}
.status-open { background: #e8f5e9; color: #2e7d32; }
.status-closed { background: #f5f5f5; color: #999; }
.status-done { background: #f5f5f5; color: #999; }

.tags { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 10px; }
.tag {
  font-size: 11px;
  padding: 2px 10px;
  border-radius: 10px;
  background: #f0f7fe;
  color: #4a7a9c;
}

.meta {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 16px;
  font-size: 12px;
  color: #6a8bb0;
  margin-bottom: 8px;
}

.desc { margin: 0; font-size: 13px; color: #6a8bb0; line-height: 1.5; }
</style>
