<script setup lang="ts">
// 用户个人主页 — 后续可添加用户信息、发布记录、账号设置等
</script>

<template>
  <section class="page">
    <h2>个人主页</h2>
    <div class="placeholder">
      <p>用户个人中心</p>
      <p class="hint">此处后续将展示用户信息、发布记录与账号设置</p>
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
