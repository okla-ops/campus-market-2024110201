import http from './http'
import type { User } from '@/types'

export function getUsers(): Promise<{ data: User[] }> {
  return http.get('/users')
}

export function createUser(data: Omit<User, 'id'>): Promise<{ data: User }> {
  return http.post('/users', data)
}
