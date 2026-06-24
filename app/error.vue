<template>
  <NuxtLayout name="default">
    <div class="min-h-[60vh] flex flex-col items-center justify-center px-4 py-20 text-center">
      <div class="mb-6 text-primary-200">
        <component :is="errorIcon" class="w-24 h-24 mx-auto" stroke-width="1" />
      </div>

      <p class="text-7xl font-bold text-primary-700 mb-4">{{ error?.statusCode ?? 500 }}</p>

      <h1 class="text-2xl font-semibold text-gray-800 mb-2">{{ errorTitle }}</h1>
      <p class="text-gray-500 max-w-md mb-10">{{ errorMessage }}</p>

      <div class="flex flex-col sm:flex-row gap-3">
        <NuxtLink
          to="/"
          class="px-6 py-3 bg-primary-700 text-white font-medium rounded-xl hover:bg-primary-800 transition-colors"
        >
          Kembali ke Beranda
        </NuxtLink>
        <button
          @click="handleError"
          class="px-6 py-3 border border-sand text-gray-600 font-medium rounded-xl hover:bg-sand/40 transition-colors"
        >
          Muat Ulang
        </button>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { FileQuestion, ServerCrash, WifiOff, ShieldAlert } from 'lucide-vue-next'

const props = defineProps<{ error: { statusCode: number; statusMessage?: string; message?: string } | null }>()

const errorIcon = computed(() => {
  switch (props.error?.statusCode) {
    case 404: return FileQuestion
    case 403: return ShieldAlert
    case 503: return WifiOff
    default: return ServerCrash
  }
})

const errorTitle = computed(() => {
  switch (props.error?.statusCode) {
    case 404: return 'Halaman Tidak Ditemukan'
    case 403: return 'Akses Ditolak'
    case 503: return 'Layanan Tidak Tersedia'
    default: return 'Terjadi Kesalahan'
  }
})

const errorMessage = computed(() => {
  if (props.error?.statusMessage && props.error.statusMessage !== props.error?.statusCode?.toString()) {
    return props.error.statusMessage
  }
  switch (props.error?.statusCode) {
    case 404: return 'Halaman yang kamu cari tidak ada atau sudah dipindahkan.'
    case 403: return 'Kamu tidak memiliki izin untuk mengakses halaman ini.'
    case 503: return 'Server sedang dalam pemeliharaan. Coba lagi beberapa saat.'
    default: return 'Terjadi kesalahan yang tidak terduga. Silakan coba lagi.'
  }
})

function handleError() {
  clearError({ redirect: '/' })
}
</script>
