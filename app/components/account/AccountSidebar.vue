<template>
  <div>
    <!-- Mobile: dropdown -->
    <div class="md:hidden relative">
      <!-- Account info -->
      <div class="flex items-center gap-3 bg-white rounded-2xl shadow-card px-4 py-3 mb-2">
        <div class="w-11 h-11 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
          <UserRound class="w-6 h-6 text-primary-600" />
        </div>
        <div class="min-w-0">
          <p class="font-semibold text-sm text-gray-900 truncate">{{ authStore.user?.name }}</p>
          <p class="text-xs text-gray-400 truncate">{{ authStore.user?.customer_category?.name }}</p>
        </div>
      </div>

      <button
        @click="open = !open"
        class="w-full bg-white rounded-2xl shadow-card px-4 py-3 flex items-center justify-between"
      >
        <span class="flex items-center gap-2.5 text-sm font-semibold text-gray-900">
          <component :is="currentItem.icon" class="w-4 h-4 text-primary-600 flex-shrink-0" />
          {{ currentItem.label }}
        </span>
        <ChevronDown class="w-5 h-5 text-gray-400 transition-transform" :class="{ 'rotate-180': open }" />
      </button>

      <Transition name="dropdown">
        <div
          v-if="open"
          class="absolute z-30 mt-2 w-full bg-white rounded-2xl shadow-lg border border-sand p-2 space-y-1"
        >
          <NuxtLink
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            @click="open = false"
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
      </Transition>
    </div>

    <!-- Desktop: sidebar -->
    <div class="hidden md:block bg-white rounded-3xl shadow-card p-4 space-y-1">
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
  </div>
</template>

<script setup lang="ts">
import { UserRound, LayoutList, MapPin, ShoppingBag, Heart, KeyRound, LogOut, ChevronDown } from 'lucide-vue-next'

const authStore = useAuthStore()
const route = useRoute()
const open = ref(false)

const navItems = [
  { to: '/account/profile', icon: LayoutList, label: 'Profil Saya' },
  { to: '/account/addresses', icon: MapPin, label: 'Alamat' },
  { to: '/orders', icon: ShoppingBag, label: 'Pesanan' },
  { to: '/wishlist', icon: Heart, label: 'Wishlist' },
  { to: '/account/change-password', icon: KeyRound, label: 'Ganti Password' },
]

const currentItem = computed(
  () => navItems.find((item) => route.path.startsWith(item.to)) ?? navItems[0]!
)

// Close dropdown on route change
watch(() => route.path, () => { open.value = false })
</script>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
