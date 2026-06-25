<template>
  <NuxtLayout name="default">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      <!-- Account sidebar + content layout -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">

        <!-- Sidebar -->
        <div class="md:col-span-1">
          <AccountSidebar />
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
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { Check, ArrowRight } from 'lucide-vue-next'
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