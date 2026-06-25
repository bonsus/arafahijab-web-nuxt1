<template>
  <NuxtLayout name="default">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">

        <!-- Sidebar -->
        <div class="md:col-span-1">
          <AccountSidebar />
        </div>

        <!-- Content -->
        <div class="md:col-span-3">
          <div class="bg-white rounded-3xl border border-sand shadow-card p-6 sm:p-8">
            <h1 class="text-xl font-bold text-gray-900 mb-1">Ganti Password</h1>
            <p class="text-sm text-gray-500 mb-6">Pastikan password baru Anda minimal 8 karakter.</p>

            <!-- Success message -->
            <div v-if="successMsg" class="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
              {{ successMsg }}
            </div>

            <!-- Error message -->
            <div v-if="globalError" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
              {{ globalError }}
            </div>

            <form @submit.prevent="handleChange" class="space-y-4">
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1.5">Password Lama</label>
                <input
                  v-model="form.old_password"
                  type="password"
                  required
                  class="w-full bg-cream border border-sand rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:bg-white transition"
                  placeholder="Masukkan password saat ini"
                />
                <p v-if="errors.old_password" class="mt-1 text-xs text-red-500">{{ errors.old_password[0] }}</p>
              </div>

              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1.5">Password Baru</label>
                <input
                  v-model="form.new_password"
                  type="password"
                  required
                  minlength="8"
                  class="w-full bg-cream border border-sand rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:bg-white transition"
                  placeholder="Minimal 8 karakter"
                />
                <p v-if="errors.new_password" class="mt-1 text-xs text-red-500">{{ errors.new_password[0] }}</p>
              </div>

              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1.5">Konfirmasi Password Baru</label>
                <input
                  v-model="form.new_password_confirmation"
                  type="password"
                  required
                  class="w-full bg-cream border border-sand rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:bg-white transition"
                  placeholder="Ulangi password baru"
                />
                <p v-if="errors.new_password_confirmation" class="mt-1 text-xs text-red-500">{{ errors.new_password_confirmation[0] }}</p>
              </div>

              <button
                type="submit"
                :disabled="saving"
                class="w-full py-3 bg-primary-700 text-white font-semibold rounded-xl hover:bg-primary-800 disabled:opacity-60 transition mt-2"
              >
                {{ saving ? 'Menyimpan...' : 'Ganti Password' }}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })
useSeoMeta({ title: 'Ganti Password' })

const authStore = useAuthStore()

const form = reactive({
  old_password: '',
  new_password: '',
  new_password_confirmation: '',
})
const errors = reactive<Record<string, string[]>>({})
const globalError = ref('')
const successMsg = ref('')
const saving = ref(false)

async function handleChange() {
  Object.keys(errors).forEach((k) => delete errors[k])
  globalError.value = ''
  successMsg.value = ''
  saving.value = true
  try {
    await $fetch('/api/auth/change-password', {
      method: 'PUT',
      headers: { Authorization: `Bearer ${authStore.token}` },
      body: {
        old_password: form.old_password,
        new_password: form.new_password,
        new_password_confirmation: form.new_password_confirmation,
      },
    })
    successMsg.value = 'Password berhasil diganti!'
    form.old_password = ''
    form.new_password = ''
    form.new_password_confirmation = ''
  } catch (e: any) {
    if (e?.data?.errors) Object.assign(errors, e.data.errors)
    else globalError.value = e?.data?.error ?? 'Gagal mengganti password.'
  } finally {
    saving.value = false
  }
}
</script>
