import http from './http'
import type { LostFound } from '@/types'

export function getLostFounds(): Promise<{ data: LostFound[] }> {
  return http.get('/lostFounds')
}
