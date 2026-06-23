<template>
  <div class="min-h-screen bg-cream flex flex-col">

    <!-- DESKTOP HEADER -->
    <header class="sticky top-0 z-50 bg-white border-b border-sand">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center h-16 gap-6">

          <!-- Mobile menu button -->
          <button
            @click="showMobileMenu = true"
            class="md:hidden w-9 h-9 -ml-1 flex items-center justify-center text-gray-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors"
            aria-label="Buka menu"
          >
            <Menu class="w-6 h-6" />
          </button>

          <!-- Logo -->
          <NuxtLink to="/" class="flex items-center gap-2 flex-shrink-0">
            <span class="w-8 h-8 rounded-full bg-primary-700 text-white text-sm font-bold flex items-center justify-center leading-none select-none">A</span>
            <span class="text-lg font-semibold text-gray-900 tracking-tight hidden sm:block">ArafaHijab</span>
          </NuxtLink>

          <!-- Desktop Nav -->
          <nav class="hidden md:flex items-center gap-1 flex-1 justify-center">
            <NuxtLink
              v-for="item in navItems"
              :key="item.to"
              :to="item.to"
              class="px-4 py-2 text-sm font-medium text-gray-600 hover:text-primary-700 rounded-lg hover:bg-primary-50 transition-colors"
              active-class="text-primary-700 bg-primary-50"
            >
              {{ item.label }}
            </NuxtLink>
          </nav>

          <!-- Right Actions -->
          <div class="flex items-center gap-1 ml-auto">
            <!-- Search -->
            <button @click="showSearch = !showSearch" class="w-9 h-9 flex items-center justify-center text-gray-500 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            <!-- Wishlist (desktop) -->
            <NuxtLink v-if="isAuthenticated" to="/wishlist" class="hidden md:flex w-9 h-9 items-center justify-center text-gray-500 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </NuxtLink>

            <!-- Cart -->
            <NuxtLink to="/cart" class="relative w-9 h-9 flex items-center justify-center text-gray-500 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span v-if="cartStore.totalItems > 0" class="absolute -top-0.5 -right-0.5 bg-primary-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none">
                {{ cartStore.totalItems > 9 ? '9+' : cartStore.totalItems }}
              </span>
            </NuxtLink>

            <!-- Account dropdown -->
            <div class="relative ml-1" ref="accountDropdown">
              <button @click="showAccountMenu = !showAccountMenu" class="w-9 h-9 flex items-center justify-center text-gray-500 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </button>

              <transition name="fade">
                <div v-if="showAccountMenu" class="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-card-hover border border-sand py-2 z-50">
                  <div v-if="isAuthenticated">
                    <div class="px-4 py-3 border-b border-sand">
                      <p class="text-sm font-semibold text-gray-900 truncate">{{ authStore.user?.name }}</p>
                      <p class="text-xs text-gray-500 truncate">{{ authStore.user?.email }}</p>
                    </div>
                    <NuxtLink to="/account/profile" class="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-cream transition" @click="showAccountMenu = false">
                      Profil Saya
                    </NuxtLink>
                    <NuxtLink to="/account/addresses" class="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-cream transition" @click="showAccountMenu = false">
                      Alamat
                    </NuxtLink>
                    <NuxtLink to="/orders" class="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-cream transition" @click="showAccountMenu = false">
                      Pesanan
                    </NuxtLink>
                    <div class="border-t border-sand mt-1 pt-1">
                      <button @click="handleLogout" class="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition">
                        Keluar
                      </button>
                    </div>
                  </div>
                  <div v-else>
                    <NuxtLink to="/auth/login" class="block px-4 py-2.5 text-sm text-gray-700 hover:bg-cream transition" @click="showAccountMenu = false">Masuk</NuxtLink>
                    <NuxtLink to="/auth/register" class="block px-4 py-2.5 text-sm text-primary-700 font-medium hover:bg-cream transition" @click="showAccountMenu = false">Daftar</NuxtLink>
                  </div>
                </div>
              </transition>
            </div>
          </div>
        </div>
      </div>

      <!-- Search Bar (slide down) -->
      <transition name="slide-down">
        <div v-if="showSearch" class="border-t border-sand bg-white px-4 py-3">
          <form class="max-w-2xl mx-auto" @submit.prevent="handleSearch">
            <div class="relative">
              <svg xmlns="http://www.w3.org/2000/svg" class="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                v-model="searchQuery"
                ref="searchInput"
                type="text"
                placeholder="Cari hijab, warna, model..."
                class="w-full pl-11 pr-4 py-2.5 bg-cream border border-sand rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:bg-white transition"
                @keyup.esc="showSearch = false"
              />
            </div>
          </form>
        </div>
      </transition>
    </header>

    <!-- Main Content -->
    <main class="flex-1 pb-20 md:pb-0">
      <slot />
    </main>

    <!-- FOOTER -->
    <footer class="block bg-gray-900 text-gray-400">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-28 md:py-12">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div class="col-span-2 md:col-span-1">
            <div class="flex items-center gap-2 mb-3">
              <span class="w-8 h-8 rounded-full bg-primary-600 text-white text-sm font-bold flex items-center justify-center">A</span>
              <span class="text-white font-semibold">ArafaHijab</span>
            </div>
            <p class="text-sm leading-relaxed">Hijab premium untuk muslimah modern yang stylish, nyaman, dan elegan.</p>
          </div>
          <div>
            <h4 class="text-white font-semibold text-sm mb-3">Produk</h4>
            <ul class="space-y-2 text-sm">
              <li><NuxtLink to="/products" class="hover:text-white transition">Semua Produk</NuxtLink></li>
              <li><NuxtLink to="/products?promotion_discount=true" class="hover:text-white transition">Promo</NuxtLink></li>
              <li><NuxtLink to="/stock" class="hover:text-white transition">Stok Produk</NuxtLink></li>
              <li><NuxtLink to="/check-ongkir" class="hover:text-white transition">Cek Ongkir</NuxtLink></li>
            </ul>
          </div>
          <div>
            <h4 class="text-white font-semibold text-sm mb-3">Akun</h4>
            <ul class="space-y-2 text-sm">
              <li><NuxtLink to="/auth/login" class="hover:text-white transition">Masuk</NuxtLink></li>
              <li><NuxtLink to="/auth/register" class="hover:text-white transition">Daftar</NuxtLink></li>
              <li><NuxtLink to="/orders" class="hover:text-white transition">Pesanan Saya</NuxtLink></li>
              <li><NuxtLink to="/wishlist" class="hover:text-white transition">Wishlist</NuxtLink></li>
            </ul>
          </div>
          <div>
            <h4 class="text-white font-semibold text-sm mb-3">Info</h4>
            <ul class="space-y-2 text-sm">
              <li><span class="cursor-pointer hover:text-white transition">Tentang Kami</span></li>
              <li><span class="cursor-pointer hover:text-white transition">Kebijakan Privasi</span></li>
            </ul>
          </div>
        </div>
        <div class="mt-10 pt-6 border-t border-gray-800 text-xs text-center">
          &copy; {{ new Date().getFullYear() }} ArafaHijab. All rights reserved.
        </div>
      </div>
    </footer>

    <!-- MOBILE BOTTOM NAV -->
    <nav class="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-sand flex items-stretch">
      <NuxtLink to="/" class="flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5 text-gray-400 hover:text-primary-600 transition-colors" active-class="text-primary-600">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
        <span class="text-[10px] font-medium">Beranda</span>
      </NuxtLink>
      <NuxtLink to="/products" class="flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5 text-gray-400 hover:text-primary-600 transition-colors" active-class="text-primary-600">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
        <span class="text-[10px] font-medium">Produk</span>
      </NuxtLink>
      <NuxtLink to="/wishlist" class="flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5 text-gray-400 hover:text-primary-600 transition-colors" active-class="text-primary-600">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
        <span class="text-[10px] font-medium">Wishlist</span>
      </NuxtLink>
      <NuxtLink :to="isAuthenticated ? '/account/profile' : '/auth/login'" class="flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5 text-gray-400 hover:text-primary-600 transition-colors" active-class="text-primary-600">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        <span class="text-[10px] font-medium">Profil</span>
      </NuxtLink>
      <NuxtLink to="/cart" class="flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5 text-gray-400 hover:text-primary-600 transition-colors relative" active-class="text-primary-600">
        <span class="relative">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <span v-if="cartStore.totalItems > 0" class="absolute -top-1.5 -right-1.5 bg-primary-600 text-white text-[8px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center leading-none">
            {{ cartStore.totalItems > 9 ? '9+' : cartStore.totalItems }}
          </span>
        </span>
        <span class="text-[10px] font-medium">Keranjang</span>
      </NuxtLink>
    </nav>

    <!-- MOBILE MENU DRAWER -->
    <Teleport to="body">
      <transition name="fade">
        <div v-if="showMobileMenu" class="md:hidden fixed inset-0 z-[60]" @click.self="showMobileMenu = false">
          <div class="absolute inset-0 bg-black/40" @click="showMobileMenu = false" />
          <transition name="slide-left">
            <aside v-if="showMobileMenu" class="absolute top-0 left-0 bottom-0 w-72 max-w-[80%] bg-white shadow-card-hover flex flex-col">
              <!-- Header -->
              <div class="flex items-center justify-between px-5 h-16 border-b border-sand">
                <NuxtLink to="/" class="flex items-center gap-2" @click="showMobileMenu = false">
                  <span class="w-8 h-8 rounded-full bg-primary-700 text-white text-sm font-bold flex items-center justify-center leading-none">A</span>
                  <span class="text-lg font-semibold text-gray-900">ArafaHijab</span>
                </NuxtLink>
                <button @click="showMobileMenu = false" class="w-8 h-8 flex items-center justify-center rounded-full bg-cream text-gray-500" aria-label="Tutup menu"><X class="w-4 h-4" /></button>
              </div>
              <!-- Nav items -->
              <nav class="flex-1 overflow-y-auto py-2">
                <NuxtLink
                  v-for="item in navItems"
                  :key="item.to"
                  :to="item.to"
                  class="block px-5 py-3 text-sm font-medium text-gray-700 hover:bg-primary-50 hover:text-primary-700 transition-colors"
                  active-class="text-primary-700 bg-primary-50"
                  @click="showMobileMenu = false"
                >
                  {{ item.label }}
                </NuxtLink>
              </nav>
            </aside>
          </transition>
        </div>
      </transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { Menu, X } from 'lucide-vue-next'

const authStore = useAuthStore()
const cartStore = useCartStore()
const { isAuthenticated } = storeToRefs(authStore)
const router = useRouter()

const searchQuery = ref('')
const showSearch = ref(false)
const showAccountMenu = ref(false)
const showMobileMenu = ref(false)
const accountDropdown = ref<HTMLElement | null>(null)
const searchInput = ref<HTMLInputElement | null>(null)

const navItems = [
  { to: '/', label: 'Beranda' },
  { to: '/products', label: 'Produk' }, 
  { to: '/stock', label: 'Stok' },
  { to: '/check-ongkir', label: 'Cek Ongkir' },
]

onClickOutside(accountDropdown, () => { showAccountMenu.value = false })

watch(showSearch, (v) => {
  if (v) nextTick(() => searchInput.value?.focus())
})

onMounted(async () => {
  if (isAuthenticated.value) {
    await cartStore.fetchCart()
  }
})

function handleSearch() {
  if (searchQuery.value.trim()) {
    showSearch.value = false
    router.push({ path: '/products', query: { search: searchQuery.value.trim() } })
    searchQuery.value = ''
  }
}

function handleLogout() {
  showAccountMenu.value = false
  authStore.logout()
}
</script>

<style>
.fade-enter-active, .fade-leave-active { transition: opacity .15s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.slide-down-enter-active, .slide-down-leave-active { transition: all .2s ease; }
.slide-down-enter-from, .slide-down-leave-to { opacity: 0; transform: translateY(-8px); }
.slide-left-enter-active, .slide-left-leave-active { transition: transform .25s ease; }
.slide-left-enter-from, .slide-left-leave-to { transform: translateX(-100%); }
</style>
