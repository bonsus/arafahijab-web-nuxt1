<template>
  <NuxtLayout name="auth">
    <div class="bg-white rounded-3xl shadow-card-hover p-8">
      <div class="text-center mb-7">
        <h1 class="text-2xl font-bold text-gray-900">Daftar Akun</h1>
        <p class="text-gray-400 text-sm mt-1">Buat akun baru untuk mulai belanja</p>
      </div>

      <form @submit.prevent="handleRegister" class="space-y-4">
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1.5">Nama Lengkap</label>
          <input v-model="form.name" type="text" required autocomplete="name"
            class="w-full border border-sand rounded-xl px-4 py-3 text-sm bg-cream focus:outline-none focus:ring-2 focus:ring-primary-400 focus:bg-white transition"
            placeholder="Nama lengkap" />
          <p v-if="errors.name" class="mt-1 text-xs text-red-500">{{ errors.name[0] }}</p>
        </div>
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
          <input v-model="form.email" type="email" required autocomplete="email"
            class="w-full border border-sand rounded-xl px-4 py-3 text-sm bg-cream focus:outline-none focus:ring-2 focus:ring-primary-400 focus:bg-white transition"
            placeholder="email@contoh.com" />
          <p v-if="errors.email" class="mt-1 text-xs text-red-500">{{ errors.email[0] }}</p>
        </div>
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1.5">Nomor HP <span class="font-normal text-gray-400">(opsional)</span></label>
          <input v-model="form.phone" type="tel" autocomplete="tel"
            class="w-full border border-sand rounded-xl px-4 py-3 text-sm bg-cream focus:outline-none focus:ring-2 focus:ring-primary-400 focus:bg-white transition"
            placeholder="08xxxxxxxxxx" />
          <p v-if="errors.phone" class="mt-1 text-xs text-red-500">{{ errors.phone[0] }}</p>
        </div>
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
          <input v-model="form.password" type="password" required autocomplete="new-password"
            class="w-full border border-sand rounded-xl px-4 py-3 text-sm bg-cream focus:outline-none focus:ring-2 focus:ring-primary-400 focus:bg-white transition"
            placeholder="Minimal 8 karakter" />
          <p v-if="errors.password" class="mt-1 text-xs text-red-500">{{ errors.password[0] }}</p>
        </div>
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1.5">Konfirmasi Password</label>
          <input v-model="form.password_confirmation" type="password" required autocomplete="new-password"
            class="w-full border border-sand rounded-xl px-4 py-3 text-sm bg-cream focus:outline-none focus:ring-2 focus:ring-primary-400 focus:bg-white transition"
            placeholder="Ulangi password" />
          <p v-if="errors.password_confirmation" class="mt-1 text-xs text-red-500">{{ errors.password_confirmation[0] }}</p>
        </div>

        <p v-if="globalError" class="text-sm text-red-600 text-center bg-red-50 rounded-xl py-2.5 px-3">{{ globalError }}</p>

        <button type="submit" :disabled="loading"
          class="w-full py-3.5 bg-primary-700 text-white font-bold rounded-xl hover:bg-primary-800 disabled:opacity-60 transition shadow-sm mt-2">
          {{ loading ? 'Mendaftar...' : 'Daftar Sekarang' }}
        </button>
      </form>

      <p class="text-center text-sm text-gray-500 mt-6">
        Sudah punya akun?
        <NuxtLink to="/auth/login" class="text-primary-700 font-semibold hover:underline">Masuk</NuxtLink>
      </p>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import type { AuthResponse } from '~/types/api'

definePageMeta({ middleware: 'guest', layout: false })
useSeoMeta({ title: 'Daftar Akun' })

const authStore = useAuthStore()
const form = reactive({ name: '', email: '', phone: '', password: '', password_confirmation: '' })
const errors = reactive<Record<string, string[]>>({})
const globalError = ref('')
const loading = ref(false)

async function handleRegister() {
  Object.keys(errors).forEach((k) => delete errors[k])
  globalError.value = ''
  loading.value = true
  try {
    const body: Record<string, string> = { name: form.name, email: form.email, password: form.password, password_confirmation: form.password_confirmation }
    if (form.phone) body.phone = form.phone
    const res = await $fetch<{ message: string; data: AuthResponse }>('/api/auth/register', { method: 'POST', body })
    authStore.setAuth(res.data.token, res.data.user)
    await navigateTo('/')
  } catch (e: any) {
    if (e?.data?.errors) Object.assign(errors, e.data.errors)
    else globalError.value = e?.data?.error ?? 'Pendaftaran gagal. Coba lagi.'
  } finally {
    loading.value = false
  }
}
</script>