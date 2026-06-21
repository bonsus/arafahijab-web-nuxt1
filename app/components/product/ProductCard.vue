<template>
  <NuxtLink :to="`/products/${product.slug}`" class="group bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all hover:-translate-y-0.5 duration-200">
    <!-- Thumbnail -->
    <div class="relative aspect-square overflow-hidden bg-cream-dark">
      <img
        v-if="product.thumbnail"
        :src="product.thumbnail"
        :alt="product.name"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        loading="lazy"
      />
      <div v-else class="w-full h-full flex items-center justify-center">
        <span class="text-5xl">🧕</span>
      </div>

      <!-- Out of stock overlay -->
      <div v-if="product.stock < 1" class="absolute inset-0 bg-white/60 flex items-center justify-center">
        <span class="bg-gray-800 text-white text-xs font-medium px-3 py-1 rounded-full uppercase tracking-wide opacity-70 shadow-sm">
          Stok Kosong
        </span>
      </div>

      <!-- Top badges -->
      <div class="absolute top-2 left-2 flex flex-col gap-1">
        <span
          v-if="badge"
          :class="[
            'text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide',
            badge === 'BEST SELLER' ? 'bg-amber-500 text-white' :
            badge === 'NEW ARRIVAL' ? 'bg-primary-600 text-white' :
            badge === 'BEST BUY' ? 'bg-emerald-500 text-white' :
            'bg-gray-700 text-white'
          ]"
        >
          {{ badge }}
        </span>
        <span v-if="product.promotion_discount" class="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
          -{{ product.discount_percentage }}%
        </span>
      </div>

      <!-- Promo badges: gratis ongkir & gratis produk -->
      <div v-if="product.free_shipping || product.free_product" class="absolute bottom-2 left-2 flex flex-wrap gap-1">
        <span v-if="product.free_shipping" class="bg-green-600 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full shadow-sm">
          Gratis Ongkir
        </span>
        <span v-if="product.free_product" class="bg-pink-600 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full shadow-sm">
          Gratis Produk
        </span>
      </div>
    </div>

    <!-- Info -->
    <div class="p-3">
      <p class="text-[11px] text-gray-400 mb-0.5">{{ product.category.name }}</p>
      <h3 class="text-sm font-medium text-gray-900 line-clamp-2 leading-snug mb-2">{{ product.name }}</h3>
      <div class="flex items-center gap-1.5 flex-wrap">
        <span class="font-bold text-primary-700 text-sm">{{ formatRupiah(product.price) }}</span>
        <span v-if="product.discount_percentage > 0" class="text-xs text-gray-400 line-through">
          {{ formatRupiah(product.original_price) }}
        </span>
      </div>
      <!-- Rating placeholder + sold -->
      <div class="mt-1.5 flex items-center gap-1">
        <span class="text-amber-400 text-xs">★</span>
        <span class="text-xs text-gray-500">{{ (4 + Math.random()).toFixed(1) }}</span>
        <span class="text-gray-300 text-xs">|</span>
        <span class="text-xs text-gray-400">{{ product.sold }} terjual</span>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { ProductListItem } from '~/types/api'
import { formatRupiah } from '~/utils/format'

defineProps<{ product: ProductListItem; badge?: string }>()
</script>
