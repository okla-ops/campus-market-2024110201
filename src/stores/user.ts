import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  const nickname = ref('张同学')
  const avatar = ref('')
  const studentId = ref('2024****0123')
  const college = ref('信息科学与技术学院')
  const phone = ref('138****1234')
  const publishedCount = ref(3)

  const initial = computed(() => nickname.value.charAt(0))

  function updateProfile(data: Partial<{
    nickname: string
    avatar: string
    studentId: string
    college: string
    phone: string
  }>) {
    if (data.nickname !== undefined) nickname.value = data.nickname
    if (data.avatar !== undefined) avatar.value = data.avatar
    if (data.studentId !== undefined) studentId.value = data.studentId
    if (data.college !== undefined) college.value = data.college
    if (data.phone !== undefined) phone.value = data.phone
  }

  return {
    nickname, avatar, studentId, college, phone,
    publishedCount, initial, updateProfile,
  }
})
