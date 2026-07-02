<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { getUsers, createUser } from '@/api/user'

const router = useRouter()

const form = reactive({
  nickname: '',
  studentId: '',
  college: '',
  phone: '',
  password: '',
  confirmPassword: '',
})
const submitting = ref(false)
const errorMsg = ref('')

async function handleRegister() {
  errorMsg.value = ''
  if (!form.nickname.trim() || !form.password.trim()) {
    errorMsg.value = '请填写必填项'
    return
  }
  if (form.password.length < 6) {
    errorMsg.value = '密码长度不少于 6 位'
    return
  }
  if (form.password !== form.confirmPassword) {
    errorMsg.value = '两次密码输入不一致'
    return
  }
  submitting.value = true
  try {
    const res = await getUsers()
    if (res.data.some((u: any) => u.nickname === form.nickname.trim())) {
      errorMsg.value = '该昵称已被注册'
      submitting.value = false
      return
    }
    await createUser({
      nickname: form.nickname.trim(),
      studentId: form.studentId.trim() || `2024****${String(Math.random()).slice(2, 6)}`,
      college: form.college.trim() || '未填写',
      phone: form.phone.trim() || '待补充',
      password: form.password,
    })
    router.push('/login')
  } catch {
    errorMsg.value = '注册失败，请确认 Mock 服务已启动'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="auth-page">
    <div class="auth-card">
      <h2>注册</h2>
      <form @submit.prevent="handleRegister">
        <div class="field">
          <label>昵称 *</label>
          <input v-model="form.nickname" placeholder="你的校园昵称" />
        </div>
        <div class="field">
          <label>学号</label>
          <input v-model="form.studentId" placeholder="选填" />
        </div>
        <div class="field">
          <label>学院</label>
          <input v-model="form.college" placeholder="选填" />
        </div>
        <div class="field">
          <label>手机号</label>
          <input v-model="form.phone" placeholder="选填" />
        </div>
        <div class="field">
          <label>密码 *</label>
          <input v-model="form.password" type="password" placeholder="不少于 6 位" />
        </div>
        <div class="field">
          <label>确认密码 *</label>
          <input v-model="form.confirmPassword" type="password" placeholder="再次输入密码" />
        </div>
        <p v-if="errorMsg" class="error">{{ errorMsg }}</p>
        <button type="submit" class="btn btn-primary" :disabled="submitting">
          {{ submitting ? '注册中...' : '注册' }}
        </button>
      </form>
      <p class="switch-link">
        已有账号？<router-link to="/login">立即登录</router-link>
      </p>
    </div>
  </div>
</template>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(-45deg, #b4d4f5, #e6c88c, #f8d7e3, #b4d4f5);
  background-size: 400% 400%;
  animation: gradientShift 16s ease infinite;
}
@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
.auth-card {
  width: 360px;
  padding: 36px 28px;
  background: rgba(255,255,255,0.9);
  backdrop-filter: blur(12px);
  border-radius: 16px;
  border: 1px solid rgba(255,255,255,0.3);
  text-align: center;
}
h2 { margin: 0 0 24px; color: #0c1424; font-size: 24px; }
.field {
  text-align: left;
  margin-bottom: 16px;
}
.field label {
  display: block;
  font-size: 13px;
  color: #4a6a8a;
  margin-bottom: 6px;
}
.field input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid rgba(180,212,245,0.4);
  border-radius: 8px;
  font-size: 14px;
  background: rgba(255,255,255,0.8);
  outline: none;
  box-sizing: border-box;
}
.field input:focus { border-color: #b4d4f5; }
.error { color: #c0392b; font-size: 13px; margin: 8px 0; }
.btn {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  cursor: pointer;
  margin-top: 8px;
}
.btn:disabled { opacity: 0.6; cursor: not-allowed; }
.btn-primary {
  background: linear-gradient(135deg, #b4d4f5, #8bb8e8);
  color: #fff;
}
.btn-primary:hover:not(:disabled) { opacity: 0.9; }
.switch-link { font-size: 13px; color: #6a8bb0; margin-top: 16px; }
.switch-link a { color: #b4d4f5; text-decoration: none; }
.switch-link a:hover { text-decoration: underline; }
</style>
