import http from './http'
import type { GroupBuy } from '@/types'

export function getGroupBuys(): Promise<{ data: GroupBuy[] }> {
  return http.get('/groupBuys')
}
