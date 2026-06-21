<template>
  <NuxtLayout name="auth">
    <div class="bg-white rounded-3xl shadow-card-hover p-8">
      <div class="text-center mb-8">
        <h1 class="text-2xl font-bold text-gray-900">Masuk</h1>
        <p class="text-gray-400 text-sm mt-1">Selamat datang kembali!</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1.5">Email / Nomor HP</label>
          <input
            v-model="form.email"
            type="text"
            required
            autocomplete="email"
            class="w-full border border-sand rounded-xl px-4 py-3 text-sm bg-cream focus:outline-none focus:ring-2 focus:ring-primary-400 focus:bg-white transition"
            placeholder="email@contoh.com"
          />
          <p v-if="errors.email" class="mt-1 text-xs text-red-500">{{ errors.email }}</p>
        </div>

        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
          <div class="relative">
            <input
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              required
              autocomplete="current-password"
              class="w-full border border-sand rounded-xl px-4 py-3 text-sm bg-cream focus:outline-none focus:ring-2 focus:ring-primary-400 focus:bg-white transition pr-11"
              placeholder="Password"
            />
            <button type="button" @click="showPassword = !showPassword" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/></svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
            </button>
          </div>
          <p v-if="errors.password" class="mt-1 text-xs text-red-500">{{ errors.password }}</p>
        </div>

        <p v-if="globalError" class="text-sm text-red-600 text-center bg-red-50 rounded-xl py-2.5 px-3">{{ globalError }}</p>

        <button
          type="submit"
          :disabled="loading"
          class="w-full py-3.5 bg-primary-700 text-white font-bold rounded-xl hover:bg-primary-800 disabled:opacity-60 transition shadow-sm mt-2"
        >
          {{ loading ? 'Masuk...' : 'Masuk' }}
        </button>
      </form>

      <p class="text-center text-sm text-gray-500 mt-6">
        Belum punya akun?
        <NuxtLink to="/auth/register" class="text-primary-700 font-semibold hover:underline">Daftar sekarang</NuxtLink>
      </p>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import type { AuthResponse } from '~/types/api'

definePageMeta({ middleware: 'guest', layout: false })
useSeoMeta({ title: 'Masuk' })

const authStore = useAuthStore()
const route = useRoute()

const form = reactive({ email: '', password: '' })
const errors = reactive<{ email?: string; password?: string }>({})
const globalError = ref('')
const loading = ref(false)
const showPassword = ref(false)

async function handleLogin() {
  Object.assign(errors, { email: '', password: '' })
  globalError.value = ''
  loading.value = true
  try {
    const res = await $fetch<{ message: string; data: AuthResponse }>('/api/auth/login', {
      method: 'POST',
      body: { email: form.email, password: form.password },
    })
    authStore.setAuth(res.data.token, res.data.user)
    const redirect = (route.query.redirect as string) || '/'
    await navigateTo(redirect)
  } catch (e: any) {
    if (e?.data?.errors) Object.assign(errors, e.data.errors)
    else globalError.value = e?.data?.error ?? 'Login gagal. Coba lagi.'
  } finally {
    loading.value = false
  }
}
</script>