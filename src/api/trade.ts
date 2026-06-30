import http from './http'
import type { Trade } from '@/types'

export function getTrades(): Promise<{ data: Trade[] }> {
  return http.get('/trades')
}

export function addTrade(data: Omit<Trade, 'id'>): Promise<{ data: Trade }> {
  return http.post('/trades', data)
}
