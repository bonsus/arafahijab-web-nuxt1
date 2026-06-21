<template>
  <div class="space-y-6">
    <!-- Categories -->
    <div>
      <h3 class="text-sm font-bold text-gray-800 mb-3 uppercase tracking-wide">Kategori</h3>
      <div class="space-y-1">
        <NuxtLink
          to="/products"
          class="w-full text-left text-sm py-1.5 transition block hover:text-primary-700 text-gray-600"
          active-class="!text-primary-700 font-semibold"
          exact
        >
          Semua Produk
        </NuxtLink>
        <NuxtLink
          v-for="cat in visibleCategories"
          :key="cat.id"
          :to="`/categories/${cat.slug}`"
          class="w-full text-left text-sm py-1.5 transition block hover:text-primary-700 pl-3 text-gray-600"
          active-class="!text-primary-700 font-semibold"
        >
          {{ cat.name }}
        </NuxtLink>
        <button
          v-if="categories.length > CATEGORY_LIMIT"
          @click="showAllCategories = !showAllCategories"
          class="text-xs font-medium text-primary-700 hover:text-primary-800 pl-3 pt-1 flex items-center gap-1"
        >
          {{ showAllCategories ? 'Sembunyikan' : `Tampilkan semua (${categories.length})` }}
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 transition-transform" :class="{ 'rotate-180': showAllCategories }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Price Range -->
    <div>
      <h3 class="text-sm font-bold text-gray-800 mb-3 uppercase tracking-wide">Harga</h3>
      <div class="space-y-2">
        <div class="relative">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">Rp</span>
          <input
            type="number"
            placeholder="Min"
            v-model="localPriceMin"
            class="w-full pl-8 pr-3 py-2 text-sm bg-cream border border-sand rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 focus:bg-white transition"
          />
        </div>
        <div class="relative">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">Rp</span>
          <input
            type="number"
            placeholder="Max"
            v-model="localPriceMax"
            class="w-full pl-8 pr-3 py-2 text-sm bg-cream border border-sand rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 focus:bg-white transition"
          />
        </div>
        <button
          @click="applyPrice"
          class="w-full py-2 bg-primary-700 text-white text-sm font-medium rounded-xl hover:bg-primary-800 transition"
        >
          Terapkan Harga
        </button>
      </div>
    </div>

    <!-- Promo & Shipping toggles -->
    <div class="space-y-2">
      <label class="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" :checked="modelValue.promotion_discount" @change="set('promotion_discount', ($event.target as HTMLInputElement).checked)" class="accent-primary-700 w-4 h-4 rounded" />
        <span class="text-sm text-gray-700">Sedang Promo</span>
      </label>
      <label class="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" :checked="modelValue.free_shipping" @change="set('free_shipping', ($event.target as HTMLInputElement).checked)" class="accent-primary-700 w-4 h-4 rounded" />
        <span class="text-sm text-gray-700">Gratis Ongkir</span>
      </label>
    </div>

    <!-- Clear -->
    <button @click="resetAll" class="w-full text-sm text-gray-500 hover:text-red-500 py-2 border border-sand rounded-xl transition">
      Hapus Filter
    </button>
  </div>
</template>

<script setup lang="ts">
import type { ProductCategory } from '~/types/api'

const props = defineProps<{
  modelValue: Record<string, any>
  categories: ProductCategory[]
}>()
const emit = defineEmits<{ 'update:modelValue': [v: Record<string, any>] }>()

// Show only first 5 categories by default, toggle to reveal all
const CATEGORY_LIMIT = 5
const showAllCategories = ref(false)
const visibleCategories = computed(() =>
  showAllCategories.value ? props.categories : props.categories.slice(0, CATEGORY_LIMIT)
)

// Local state for price inputs — only applied on button click
const localPriceMin = ref(props.modelValue.price_min ?? '')
const localPriceMax = ref(props.modelValue.price_max ?? '')

// Keep local state in sync if parent resets filters
watch(() => props.modelValue.price_min, (v) => { localPriceMin.value = v ?? '' })
watch(() => props.modelValue.price_max, (v) => { localPriceMax.value = v ?? '' })

function applyPrice() {
  emit('update:modelValue', {
    ...props.modelValue,
    price_min: localPriceMin.value,
    price_max: localPriceMax.value,
    page: 1,
  })
}

function set(key: string, value: any) {
  emit('update:modelValue', { ...props.modelValue, [key]: value, page: 1 })
}

function resetAll() {
  localPriceMin.value = ''
  localPriceMax.value = ''
  emit('update:modelValue', {
    ...props.modelValue,
    price_min: '',
    price_max: '',
    free_shipping: false,
    promotion_discount: false,
    page: 1,
  })
}
</script>
