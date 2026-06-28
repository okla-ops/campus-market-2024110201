<script setup lang="ts">
// 跑腿代办页面 — 后续可添加代办任务列表、发布委托等
</script>

<template>
  <section class="page">
    <h2>跑腿代办</h2>
    <div class="placeholder">
      <p>跑腿代办任务区域</p>
      <p class="hint">此处后续将展示代办任务与发布委托入口</p>
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
