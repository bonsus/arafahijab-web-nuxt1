<template>
  <div
    class="flex gap-3 p-4 bg-white rounded-2xl border transition"
    :class="checked ? 'border-primary-300 bg-primary-50/30' : 'border-sand'"
  >
    <!-- Checkbox -->
    <div class="flex-shrink-0 pt-0.5">
      <button
        @click="$emit('toggle-check', item.id)"
        class="w-5 h-5 rounded-md border-2 flex items-center justify-center transition flex-shrink-0"
        :class="checked ? 'bg-primary-700 border-primary-700' : 'border-gray-300 bg-white hover:border-primary-400'"
      >
        <svg v-if="checked" xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
        </svg>
      </button>
    </div>

    <!-- Image -->
    <NuxtLink :to="`/products/${item.product_slug}`" class="flex-shrink-0">
      <div class="w-20 h-20 rounded-xl bg-cream overflow-hidden">
        <img v-if="item.image" :src="item.image" :alt="item.product_name" class="w-full h-full object-cover" />
        <div v-else class="w-full h-full flex items-center justify-center text-2xl">🧕</div>
      </div>
    </NuxtLink>

    <!-- Info -->
    <div class="flex-1 min-w-0">
      <NuxtLink :to="`/products/${item.product_slug}`">
        <h3 class="text-sm font-semibold text-gray-900 truncate hover:text-primary-700 transition">{{ item.product_name }}</h3>
      </NuxtLink>

      <!-- Variants -->
      <div v-if="item.variants?.length" class="flex flex-wrap gap-1.5 mt-1">
        <span
          v-for="v in item.variants"
          :key="v.name"
          class="inline-flex items-center gap-1 text-xs bg-sand/60 text-gray-600 rounded-full px-2 py-0.5"
        >
          <span class="text-gray-400">{{ v.name }}:</span>
          <span class="font-medium">{{ v.value }}</span>
        </span>
      </div>

      <!-- Price -->
      <div class="flex items-baseline gap-2 mt-1.5">
        <p class="text-sm font-bold text-primary-700">{{ formatRupiah(item.price) }}</p>
        <p v-if="item.original_price && item.original_price !== item.price" class="text-xs text-gray-400 line-through">
          {{ formatRupiah(item.original_price) }}
        </p>
      </div>

      <!-- Free product promo -->
      <div
        v-if="item.promotion_free_product?.free_items?.length"
        class="mt-2 bg-pink-50 border border-pink-100 rounded-xl p-2"
      >
        <p class="text-[11px] font-semibold text-pink-700 flex items-center gap-1">
          <span>🎁</span> {{ item.promotion_free_product.name }}
        </p>
        <div
          v-for="freeItem in item.promotion_free_product.free_items"
          :key="freeItem.id"
          class="flex items-center gap-2 mt-1.5"
        >
          <div class="w-8 h-8 rounded-lg bg-white border border-pink-100 overflow-hidden flex-shrink-0">
            <img v-if="freeItem.image" :src="freeItem.image" :alt="freeItem.product_name" class="w-full h-full object-cover" />
            <div v-else class="w-full h-full flex items-center justify-center text-sm">🧕</div>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-[11px] font-medium text-gray-700 truncate">{{ freeItem.product_name }}</p>
            <p v-if="freeItem.variants?.length" class="text-[10px] text-gray-400 truncate">
              {{ freeItem.variants.map(v => v.value).join(', ') }}
            </p>
          </div>
          <span class="text-[10px] font-semibold text-pink-600 flex-shrink-0">
            +{{ freeQty(freeItem) }} Gratis
          </span>
        </div>
      </div>

      <div class="flex items-center justify-between mt-2.5">
        <!-- Qty controls -->
        <div class="flex items-center gap-2">
          <button
            @click="$emit('update-qty', item.id, Math.max(1, item.qty - 1))"
            :disabled="item.qty <= 1"
            class="w-7 h-7 rounded-lg border border-sand flex items-center justify-center text-gray-600 hover:bg-primary-50 hover:border-primary-300 hover:text-primary-700 transition disabled:opacity-30"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M20 12H4" />
            </svg>
          </button>
          <span class="w-8 text-center text-sm font-semibold text-gray-800">{{ item.qty }}</span>
          <button
            @click="$emit('update-qty', item.id, item.qty + 1)"
            :disabled="item.qty >= item.stock"
            class="w-7 h-7 rounded-lg border border-sand flex items-center justify-center text-gray-600 hover:bg-primary-50 hover:border-primary-300 hover:text-primary-700 transition disabled:opacity-30"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
        <!-- Subtotal + Remove -->
        <div class="flex items-center gap-3">
          <span class="text-sm font-semibold text-gray-700">{{ formatRupiah(item.subtotal) }}</span>
          <button @click="$emit('remove', item.id)" class="text-xs text-red-400 hover:text-red-600 transition flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Hapus
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CartItem, FreeItem } from '~/types/api'

const props = defineProps<{ item: CartItem; checked: boolean }>()
defineEmits<{
  'toggle-check': [id: string]
  'update-qty': [id: string, qty: number]
  remove: [id: string]
}>()

const { formatRupiah } = useFormatters()

function freeQty(freeItem: FreeItem): number {
  const base = props.item.promotion_free_product?.is_multiple
    ? freeItem.qty * props.item.qty
    : freeItem.qty
  return freeItem.max_qty ? Math.min(base, freeItem.max_qty) : base
}
</script>
