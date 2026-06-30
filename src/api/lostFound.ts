import http from './http'
import type { LostFound } from '@/types'

export function getLostFounds(): Promise<{ data: LostFound[] }> {
  return http.get('/lostFounds')
}

export function addLostFound(data: Omit<LostFound, 'id'>): Promise<{ data: LostFound }> {
  return http.post('/lostFounds', data)
}
