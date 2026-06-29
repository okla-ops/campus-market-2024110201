<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getMessages } from '@/api/message'
import type { Message } from '@/types'
import EmptyState from '@/components/EmptyState.vue'

const messages = ref<Message[]>([])
const loading = ref(true)
const error = ref('')

onMounted(async () => {
  try {
    const res = await getMessages()
    messages.value = res.data
  } catch {
    error.value = '数据加载失败，请确认 Mock 服务已启动'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <section class="page">
    <h2>消息聊天</h2>
    <div v-if="loading" class="state-msg">加载中...</div>
    <div v-else-if="error" class="state-msg error">{{ error }}</div>
    <EmptyState v-else-if="!messages.length" message="暂无消息" />
    <div v-else class="msg-list">
      <article v-for="msg in messages" :key="msg.id" class="msg-item">
        <div class="msg-avatar">
          {{ msg.nickname.charAt(0) }}
        </div>
        <div class="msg-body">
          <div class="msg-top">
            <span class="msg-name">{{ msg.nickname }}</span>
            <span class="msg-time">{{ msg.time }}</span>
          </div>
          <div class="msg-bottom">
            <p class="msg-preview">{{ msg.lastMsg }}</p>
            <span v-if="msg.unread > 0" class="msg-badge">{{ msg.unread }}</span>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>

<style scoped>
.page { padding-bottom: 32px; }
h2 { margin: 0 0 20px; color: #0c1424; font-size: 22px; }
.state-msg { text-align: center; color: #6a8bb0; padding: 40px; }
.state-msg.error { color: #c0392b; }

.msg-list { display: flex; flex-direction: column; gap: 1px; }

.msg-item {
  display: flex;
  gap: 14px;
  padding: 14px 16px;
  background: rgba(255,255,255,0.85);
  border-radius: 10px;
  margin-bottom: 8px;
  border: 1px solid rgba(180,212,245,0.2);
  cursor: pointer;
  transition: background 0.2s;
}
.msg-item:hover { background: rgba(255,255,255,0.95); }

.msg-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: linear-gradient(135deg, #b4d4f5, #8bb8e8);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  color: #fff;
  flex-shrink: 0;
}

.msg-body { flex: 1; min-width: 0; }
.msg-top { display: flex; justify-content: space-between; margin-bottom: 4px; }
.msg-name { font-size: 14px; font-weight: 500; color: #0c1424; }
.msg-time { font-size: 12px; color: #a0b8d0; }

.msg-bottom { display: flex; justify-content: space-between; align-items: center; gap: 10px; }
.msg-preview {
  margin: 0;
  font-size: 13px;
  color: #6a8bb0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.msg-badge {
  font-size: 11px;
  padding: 1px 7px;
  border-radius: 10px;
  background: #f8d7e3;
  color: #c0392b;
  flex-shrink: 0;
}
</style>
