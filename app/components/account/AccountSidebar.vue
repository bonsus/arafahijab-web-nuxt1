<template>
  <div class="bg-white rounded-3xl shadow-card p-4 space-y-1">
    <div class="text-center pb-4 border-b border-sand">
      <div class="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-2">
        <UserRound class="w-8 h-8 text-primary-600" />
      </div>
      <p class="font-semibold text-sm text-gray-900 truncate">{{ authStore.user?.name }}</p>
      <p class="text-xs text-gray-400 truncate">{{ authStore.user?.customer_category?.name }}</p>
    </div>

    <NuxtLink
      v-for="item in navItems"
      :key="item.to"
      :to="item.to"
      class="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition hover:bg-cream"
      active-class="bg-primary-50 text-primary-700"
    >
      <component :is="item.icon" class="w-4 h-4 flex-shrink-0" />
      {{ item.label }}
    </NuxtLink>

    <button
      @click="authStore.logout()"
      class="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition text-left"
    >
      <LogOut class="w-4 h-4 flex-shrink-0" />
      Keluar
    </button>
  </div>
</template>

<script setup lang="ts">
import { UserRound, LayoutList, MapPin, ShoppingBag, Heart, KeyRound, LogOut } from 'lucide-vue-next'

const authStore = useAuthStore()

const navItems = [
  { to: '/account/profile', icon: LayoutList, label: 'Profil Saya' },
  { to: '/account/addresses', icon: MapPin, label: 'Alamat' },
  { to: '/orders', icon: ShoppingBag, label: 'Pesanan' },
  { to: '/wishlist', icon: Heart, label: 'Wishlist' },
  { to: '/account/change-password', icon: KeyRound, label: 'Ganti Password' },
]
</script>
