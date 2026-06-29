import http from './http'
import type { Message } from '@/types'

export function getMessages(): Promise<{ data: Message[] }> {
  return http.get('/messages')
}
