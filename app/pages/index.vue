<template>
  <NuxtLayout name="default">

    <!-- ─── HERO ─────────────────────────────────────────── -->
    <section class="bg-gradient-to-b from-cream-dark to-cream overflow-hidden">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 min-h-[480px] lg:min-h-[560px] items-center gap-8">
          <!-- Text -->
          <div class="flex flex-col justify-center py-12 lg:py-16 pr-0 lg:pr-12 order-2 lg:order-1">
            <p class="inline-flex items-center gap-2 text-primary-700 text-xs font-semibold tracking-widest uppercase mb-4">
              <Sparkles class="w-4 h-4" /> Koleksi Terbaru 2026
            </p>
            <h1 class="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-4">
              Hijab Nyaman<br />
              <span class="text-primary-600">Untuk Aktivitas</span><br />
              Sehari-hari
            </h1>
            <p class="text-gray-500 text-base mb-8 max-w-md leading-relaxed">
              Koleksi pilihan bahan premium dengan warna elegan yang mudah dipadukan untuk setiap momen.
            </p>
            <!-- CTA -->
            <div class="flex items-center gap-3 flex-wrap mb-8">
              <NuxtLink to="/products" class="inline-flex items-center gap-2 px-7 py-3 bg-primary-700 text-white font-semibold rounded-xl hover:bg-primary-800 transition-colors shadow-sm">
                <ShoppingBag class="w-5 h-5" /> Belanja Sekarang
              </NuxtLink>
              <NuxtLink to="/products" class="inline-flex items-center gap-2 px-7 py-3 border border-primary-300 text-primary-700 font-semibold rounded-xl hover:bg-primary-50 transition-colors">
                Lihat Koleksi <ArrowRight class="w-4 h-4" />
              </NuxtLink>
            </div>
            <!-- Color Swatches -->
            <div class="flex items-center gap-2">
              <span class="text-xs text-gray-400 mr-1">Pilihan Warna:</span>
              <button v-for="c in heroColors" :key="c" :style="`background:${c}`" class="w-6 h-6 rounded-full border-2 border-white shadow-sm ring-1 ring-gray-200 hover:scale-110 transition-transform" />
            </div>
          </div>

          <!-- Hero Visual -->
          <div class="relative order-1 lg:order-2 flex items-center justify-center py-8 lg:py-0">
            <div class="relative w-full max-w-md aspect-square">
              <!-- Decorative background -->
              <div class="absolute inset-0 rounded-[3rem] bg-gradient-to-br from-primary-100 via-cream to-primary-50" />
              <div class="absolute -top-6 -right-6 w-40 h-40 rounded-full bg-primary-100 opacity-60 blur-2xl" />
              <div class="absolute -bottom-8 -left-6 w-48 h-48 rounded-full bg-primary-200 opacity-40 blur-2xl" />

              <!-- Center medallion -->
              <div class="absolute inset-0 flex items-center justify-center">
                <div class="w-44 h-44 rounded-full bg-white/70 backdrop-blur shadow-card-hover flex flex-col items-center justify-center text-center border border-white">
                  <Sparkles class="w-10 h-10 text-primary-600 mb-2" />
                  <p class="text-primary-700 font-bold text-sm leading-tight px-4">Premium Hijab<br />Collection</p>
                </div>
              </div>

              <!-- Floating pills -->
              <div class="absolute top-8 left-2 bg-white rounded-2xl shadow-card px-3 py-2 flex items-center gap-2">
                <span class="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center">
                  <Truck class="w-4 h-4 text-green-600" />
                </span>
                <div class="leading-tight">
                  <p class="text-[11px] font-bold text-gray-800">Gratis Ongkir</p>
                  <p class="text-[10px] text-gray-400">Min. belanja</p>
                </div>
              </div>
              <div class="absolute bottom-10 right-1 bg-white rounded-2xl shadow-card px-3 py-2 flex items-center gap-2">
                <span class="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center">
                  <Star class="w-4 h-4 text-amber-500 fill-amber-500" />
                </span>
                <div class="leading-tight">
                  <p class="text-[11px] font-bold text-gray-800">4.9 / 5.0</p>
                  <p class="text-[10px] text-gray-400">Ribuan ulasan</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ─── FEATURES STRIP ───────────────────────────────── -->
    <section class="bg-white border-y border-sand">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div v-for="feat in features" :key="feat.label" class="flex items-center gap-3 py-1">
            <span class="w-11 h-11 rounded-xl bg-primary-50 flex items-center justify-center flex-shrink-0">
              <component :is="feat.icon" class="w-5 h-5 text-primary-700" />
            </span>
            <div>
              <p class="text-xs font-semibold text-gray-800">{{ feat.label }}</p>
              <p class="text-[11px] text-gray-400">{{ feat.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ─── KATEGORI PILIHAN ──────────────────────────────── -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-xl font-bold text-gray-900">Kategori Pilihan</h2>
          <p class="text-sm text-gray-400 mt-0.5">Temukan produk sesuai kebutuhanmu</p>
        </div>
        <NuxtLink to="/products" class="inline-flex items-center gap-1 text-sm text-primary-600 font-medium hover:text-primary-700">
          Lihat Semua <ArrowRight class="w-4 h-4" />
        </NuxtLink>
      </div>

      <div v-if="pendingCategories" class="flex gap-4 overflow-hidden">
        <div v-for="i in 7" :key="i" class="flex-shrink-0 flex flex-col items-center gap-2">
          <div class="w-20 h-20 rounded-2xl bg-cream-dark animate-pulse" />
          <div class="w-14 h-3 rounded bg-cream-dark animate-pulse" />
        </div>
      </div>

      <div v-else class="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        <NuxtLink
          v-for="cat in categories"
          :key="cat.id"
          :to="`/categories/${cat.slug}`"
          class="flex-shrink-0 w-24 flex flex-col items-center gap-2 group"
        >
          <div class="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-50 to-primary-200 flex items-center justify-center group-hover:from-primary-100 group-hover:to-primary-300 group-hover:-translate-y-1 transition-all shadow-card">
            <component :is="categoryIcon(cat.slug)" class="w-8 h-8 text-primary-700" />
          </div>
          <span class="text-xs font-medium text-gray-700 group-hover:text-primary-700 text-center line-clamp-1 w-full">{{ cat.name }}</span>
          <span class="text-[10px] text-gray-400 -mt-1.5">{{ cat.product_count }} produk</span>
        </NuxtLink>
      </div>
    </section>

    <!-- ─── BEST SELLER ──────────────────────────────────── -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
      <div class="flex items-center justify-between mb-6">
        <h2 class="inline-flex items-center gap-2 text-xl font-bold text-gray-900">
          <Award class="w-5 h-5 text-amber-500" /> Best Seller
        </h2>
        <NuxtLink to="/products?sort_by=sold&sort_order=desc" class="inline-flex items-center gap-1 text-sm text-primary-600 font-medium hover:text-primary-700">
          Lihat Semua <ArrowRight class="w-4 h-4" />
        </NuxtLink>
      </div>

      <div v-if="pendingBestSeller" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        <div v-for="i in 5" :key="i" class="bg-white rounded-2xl aspect-[3/4] animate-pulse" />
      </div>
      <div v-else class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        <ProductCard v-for="p in bestSellers" :key="p.id" :product="p" badge="BEST SELLER" />
      </div>
    </section>

    <!-- ─── NEW ARRIVAL ──────────────────────────────────── -->
    <section class="bg-cream-dark py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between mb-6">
          <h2 class="inline-flex items-center gap-2 text-xl font-bold text-gray-900">
            <Sparkles class="w-5 h-5 text-primary-600" /> New Arrival
          </h2>
          <NuxtLink to="/products?sort_by=created_at&sort_order=desc" class="inline-flex items-center gap-1 text-sm text-primary-600 font-medium hover:text-primary-700">
            Lihat Semua <ArrowRight class="w-4 h-4" />
          </NuxtLink>
        </div>
        <div v-if="pendingNew" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          <div v-for="i in 5" :key="i" class="bg-white rounded-2xl aspect-[3/4] animate-pulse" />
        </div>
        <div v-else class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          <ProductCard v-for="p in newArrivals" :key="p.id" :product="p" badge="NEW ARRIVAL" />
        </div>
      </div>
    </section>

    <!-- ─── WARNA FAVORIT ────────────────────────────────── -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 class="text-xl font-bold text-gray-900 mb-1">Warna Favorit</h2>
      <p class="text-sm text-gray-400 mb-6">Pilih warna kesukaanmu</p>
      <div class="flex flex-wrap gap-4">
        <NuxtLink
          v-for="warna in warnaFavorit"
          :key="warna.nama"
          :to="`/products?search=${warna.nama.toLowerCase()}`"
          class="flex flex-col items-center gap-1.5 group"
        >
          <div
            class="w-14 h-14 rounded-full border-4 border-white shadow-md group-hover:scale-105 transition-transform ring-1 ring-gray-200"
            :style="`background:${warna.hex}`"
          />
          <span class="text-xs text-gray-600 group-hover:text-primary-700">{{ warna.nama }}</span>
        </NuxtLink>
      </div>
    </section>

    <!-- ─── JOIN MEMBER BANNER ───────────────────────────── -->
    <section class="bg-primary-700 text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <span class="inline-flex w-14 h-14 rounded-2xl bg-white/15 items-center justify-center mb-4">
          <Gift class="w-7 h-7" />
        </span>
        <h2 class="text-2xl lg:text-3xl font-bold mb-2">Join Member ArafaHijab</h2>
        <p class="text-primary-200 mb-6">Dapatkan voucher & promo eksklusif setiap minggu</p>
        <NuxtLink
          v-if="!isAuthenticated"
          to="/auth/register"
          class="inline-flex items-center gap-2 px-8 py-3 bg-white text-primary-700 font-semibold rounded-xl hover:bg-primary-50 transition-colors shadow-lg"
        >
          Daftar Sekarang <ArrowRight class="w-4 h-4" />
        </NuxtLink>
        <p v-else class="inline-flex items-center gap-2 text-primary-100 font-medium">
          <PartyPopper class="w-5 h-5" /> Selamat datang, {{ authStore.user?.name }}!
        </p>
      </div>
    </section>

  </NuxtLayout>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import {
  Sparkles, ShoppingBag, ArrowRight, Truck, Star, Award, Gift, PartyPopper,
  Scissors, BadgeCheck, Gem, Crown, Layers, Shirt, Smile,
} from 'lucide-vue-next'
import type { ProductListItem, FilterData, ProductCategory } from '~/types/api'

useSeoMeta({
  title: 'ArafaHijab - Hijab Premium untuk Muslimah Modern',
  ogTitle: 'ArafaHijab',
  description: 'Belanja hijab premium online. Koleksi terlengkap dengan harga terjangkau.',
  ogDescription: 'Belanja hijab premium online. Koleksi terlengkap dengan harga terjangkau.',
})

const authStore = useAuthStore()
const { isAuthenticated } = storeToRefs(authStore)

const heroColors = ['#FAE6CC','#D4B896','#B8977E','#8C6E58','#5C4030','#E8D5C4','#C2A68A','#9B7B66']

const features = [
  { icon: BadgeCheck, label: 'Bahan Premium', desc: 'Nyaman & Adem' },
  { icon: Scissors, label: 'Jahitan Rapi', desc: 'Rapi & Kuat' },
  { icon: Truck, label: 'Pengiriman Cepat', desc: 'Sampai 1-2 Hari' },
  { icon: Star, label: 'Ribuan Customer', desc: 'Puas & Repeat Order' },
]

// Map a category slug to a representative Lucide icon
function categoryIcon(slug: string) {
  const s = slug.toLowerCase()
  if (s.includes('aksesori')) return Gem
  if (s.includes('anak')) return Smile
  if (s.includes('khimar')) return Sparkles
  if (s.includes('dress') || s.includes('gamis') || s.includes('mukena')) return Crown
  if (s.includes('inner') || s.includes('ciput') || s.includes('bawahan')) return Layers
  return Shirt
}

const warnaFavorit = [
  { nama: 'Cream', hex: '#F5E6C8' },
  { nama: 'Latte', hex: '#C9A87C' },
  { nama: 'Dusty Pink', hex: '#E8B4A0' },
  { nama: 'Sage', hex: '#A8C5A0' },
  { nama: 'Navy', hex: '#2C3E6B' },
  { nama: 'Black', hex: '#1A1A1A' },
  { nama: 'Lilac', hex: '#C4A8D4' },
  { nama: 'Mocca', hex: '#7A5C3E' },
]

// Real categories from API
const { data: categories, pending: pendingCategories } = await useAsyncData<ProductCategory[]>(
  'home-categories',
  () => $fetch<{ message: string; data: FilterData }>('/api/data/filter', {
    headers: authStore.token ? { Authorization: `Bearer ${authStore.token}` } : {}
  }).then((r) => r.data.categories ?? []),
  { server: true },
)

const { data: bestSellers, pending: pendingBestSeller } = await useAsyncData<ProductListItem[]>(
  'home-bestseller',
  () =>
    $fetch<{ message: string; data: { data: { data: ProductListItem[] } } }>(
      '/api/products?per_page=5&sort_by=sold&sort_order=desc',
      { headers: authStore.token ? { Authorization: `Bearer ${authStore.token}` } : {} }
    ).then((r) => r.data.data.data),
  { server: true }
)

const { data: newArrivals, pending: pendingNew } = await useAsyncData<ProductListItem[]>(
  'home-newarrivals',
  () =>
    $fetch<{ message: string; data: { data: { data: ProductListItem[] } } }>(
      '/api/products?per_page=5&sort_by=created_at&sort_order=desc',
      { headers: authStore.token ? { Authorization: `Bearer ${authStore.token}` } : {} }
    ).then((r) => r.data.data.data),
  { server: true }
)
</script>