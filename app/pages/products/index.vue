<template>
  <NuxtLayout name="default">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

      <!-- Breadcrumb -->
      <nav class="text-xs text-gray-400 mb-5 flex items-center gap-1">
        <NuxtLink to="/" class="hover:text-primary-600">Beranda</NuxtLink>
        <span>/</span>
        <span class="text-gray-600">Produk</span>
      </nav>

      <!-- Page header row -->
      <div class="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Semua Produk</h1>
          <p v-if="result" class="text-sm text-gray-400 mt-0.5">{{ result.total }} produk ditemukan</p>
        </div>

        <!-- Sort + mobile filter -->
        <div class="flex items-center gap-2">
          <select
            :value="`${filters.sort_by}:${filters.sort_order}`"
            @change="onSortChange(($event.target as HTMLSelectElement).value)"
            class="border border-sand rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 bg-white"
          >
            <option value="created_at:desc">Terbaru</option>
            <option value="price:asc">Harga ↑</option>
            <option value="price:desc">Harga ↓</option>
            <option value="name:asc">Nama A–Z</option>
          </select>
          <button
            @click="showMobileFilter = true"
            class="lg:hidden flex items-center gap-1.5 border border-sand rounded-xl px-3 py-2 text-sm bg-white text-gray-600 hover:border-primary-400 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
            </svg>
            Filter
          </button>
        </div>
      </div>

      <div class="flex gap-6">
        <!-- Desktop Filter Sidebar -->
        <aside class="hidden lg:block w-56 flex-shrink-0">
          <div class="bg-white rounded-2xl shadow-card p-5 sticky top-24">
            <ProductFilter
              :model-value="filters"
              @update:model-value="Object.assign(filters, $event)"
              :categories="filterData?.categories ?? []"
            />
          </div>
        </aside>

        <!-- Product Grid -->
        <div class="flex-1 min-w-0">
          <!-- Active filters chips -->
          <div v-if="hasActiveFilters" class="flex flex-wrap gap-2 mb-4">
            <span v-if="filters.search" class="inline-flex items-center gap-1 bg-primary-100 text-primary-700 text-xs font-medium px-3 py-1 rounded-full">
              "{{ filters.search }}"
              <button @click="filters.search = ''" class="hover:text-primary-900">✕</button>
            </span>
            <span v-if="filters.free_shipping" class="inline-flex items-center gap-1 bg-green-100 text-green-700 text-xs font-medium px-3 py-1 rounded-full">
              Gratis Ongkir <button @click="filters.free_shipping = false" class="hover:text-green-900">✕</button>
            </span>
            <span v-if="filters.promotion_discount" class="inline-flex items-center gap-1 bg-red-100 text-red-600 text-xs font-medium px-3 py-1 rounded-full">
              Sedang Promo <button @click="filters.promotion_discount = false" class="hover:text-red-800">✕</button>
            </span>
          </div>

          <!-- Loading skeleton -->
          <div v-if="isInitialLoading" class="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
            <div v-for="i in 12" :key="i" class="bg-white rounded-2xl aspect-[3/4] animate-pulse shadow-card" />
          </div>

          <!-- Empty -->
          <div v-else-if="!items.length" class="text-center py-20">
            <div class="text-6xl mb-4">🔍</div>
            <p class="text-gray-500 text-lg font-medium">Produk tidak ditemukan</p>
            <p class="text-gray-400 text-sm mt-1 mb-4">Coba ubah filter atau kata pencarian</p>
            <button @click="resetFilters" class="text-primary-600 text-sm hover:underline font-medium">Reset Filter</button>
          </div>

          <!-- Grid -->
          <template v-else>
            <div class="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
              <ProductCard v-for="product in items" :key="product.id" :product="product" />
            </div>

            <!-- Infinite scroll sentinel + loader -->
            <div ref="sentinel" class="h-px" />
            <div v-if="isLoadingMore" class="flex justify-center py-8">
              <LoadingSpinner />
            </div>
            <p v-else-if="!hasMore" class="text-center text-sm text-gray-400 py-8">
              Semua produk telah ditampilkan
            </p>
          </template>
        </div>
      </div>
    </div>

    <!-- Mobile Filter Drawer -->
    <Teleport to="body">
      <transition name="slide-up">
        <div v-if="showMobileFilter" class="fixed inset-0 z-50 flex items-end" @click.self="showMobileFilter = false">
          <div class="absolute inset-0 bg-black/40" @click="showMobileFilter = false" />
          <div class="relative bg-white w-full max-h-[85vh] overflow-y-auto rounded-t-3xl p-5 z-10">
            <div class="flex items-center justify-between mb-4">
              <h3 class="font-bold text-gray-900">Filter Produk</h3>
              <button @click="showMobileFilter = false" class="w-8 h-8 flex items-center justify-center rounded-full bg-cream text-gray-500">✕</button>
            </div>
            <ProductFilter
              :model-value="filters"
              @update:model-value="Object.assign(filters, $event)"
              :categories="filterData?.categories ?? []"
            />
            <button @click="showMobileFilter = false" class="mt-5 w-full py-3 bg-primary-700 text-white font-semibold rounded-xl hover:bg-primary-800 transition">
              Terapkan Filter
            </button>
          </div>
        </div>
      </transition>
    </Teleport>
  </NuxtLayout>
</template>

<script setup lang="ts">
import type { PaginatedData, ProductListItem, FilterData } from '~/types/api'
import LoadingSpinner from '~/components/ui/LoadingSpinner.vue'

useSeoMeta({
  title: 'Produk',
  description: 'Temukan koleksi hijab premium ArafaHijab. Filter berdasarkan kategori, warna, harga, dan promo.',
})

const route = useRoute()
const router = useRouter()
const showMobileFilter = ref(false)

interface FilterState {
  search: string
  price_min: string
  price_max: string
  free_shipping: boolean
  promotion_discount: boolean
  sort_by: string
  sort_order: string
  page: number
}

const filters = reactive<FilterState>({
  search: (route.query.search as string) || '',
  price_min: (route.query.price_min as string) || '',
  price_max: (route.query.price_max as string) || '',
  free_shipping: route.query.free_shipping === 'true',
  promotion_discount: route.query.promotion_discount === 'true',
  sort_by: (route.query.sort_by as string) || 'created_at',
  sort_order: (route.query.sort_order as string) || 'desc',
  page: Number(route.query.page) || 1,
})

const hasActiveFilters = computed(() =>
  !!filters.search || !!filters.price_min ||
  !!filters.price_max || filters.free_shipping || filters.promotion_discount
)

watch(filters, (val) => {
  router.replace({
    query: Object.fromEntries(
      Object.entries(val)
        .filter(([k]) => k !== 'page')
        .filter(([, v]) => v !== '' && v !== false && v !== 0)
    ) as Record<string, string>,
  })
})

const queryKey = computed(() =>
  [filters.search, filters.price_min, filters.price_max,
    filters.free_shipping, filters.promotion_discount, filters.sort_by,
    filters.sort_order, filters.page].join('|')
)

// Reset to first page whenever any non-page filter changes
const filterKey = computed(() =>
  [filters.search, filters.price_min, filters.price_max,
    filters.free_shipping, filters.promotion_discount,
    filters.sort_by, filters.sort_order].join('|')
)
watch(filterKey, () => { filters.page = 1 })

const { data: filterData } = await useAsyncData<FilterData>(
  'filter-data',
  () => $fetch<{ message: string; data: FilterData }>('/api/data/filter').then((r) => r.data),
  { server: true }
)

const { data: result, pending } = await useAsyncData<PaginatedData<ProductListItem>>(
  () => `products-${queryKey.value}`,
  () => {
    const params = new URLSearchParams()
    if (filters.search) params.set('search', filters.search)
    if (filters.price_min) params.set('price_min', filters.price_min)
    if (filters.price_max) params.set('price_max', filters.price_max)
    if (filters.free_shipping) params.set('free_shipping', 'true')
    if (filters.promotion_discount) params.set('promotion_discount', 'true')
    params.set('sort_by', filters.sort_by)
    params.set('sort_order', filters.sort_order)
    params.set('page', String(filters.page))
    params.set('per_page', '20')
    return $fetch<{ message: string; data: { data: PaginatedData<ProductListItem> } }>(
      `/api/products?${params}`
    ).then((r) => r.data.data)
  },
  { watch: [queryKey], server: true }
)

// ─── Infinite scroll accumulation ─────────────────────────────────────────────
const items = ref<ProductListItem[]>([])
watch(result, (val) => {
  if (!val) return
  if (val.page <= 1) {
    items.value = [...val.data]
  } else {
    const seen = new Set(items.value.map((p) => p.id))
    items.value.push(...val.data.filter((p) => !seen.has(p.id)))
  }
}, { immediate: true })

const hasMore = computed(() => !!result.value && filters.page < result.value.total_page)
const isInitialLoading = computed(() => pending.value && items.value.length === 0)
const isLoadingMore = computed(() => pending.value && items.value.length > 0)

const { sentinel } = useInfiniteScroll(
  () => { if (hasMore.value && !pending.value) filters.page += 1 },
  () => hasMore.value && !pending.value,
)

function onSortChange(val: string) {
  const [sort_by, sort_order] = val.split(':')
  Object.assign(filters, { sort_by, sort_order, page: 1 })
}

function resetFilters() {
  Object.assign(filters, {
    search: '', price_min: '', price_max: '',
    free_shipping: false, promotion_discount: false,
    sort_by: 'created_at', sort_order: 'desc', page: 1,
  })
}
</script>

<style>
.slide-up-enter-active, .slide-up-leave-active { transition: all .3s ease; }
.slide-up-enter-from, .slide-up-leave-to { transform: translateY(100%); opacity: 0; }
</style>