export type ItemStatus = 'open' | 'closed' | 'done'

export interface Trade {
  id: number
  title: string
  price: number
  category: string
  condition: string
  publisher: string
  publishedAt: string
  location: string
  description: string
  status: ItemStatus
  images: string[]
}

export interface LostFound {
  id: number
  title: string
  type: '丢失' | '捡到'
  itemName: string
  lostTime?: string
  foundTime?: string
  contact: string
  location: string
  description: string
  publisher: string
  status: ItemStatus
}

export interface GroupBuy {
  id: number
  title: string
  type: string
  targetCount: number
  currentCount: number
  deadline: string
  location: string
  description: string
  publisher: string
  status: ItemStatus
}

export interface Errand {
  id: number
  title: string
  taskType: string
  reward: number
  pickup: string
  delivery: string
  deadline: string
  location: string
  description: string
  publisher: string
  status: ItemStatus
}

export interface Message {
  id: number
  avatar: string
  nickname: string
  lastMsg: string
  time: string
  unread: number
}

export interface Profile {
  nickname: string
  avatar: string
  studentId: string
  college: string
  phone: string
  publishedCount: number
}

export interface User {
  id?: string | number
  nickname: string
  studentId: string
  college: string
  phone: string
  password: string
}
