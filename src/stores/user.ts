import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  const nickname = ref('')
  const avatar = ref('')
  const studentId = ref('')
  const college = ref('')
  const phone = ref('')

  const isLoggedIn = computed(() => !!nickname.value)
  const initial = computed(() => nickname.value ? nickname.value.charAt(0) : '')

  function login(userData: {
    nickname: string
    avatar?: string
    studentId: string
    college: string
    phone: string
  }) {
    nickname.value = userData.nickname
    avatar.value = userData.avatar || ''
    studentId.value = userData.studentId
    college.value = userData.college
    phone.value = userData.phone
    localStorage.setItem('user', JSON.stringify({
      nickname: nickname.value,
      avatar: avatar.value,
      studentId: studentId.value,
      college: college.value,
      phone: phone.value,
    }))
  }

  function logout() {
    nickname.value = ''
    avatar.value = ''
    studentId.value = ''
    college.value = ''
    phone.value = ''
    localStorage.removeItem('user')
  }

  function restoreSession() {
    const saved = localStorage.getItem('user')
    if (!saved) return
    try {
      const data = JSON.parse(saved)
      nickname.value = data.nickname || ''
      avatar.value = data.avatar || ''
      studentId.value = data.studentId || ''
      college.value = data.college || ''
      phone.value = data.phone || ''
    } catch {
      logout()
    }
  }

  return {
    nickname, avatar, studentId, college, phone,
    isLoggedIn, initial, login, logout, restoreSession,
  }
})
