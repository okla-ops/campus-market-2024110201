<script setup lang="ts">
// 消息聊天页 — 后续可添加会话列表、聊天窗口等
</script>

<template>
  <section class="page">
    <h2>消息聊天</h2>
    <div class="placeholder">
      <p>消息与聊天区域</p>
      <p class="hint">此处后续将展示会话列表与聊天窗口</p>
    </div>
  </section>
</template>

<style scoped>
.page { padding-bottom: 32px; }
h2 { margin: 0 0 20px; color: #0c1424; font-size: 22px; }
.placeholder {
  padding: 80px 32px;
  text-align: center;
  background: rgba(255,255,255,0.6);
  border-radius: 12px;
  border: 2px dashed rgba(180,212,245,0.4);
  color: #6a8bb0;
}
.placeholder p { margin: 0 0 8px; font-size: 18px; }
.hint { font-size: 13px !important; color: #a0b8d0; }
</style>
