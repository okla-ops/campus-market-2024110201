<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { getUsers } from '@/api/user'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const user = useUserStore()

const form = reactive({
  nickname: '',
  password: '',
})
const submitting = ref(false)
const errorMsg = ref('')

async function handleLogin() {
  errorMsg.value = ''
  if (!form.nickname.trim() || !form.password.trim()) {
    errorMsg.value = '请填写账号和密码'
    return
  }
  submitting.value = true
  try {
    const res = await getUsers()
    const found = res.data.find(
      (u: any) => u.nickname === form.nickname.trim() && u.password === form.password
    )
    if (found) {
      user.login({
        nickname: found.nickname,
        studentId: found.studentId,
        college: found.college,
        phone: found.phone,
      })
      router.push('/home')
    } else {
      errorMsg.value = '账号或密码错误'
    }
  } catch {
    errorMsg.value = '登录失败，请确认 Mock 服务已启动'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="auth-page">
    <div class="auth-card">
      <h2>登录</h2>
      <form @submit.prevent="handleLogin">
        <div class="field">
          <label>账号</label>
          <input v-model="form.nickname" placeholder="请输入昵称" />
        </div>
        <div class="field">
          <label>密码</label>
          <input v-model="form.password" type="password" placeholder="请输入密码" />
        </div>
        <p v-if="errorMsg" class="error">{{ errorMsg }}</p>
        <button type="submit" class="btn btn-primary" :disabled="submitting">
          {{ submitting ? '登录中...' : '登录' }}
        </button>
      </form>
      <p class="switch-link">
        还没有账号？<router-link to="/register">立即注册</router-link>
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
