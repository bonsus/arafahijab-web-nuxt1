<template>
  <div class="min-h-screen bg-cream flex flex-col items-center justify-center px-6 text-center">
    <div class="max-w-sm">
      <!-- Icon -->
      <div class="w-24 h-24 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-6">
        <WifiOff class="w-12 h-12 text-primary-500" />
      </div>

      <h1 class="text-2xl font-bold text-primary-800 mb-3">Tidak Ada Koneksi</h1>
      <p class="text-primary-600 mb-8 leading-relaxed">
        Kamu sedang offline. Periksa koneksi internet kamu, lalu coba lagi.
      </p>

      <button
        class="w-full bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
        @click="retry"
      >
        Coba Lagi
      </button>

      <NuxtLink
        to="/"
        class="block mt-4 text-sm text-primary-500 hover:text-primary-700 underline-offset-2 hover:underline transition-colors"
      >
        Kembali ke Beranda
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { WifiOff } from 'lucide-vue-next'

useHead({ title: 'Offline' })

function retry() {
  window.location.reload()
}
</script>
