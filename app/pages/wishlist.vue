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
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Wishlist Saya</h1>

      <LoadingSpinner v-if="loading" />

      <div v-else-if="!wishlistStore.items.length" class="text-center py-20">
        <div class="w-24 h-24 rounded-full bg-cream-dark flex items-center justify-center mx-auto mb-5">
          <Heart class="w-10 h-10 text-primary-400" />
        </div>
        <h2 class="text-lg font-bold text-gray-900 mb-2">Wishlist Kosong</h2>
        <p class="text-gray-500 text-sm mb-6">Simpan produk favoritmu di sini!</p>
        <NuxtLink to="/products" class="inline-flex items-center px-7 py-3 bg-primary-700 text-white font-semibold rounded-xl hover:bg-primary-800 transition">
          Jelajahi Produk
        </NuxtLink>
      </div>

      <div v-else class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        <div v-for="item in wishlistStore.items" :key="item.sku_id" class="bg-white rounded-2xl shadow-card hover:shadow-card-hover transition-shadow overflow-hidden">
          <NuxtLink :to="`/products/${item.product_slug}`">
            <div class="aspect-square bg-cream-dark overflow-hidden">
              <img v-if="item.image" :src="item.image" :alt="item.product_name" class="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
              <div v-else class="w-full h-full flex items-center justify-center text-primary-300"><Shirt class="w-10 h-10" /></div>
            </div>
          </NuxtLink>
          <div class="p-3">
            <p class="text-[11px] text-gray-400">{{ item.category_name }}</p>
            <NuxtLink :to="`/products/${item.product_slug}`">
              <p class="text-sm font-semibold text-gray-900 line-clamp-2 mt-0.5 hover:text-primary-700">{{ item.product_name }}</p>
            </NuxtLink>
            <div class="flex items-center justify-between mt-2.5">
              <div>
                <span class="font-bold text-primary-700 text-sm">{{ formatRupiah(item.price) }}</span>
                <span v-if="item.discount_percentage > 0" class="ml-1 text-xs text-gray-400 line-through">{{ formatRupiah(item.original_price) }}</span>
              </div>
              <button @click="wishlistStore.removeFromWishlist(item.sku_id)" class="text-gray-300 hover:text-red-400 transition">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
            <button @click="addToCart(item)" :disabled="item.stock === 0"
              class="mt-2 w-full py-2 bg-primary-50 text-primary-700 font-semibold text-xs rounded-xl hover:bg-primary-100 disabled:opacity-50 transition">
              {{ item.stock === 0 ? 'Stok Habis' : 'Tambah ke Keranjang' }}
            </button>
          </div>
        </div>
      </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { Heart, Shirt } from 'lucide-vue-next'
import type { WishlistItem } from '~/types/api'
import { formatRupiah } from '~/utils/format'
definePageMeta({ middleware: 'auth' })
useSeoMeta({ title: 'Wishlist' })
const wishlistStore = useWishlistStore()
const cartStore = useCartStore()
const loading = ref(true)
onMounted(async () => { await wishlistStore.fetchWishlist(); loading.value = false })
async function addToCart(item: WishlistItem) { await cartStore.addToCart(item.sku_id, 1) }
</script>