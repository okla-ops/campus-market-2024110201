import http from './http'
import type { Errand } from '@/types'

export function getErrands(): Promise<{ data: Errand[] }> {
  return http.get('/errands')
}

export function addErrand(data: Omit<Errand, 'id'>): Promise<{ data: Errand }> {
  return http.post('/errands', data)
}
