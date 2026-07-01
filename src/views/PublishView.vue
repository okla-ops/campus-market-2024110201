<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { addTrade } from '@/api/trade'
import { addLostFound } from '@/api/lostFound'
import { addGroupBuy } from '@/api/groupBuy'
import { addErrand } from '@/api/errand'
import FormField from '@/components/FormField.vue'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const user = useUserStore()

const activeType = ref<'trade' | 'lostfound' | 'groupbuy' | 'errand'>('trade')
const submitting = ref(false)
const feedback = reactive({ show: false, ok: false, msg: '' })

const types = [
  { key: 'trade', label: '二手交易', icon: '📦' },
  { key: 'lostfound', label: '失物招领', icon: '🔍' },
  { key: 'groupbuy', label: '拼单互助', icon: '🤝' },
  { key: 'errand', label: '跑腿代办', icon: '🏃' },
] as const

const routeMap: Record<string, string> = {
  trade: '/trade',
  lostfound: '/lostfound',
  groupbuy: '/groupbuy',
  errand: '/errand',
}

const form = reactive({
  title: '',
  category: '',
  price: '',
  condition: '',
  location: '',
  description: '',
  lostType: '丢失',
  itemName: '',
  lostTime: '',
  foundTime: '',
  contact: '',
  groupType: '',
  targetCount: '',
  deadline: '',
  taskType: '',
  reward: '',
  pickup: '',
  delivery: '',
})

const errors = reactive<Record<string, string>>({})

function todayString(): string {
  const d = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

function switchType(key: typeof activeType.value) {
  activeType.value = key
  Object.assign(errors, {})
  feedback.show = false
}

function validate(): boolean {
  Object.keys(errors).forEach((k) => delete errors[k])
  const t = activeType.value

  if (!form.title.trim()) errors.title = '请输入标题'
  if (!form.location.trim()) errors.location = '请输入地点'
  if (!form.description.trim()) errors.description = '请输入详细描述'

  if (t === 'trade') {
    if (!form.category.trim()) errors.category = '请选择分类'
    if (!form.price || Number(form.price) <= 0) errors.price = '请输入有效价格'
    if (!form.condition.trim()) errors.condition = '请填写成色'
  }

  if (t === 'lostfound') {
    if (!form.itemName.trim()) errors.itemName = '请输入物品名称'
    if (!form.contact.trim()) errors.contact = '请输入联系方式'
    if (form.lostType === '丢失' && !form.lostTime) errors.lostTime = '请选择丢失时间'
    if (form.lostType === '捡到' && !form.foundTime) errors.foundTime = '请选择捡到时间'
  }

  if (t === 'groupbuy') {
    if (!form.groupType.trim()) errors.groupType = '请输入拼单类型'
    if (!form.targetCount || Number(form.targetCount) <= 1) errors.targetCount = '目标人数需大于1'
    if (!form.deadline) errors.deadline = '请选择截止时间'
  }

  if (t === 'errand') {
    if (!form.taskType.trim()) errors.taskType = '请输入任务类型'
    if (!form.reward || Number(form.reward) < 0) errors.reward = '请输入有效酬劳'
    if (!form.pickup.trim()) errors.pickup = '请输入取件地点'
    if (!form.delivery.trim()) errors.delivery = '请输入送达地点'
    if (!form.deadline) errors.deadline = '请选择截止时间'
  }

  return Object.keys(errors).length === 0
}

async function handleSubmit() {
  if (!validate()) return
  submitting.value = true
  feedback.show = false

  try {
    const base = {
      title: form.title.trim(),
      location: form.location.trim(),
      description: form.description.trim(),
      status: 'open' as const,
      publisher: user.nickname,
    }

    switch (activeType.value) {
      case 'trade':
        await addTrade({
          ...base,
          category: form.category.trim(),
          price: Number(form.price),
          condition: form.condition.trim(),
          publishedAt: todayString(),
          images: [],
        })
        break
      case 'lostfound':
        await addLostFound({
          ...base,
          type: form.lostType as '丢失' | '捡到',
          itemName: form.itemName.trim(),
          lostTime: form.lostType === '丢失' ? form.lostTime : undefined,
          foundTime: form.lostType === '捡到' ? form.foundTime : undefined,
          contact: form.contact.trim(),
        })
        break
      case 'groupbuy':
        await addGroupBuy({
          ...base,
          type: form.groupType.trim(),
          targetCount: Number(form.targetCount),
          currentCount: 1,
          deadline: form.deadline,
        })
        break
      case 'errand':
        await addErrand({
          ...base,
          taskType: form.taskType.trim(),
          reward: Number(form.reward),
          pickup: form.pickup.trim(),
          delivery: form.delivery.trim(),
          deadline: form.deadline,
        })
        break
    }

    feedback.show = true
    feedback.ok = true
    feedback.msg = '发布成功！即将跳转到列表页'

    setTimeout(() => {
      router.push(routeMap[activeType.value])
    }, 1000)
  } catch {
    feedback.show = true
    feedback.ok = false
    feedback.msg = '提交失败，请确认 Mock 服务已启动（npm run mock）'
  } finally {
    submitting.value = false
  }
}

function resetForm() {
  Object.keys(form).forEach((k) => {
    const key = k as keyof typeof form
    if (key === 'lostType') form[key] = '丢失'
    else form[key] = ''
  })
  Object.keys(errors).forEach((k) => delete errors[k])
  feedback.show = false
}
</script>

<template>
  <section class="page">
    <h2>信息发布</h2>

    <div class="type-tabs">
      <button
        v-for="t in types"
        :key="t.key"
        :class="['tab-btn', { active: activeType === t.key }]"
        @click="switchType(t.key)"
      >
        {{ t.icon }} {{ t.label }}
      </button>
    </div>

    <form class="publish-form" @submit.prevent="handleSubmit">
      <FormField label="标题" required :error="errors.title">
        <input v-model="form.title" placeholder="请输入标题" maxlength="50" />
      </FormField>

      <FormField label="地点" required :error="errors.location">
        <input v-model="form.location" placeholder="如：北苑宿舍、图书馆" />
      </FormField>

      <!-- 二手交易专属字段 -->
      <template v-if="activeType === 'trade'">
        <FormField label="分类" required :error="errors.category">
          <input v-model="form.category" placeholder="教材 / 数码 / 生活 / 运动" />
        </FormField>
        <FormField label="价格（元）" required :error="errors.price">
          <input v-model.number="form.price" type="number" step="0.01" min="0" placeholder="25.00" />
        </FormField>
        <FormField label="成色" required :error="errors.condition">
          <input v-model="form.condition" placeholder="全新 / 九成新 / 八成新" />
        </FormField>
      </template>

      <!-- 失物招领专属字段 -->
      <template v-if="activeType === 'lostfound'">
        <FormField label="类型" required>
          <select v-model="form.lostType">
            <option value="丢失">丢失</option>
            <option value="捡到">捡到</option>
          </select>
        </FormField>
        <FormField label="物品名称" required :error="errors.itemName">
          <input v-model="form.itemName" placeholder="如：校园一卡通、黑色钱包" />
        </FormField>
        <FormField v-if="form.lostType === '丢失'" label="丢失时间" required :error="errors.lostTime">
          <input v-model="form.lostTime" type="datetime-local" />
        </FormField>
        <FormField v-if="form.lostType === '捡到'" label="捡到时间" required :error="errors.foundTime">
          <input v-model="form.foundTime" type="datetime-local" />
        </FormField>
        <FormField label="联系方式" required :error="errors.contact">
          <input v-model="form.contact" placeholder="手机号或宿舍地址" />
        </FormField>
      </template>

      <!-- 拼单搭子专属字段 -->
      <template v-if="activeType === 'groupbuy'">
        <FormField label="拼单类型" required :error="errors.groupType">
          <input v-model="form.groupType" placeholder="水果 / 饮品 / 学习 / 零食 / 聚餐" />
        </FormField>
        <FormField label="目标人数" required :error="errors.targetCount">
          <input v-model.number="form.targetCount" type="number" min="2" placeholder="10" />
        </FormField>
        <FormField label="截止时间" required :error="errors.deadline">
          <input v-model="form.deadline" type="datetime-local" />
        </FormField>
      </template>

      <!-- 跑腿代办专属字段 -->
      <template v-if="activeType === 'errand'">
        <FormField label="任务类型" required :error="errors.taskType">
          <input v-model="form.taskType" placeholder="取快递 / 帮带餐 / 取文件 / 代买" />
        </FormField>
        <FormField label="酬劳（元）" required :error="errors.reward">
          <input v-model.number="form.reward" type="number" step="0.01" min="0" placeholder="3.00" />
        </FormField>
        <FormField label="取件地点" required :error="errors.pickup">
          <input v-model="form.pickup" placeholder="如：菜鸟驿站" />
        </FormField>
        <FormField label="送达地点" required :error="errors.delivery">
          <input v-model="form.delivery" placeholder="如：信息学院一楼" />
        </FormField>
        <FormField label="截止时间" required :error="errors.deadline">
          <input v-model="form.deadline" type="datetime-local" />
        </FormField>
      </template>

      <FormField label="详细描述" required :error="errors.description">
        <textarea v-model="form.description" rows="4" placeholder="请详细描述物品/任务信息..." />
      </FormField>

      <div v-if="feedback.show" :class="['feedback', feedback.ok ? 'success' : 'error']">
        {{ feedback.msg }}
      </div>

      <div class="form-actions">
        <button type="submit" class="btn btn-primary" :disabled="submitting">
          {{ submitting ? '提交中...' : '提交发布' }}
        </button>
        <button type="button" class="btn btn-reset" @click="resetForm">重置</button>
      </div>
    </form>
  </section>
</template>

<style scoped>
.page { padding-bottom: 32px; max-width: 600px; }
h2 { margin: 0 0 20px; color: #0c1424; font-size: 22px; }

.type-tabs { display: flex; gap: 6px; margin-bottom: 24px; flex-wrap: wrap; }
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

.publish-form {
  display: flex;
  flex-direction: column;
  gap: 14px;
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
.publish-form textarea { resize: vertical; }

.feedback {
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 13px;
}
.feedback.success {
  background: #e8f5e9;
  color: #2e7d32;
}
.feedback.error {
  background: #fdecea;
  color: #c0392b;
}

.form-actions {
  display: flex;
  gap: 10px;
  margin-top: 4px;
}
.btn {
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  cursor: pointer;
  transition: opacity 0.2s;
}
.btn:disabled { opacity: 0.6; cursor: not-allowed; }
.btn-primary {
  background: linear-gradient(135deg, #b4d4f5, #8bb8e8);
  color: #fff;
}
.btn-primary:hover:not(:disabled) { opacity: 0.9; }
.btn-reset {
  background: rgba(255,255,255,0.7);
  color: #6a8bb0;
  border: 1px solid rgba(180,212,245,0.4);
  flex: 0 0 auto;
  padding: 12px 24px;
}
.btn-reset:hover { background: rgba(255,255,255,0.9); }
</style>
