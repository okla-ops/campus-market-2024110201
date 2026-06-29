<script setup lang="ts">
import { ref } from 'vue'

const activeTab = ref<'trade' | 'lostfound' | 'groupbuy' | 'errand'>('trade')
const submitted = ref(false)

const tabs = [
  { key: 'trade', label: '二手交易', icon: '📦' },
  { key: 'lostfound', label: '失物招领', icon: '🔍' },
  { key: 'groupbuy', label: '拼单互助', icon: '🤝' },
  { key: 'errand', label: '跑腿代办', icon: '🏃' },
] as const

const form = ref({
  title: '',
  price: '',
  category: '',
  condition: '',
  description: '',
  location: '',
  contact: '',
  itemName: '',
  type: '丢失',
  lostTime: '',
  foundTime: '',
  targetCount: '',
  deadline: '',
  taskType: '',
  reward: '',
  pickup: '',
  delivery: '',
})

function submit() {
  submitted.value = true
  setTimeout(() => {
    submitted.value = false
    Object.keys(form.value).forEach((k) => {
      form.value[k as keyof typeof form.value] = ''
    })
  }, 2000)
}
</script>

<template>
  <section class="page">
    <h2>信息发布</h2>

    <div class="tabs">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        :class="['tab-btn', { active: activeTab === tab.key }]"
        @click="activeTab = tab.key"
      >
        {{ tab.icon }} {{ tab.label }}
      </button>
    </div>

    <form class="publish-form" @submit.prevent="submit">
      <div v-if="activeTab === 'trade'">
        <label>商品标题 <input v-model="form.title" placeholder="如：高等数学第七版" required /></label>
        <label>价格 <input v-model="form.price" type="number" step="0.01" placeholder="25.00" /></label>
        <label>分类 <input v-model="form.category" placeholder="教材 / 数码 / 生活" /></label>
        <label>成色 <input v-model="form.condition" placeholder="全新 / 九成新" /></label>
        <label>地点 <input v-model="form.location" placeholder="如：北苑宿舍" /></label>
      </div>

      <div v-if="activeTab === 'lostfound'">
        <label>标题 <input v-model="form.title" placeholder="如：校园卡丢失" required /></label>
        <label>类型
          <select v-model="form.type">
            <option value="丢失">丢失</option>
            <option value="捡到">捡到</option>
          </select>
        </label>
        <label>物品名称 <input v-model="form.itemName" placeholder="如：校园一卡通" /></label>
        <label>地点 <input v-model="form.location" placeholder="丢失/捡到地点" /></label>
        <label>时间 <input v-model="form.lostTime" type="datetime-local" v-if="form.type === '丢失'" />
          <input v-model="form.foundTime" type="datetime-local" v-else /></label>
        <label>联系方式 <input v-model="form.contact" placeholder="手机号或宿舍地址" /></label>
      </div>

      <div v-if="activeTab === 'groupbuy'">
        <label>拼单标题 <input v-model="form.title" placeholder="如：水果拼单" required /></label>
        <label>目标人数 <input v-model="form.targetCount" type="number" placeholder="10" /></label>
        <label>截止时间 <input v-model="form.deadline" type="datetime-local" /></label>
        <label>地点 <input v-model="form.location" placeholder="取货地点" /></label>
      </div>

      <div v-if="activeTab === 'errand'">
        <label>任务标题 <input v-model="form.title" placeholder="如：帮忙取快递" required /></label>
        <label>任务类型 <input v-model="form.taskType" placeholder="取快递 / 帮带餐" /></label>
        <label>酬劳 <input v-model="form.reward" type="number" step="0.01" placeholder="3.00" /></label>
        <label>取件地点 <input v-model="form.pickup" placeholder="如：菜鸟驿站" /></label>
        <label>送达地点 <input v-model="form.delivery" placeholder="如：信息学院" /></label>
        <label>截止时间 <input v-model="form.deadline" type="datetime-local" /></label>
      </div>

      <label class="desc-label">详细描述
        <textarea v-model="form.description" rows="4" placeholder="请详细描述物品/任务信息..." />
      </label>

      <button type="submit" class="submit-btn">提交发布</button>

      <p v-if="submitted" class="success-msg">✅ 发布成功！</p>
    </form>
  </section>
</template>

<style scoped>
.page { padding-bottom: 32px; max-width: 640px; }
h2 { margin: 0 0 20px; color: #0c1424; font-size: 22px; }

.tabs { display: flex; gap: 6px; margin-bottom: 20px; flex-wrap: wrap; }
.tab-btn {
  padding: 8px 16px;
  border: 1px solid rgba(180,212,245,0.4);
  border-radius: 8px;
  background: rgba(255,255,255,0.7);
  font-size: 13px;
  cursor: pointer;
  color: #4a6a8a;
  transition: all 0.2s;
}
.tab-btn.active {
  background: #b4d4f5;
  color: #fff;
  border-color: #b4d4f5;
}

.publish-form { display: flex; flex-direction: column; gap: 14px; }
.publish-form label {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 13px;
  color: #4a6a8a;
}
.publish-form input,
.publish-form select,
.publish-form textarea {
  padding: 10px 12px;
  border: 1px solid rgba(180,212,245,0.4);
  border-radius: 8px;
  font-size: 14px;
  background: rgba(255,255,255,0.8);
  outline: none;
  transition: border 0.2s;
}
.publish-form input:focus,
.publish-form select:focus,
.publish-form textarea:focus {
  border-color: #b4d4f5;
}
.desc-label textarea { resize: vertical; }

.submit-btn {
  padding: 12px;
  background: linear-gradient(135deg, #b4d4f5, #8bb8e8);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  cursor: pointer;
  transition: opacity 0.2s;
}
.submit-btn:hover { opacity: 0.9; }

.success-msg {
  text-align: center;
  font-size: 14px;
  color: #2e7d32;
  margin: 0;
}
</style>
