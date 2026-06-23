<template>
  <NuxtLayout name="default">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      <!-- Account sidebar + content layout -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">

        <!-- Sidebar -->
        <div class="md:col-span-1">
          <div class="bg-white rounded-3xl shadow-card p-4 space-y-1">
            <div class="text-center pb-4 border-b border-sand">
              <div class="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-2">
                <UserRound class="w-8 h-8 text-primary-600" />
              </div>
              <p class="font-semibold text-sm text-gray-900 truncate">{{ authStore.user?.name }}</p>
              <p class="text-xs text-gray-400 truncate">{{ authStore.user?.customer_category?.name }}</p>
            </div>
            <NuxtLink to="/account/profile" class="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition" active-class="bg-primary-50 text-primary-700">Profil Saya</NuxtLink>
            <NuxtLink to="/account/addresses" class="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition hover:bg-cream" active-class="bg-primary-50 text-primary-700">Alamat</NuxtLink>
            <NuxtLink to="/orders" class="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition hover:bg-cream" active-class="bg-primary-50 text-primary-700">Pesanan</NuxtLink>
            <NuxtLink to="/wishlist" class="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition hover:bg-cream" active-class="bg-primary-50 text-primary-700">Wishlist</NuxtLink>
            <button @click="authStore.logout()" class="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition text-left">Keluar</button>
          </div>
        </div>

        <!-- Profile Form -->
        <div class="md:col-span-3">
          <div class="bg-white rounded-3xl shadow-card p-6">
            <h1 class="text-lg font-bold text-gray-900 mb-5">Profil Saya</h1>
            <form @submit.prevent="handleSave" class="space-y-4">
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1.5">Nama Lengkap</label>
                <input v-model="form.name" type="text" required class="w-full border border-sand rounded-xl px-4 py-3 text-sm bg-cream focus:outline-none focus:ring-2 focus:ring-primary-400 focus:bg-white transition" />
                <p v-if="errors.name" class="mt-1 text-xs text-red-500">{{ errors.name[0] }}</p>
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
                <input v-model="form.email" type="email" required class="w-full border border-sand rounded-xl px-4 py-3 text-sm bg-cream focus:outline-none focus:ring-2 focus:ring-primary-400 focus:bg-white transition" />
                <p v-if="errors.email" class="mt-1 text-xs text-red-500">{{ errors.email[0] }}</p>
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1.5">Nomor HP</label>
                <input v-model="form.phone" type="tel" class="w-full border border-sand rounded-xl px-4 py-3 text-sm bg-cream focus:outline-none focus:ring-2 focus:ring-primary-400 focus:bg-white transition" />
                <p v-if="errors.phone" class="mt-1 text-xs text-red-500">{{ errors.phone[0] }}</p>
              </div>
              <div class="bg-cream rounded-2xl px-4 py-3 text-sm text-gray-600">
                Bergabung sejak: <strong>{{ authStore.user?.date_joined ? formatDate(authStore.user.date_joined) : '-' }}</strong>
              </div>
              <p v-if="successMsg" class="flex items-center gap-1.5 text-sm text-green-600 font-medium"><Check class="w-4 h-4" /> {{ successMsg }}</p>
              <p v-if="globalError" class="text-sm text-red-600">{{ globalError }}</p>
              <div class="flex items-center gap-3 pt-2">
                <button type="submit" :disabled="saving" class="px-7 py-3 bg-primary-700 text-white font-bold rounded-xl hover:bg-primary-800 disabled:opacity-60 transition">
                  {{ saving ? 'Menyimpan...' : 'Simpan Perubahan' }}
                </button>
                <NuxtLink to="/account/change-password" class="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary-600">Ganti Password <ArrowRight class="w-4 h-4" /></NuxtLink>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { UserRound, Check, ArrowRight } from 'lucide-vue-next'
import { formatDate } from '~/utils/format'
definePageMeta({ middleware: 'auth' })
useSeoMeta({ title: 'Profil Saya' })
const authStore = useAuthStore()
const form = reactive({ name: authStore.user?.name ?? '', email: authStore.user?.email ?? '', phone: authStore.user?.phone ?? '' })
const errors = reactive<Record<string, string[]>>({})
const globalError = ref('')
const successMsg = ref('')
const saving = ref(false)
watch(() => authStore.user, (user) => { if (user) { form.name = user.name; form.email = user.email; form.phone = user.phone } }, { immediate: true })
async function handleSave() {
  Object.keys(errors).forEach((k) => delete errors[k])
  globalError.value = ''
  successMsg.value = ''
  saving.value = true
  try {
    await $fetch('/api/auth/profile', { method: 'PUT', headers: { Authorization: `Bearer ${authStore.token}` }, body: { name: form.name, email: form.email, phone: form.phone } })
    await authStore.fetchMe()
    successMsg.value = 'Profil berhasil disimpan!'
  } catch (e: any) {
    if (e?.data?.errors) Object.assign(errors, e.data.errors)
    else globalError.value = e?.data?.error ?? 'Gagal menyimpan profil.'
  } finally {
    saving.value = false
  }
}
</script>