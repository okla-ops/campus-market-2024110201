export interface Trade {
  id: number
  title: string
  price: number
  category: string
  condition: string
  publisher: string
  publishedAt: string
  location: string
  images: string[]
  status: 'open' | 'closed'
  description: string
}

export interface LostFound {
  id: number
  title: string
  type: '丢失' | '捡到'
  itemName: string
  location: string
  lostTime?: string
  foundTime?: string
  contact: string
  description: string
  status: 'open' | 'done'
  remark?: string
}

export interface GroupBuy {
  id: number
  title: string
  type: string
  targetCount: number
  currentCount: number
  deadline: string
  location: string
  publisher: string
  status: 'open' | 'closed'
  description: string
}

export interface Errand {
  id: number
  title: string
  taskType: string
  reward: number
  pickup: string
  delivery: string
  deadline: string
  publisher: string
  status: 'open' | 'done'
  description: string
  remark?: string
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
  id: number
  nickname: string
  avatar: string
  studentId: string
  college: string
  phone: string
  publishedCount: number
} 
