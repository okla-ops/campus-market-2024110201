import http from './http'
import type { Errand } from '@/types'

export function getErrands(): Promise<{ data: Errand[] }> {
  return http.get('/errands')
}
