<script setup lang="ts">
// 拼单互助页面 — 后续可添加拼单卡片、组队入口等
</script>

<template>
  <section class="page">
    <h2>拼单互助</h2>
    <div class="placeholder">
      <p>拼单与互助信息区域</p>
      <p class="hint">此处后续将展示拼单卡片与组队入口</p>
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
