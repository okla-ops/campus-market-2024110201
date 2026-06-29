import http from './http'
import type { Profile } from '@/types'

export function getProfile(): Promise<{ data: Profile }> {
  return http.get('/profile')
}
