import http from './http'
import type { Trade } from '@/types'

export function getTrades(): Promise<{ data: Trade[] }> {
  return http.get('/trades')
}
