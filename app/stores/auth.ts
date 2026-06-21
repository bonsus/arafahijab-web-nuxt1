import { defineStore } from 'pinia'
import type { User, AuthResponse } from '~/types/api'

export const useAuthStore = defineStore('auth', () => {
  // Token disimpan di httpOnly-like cookie agar terbaca saat SSR
  const token = useCookie<string | null>('arafahijab_token', {
    maxAge: 60 * 60 * 24 * 30, // 30 hari
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  })

  const user = ref<User | null>(null)
  const isAuthenticated = computed(() => !!token.value)

  function setAuth(newToken: string, newUser: User) {
    token.value = newToken
    user.value = newUser
  }

  function logout() {
    token.value = null
    user.value = null
    navigateTo('/auth/login')
  }

  async function fetchMe() {
    if (!token.value) return
    try {
      const res = await $fetch<{ message: string; data: User }>('/api/auth/me', {
        headers: { Authorization: `Bearer ${token.value}` },
      })
      user.value = res.data
    } catch (e: any) {
      // Only logout on 401 Unauthorized, not on network errors or 5xx
      if (e?.status === 401 || e?.response?.status === 401) {
        logout()
      }
    }
  }

  return { token, user, isAuthenticated, setAuth, logout, fetchMe }
})
