import http from './http'
import type { GroupBuy } from '@/types'

export function getGroupBuys(): Promise<{ data: GroupBuy[] }> {
  return http.get('/groupBuys')
}

export function addGroupBuy(data: Omit<GroupBuy, 'id'>): Promise<{ data: GroupBuy }> {
  return http.post('/groupBuys', data)
}
