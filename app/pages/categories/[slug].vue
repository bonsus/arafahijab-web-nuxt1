<template>
  <NuxtLayout name="default">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

      <!-- Breadcrumb -->
      <nav class="text-xs text-gray-400 mb-5 flex items-center gap-1">
        <NuxtLink to="/" class="hover:text-primary-600">Beranda</NuxtLink>
        <span>/</span>
        <NuxtLink to="/products" class="hover:text-primary-600">Produk</NuxtLink>
        <span>/</span>
        <span class="text-gray-600">{{ categoryName }}</span>
      </nav>

      <!-- Page header -->
      <div class="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">{{ categoryName }}</h1>
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
        <!-- Desktop Sidebar: sub-categories + price filter -->
        <aside class="hidden lg:block w-56 flex-shrink-0">
          <div class="bg-white rounded-2xl shadow-card p-5 sticky top-24 space-y-5">

            <!-- All categories nav -->
            <div>
              <h3 class="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Kategori</h3>
              <div class="space-y-1">
                <NuxtLink
                  to="/products"
                  class="w-full text-left text-sm py-1.5 transition block hover:text-primary-700 text-gray-600"
                >
                  Semua Produk
                </NuxtLink>
                <NuxtLink
                  v-for="cat in filterData?.categories ?? []"
                  :key="cat.id"
                  :to="`/categories/${cat.slug}`"
                  class="w-full text-left text-sm py-1.5 transition block pl-3 text-gray-600 hover:text-primary-700"
                  :class="cat.slug === slug ? 'text-primary-700 font-semibold' : ''"
                >
                  {{ cat.name }}
                </NuxtLink>
              </div>
            </div>

            <!-- Sub-categories of current category -->
            <div v-if="subCategories.length">
              <h3 class="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Sub Kategori</h3>
              <div class="space-y-1">
                <button
                  @click="filters.sub_category_slug = ''"
                  :class="!filters.sub_category_slug ? 'text-primary-700 font-semibold' : 'text-gray-600 hover:text-primary-700'"
                  class="w-full text-left text-sm py-1.5 transition"
                >
                  Semua
                </button>
                <button
                  v-for="sub in subCategories"
                  :key="sub.slug"
                  @click="filters.sub_category_slug = sub.slug; filters.page = 1"
                  :class="filters.sub_category_slug === sub.slug ? 'text-primary-700 font-semibold' : 'text-gray-600 hover:text-primary-700'"
                  class="w-full text-left text-sm py-1.5 transition pl-3"
                >
                  {{ sub.name }}
                </button>
              </div>
            </div>

            <!-- Price range -->
            <div>
              <h3 class="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Harga</h3>
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
                <button @click="applyPrice" class="w-full py-2 bg-primary-700 text-white text-sm font-medium rounded-xl hover:bg-primary-800 transition">
                  Terapkan Harga
                </button>
              </div>
            </div>

            <!-- Toggles -->
            <div class="space-y-2">
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" v-model="filters.promotion_discount" class="accent-primary-700 w-4 h-4 rounded" />
                <span class="text-sm text-gray-700">Sedang Promo</span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" v-model="filters.free_shipping" class="accent-primary-700 w-4 h-4 rounded" />
                <span class="text-sm text-gray-700">Gratis Ongkir</span>
              </label>
            </div>

            <button @click="resetFilters" class="w-full text-sm text-gray-500 hover:text-red-500 py-2 border border-sand rounded-xl transition">
              Hapus Filter
            </button>
          </div>
        </aside>

        <!-- Product Grid -->
        <div class="flex-1 min-w-0">
          <!-- Loading -->
          <div v-if="isInitialLoading" class="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
            <div v-for="i in 12" :key="i" class="bg-white rounded-2xl aspect-[3/4] animate-pulse shadow-card" />
          </div>

          <!-- Empty -->
          <div v-else-if="!items.length" class="text-center py-20">
            <div class="w-20 h-20 rounded-full bg-cream-dark flex items-center justify-center mx-auto mb-4">
              <SearchX class="w-9 h-9 text-primary-400" />
            </div>
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

            <!-- Sub-categories mobile -->
            <div v-if="subCategories.length" class="mb-5">
              <h4 class="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Sub Kategori</h4>
              <div class="flex flex-wrap gap-2">
                <button
                  @click="filters.sub_category_slug = ''; filters.page = 1"
                  :class="!filters.sub_category_slug ? 'bg-primary-700 text-white' : 'bg-cream text-gray-600'"
                  class="px-3 py-1.5 rounded-full text-sm font-medium transition"
                >
                  Semua
                </button>
                <button
                  v-for="sub in subCategories"
                  :key="sub.slug"
                  @click="filters.sub_category_slug = sub.slug; filters.page = 1"
                  :class="filters.sub_category_slug === sub.slug ? 'bg-primary-700 text-white' : 'bg-cream text-gray-600'"
                  class="px-3 py-1.5 rounded-full text-sm font-medium transition"
                >
                  {{ sub.name }}
                </button>
              </div>
            </div>

            <!-- Price mobile -->
            <div class="mb-5">
              <h4 class="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Harga</h4>
              <div class="flex gap-2 mb-2">
                <input type="number" placeholder="Min" v-model="localPriceMin" class="flex-1 bg-cream border border-sand rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400" />
                <input type="number" placeholder="Max" v-model="localPriceMax" class="flex-1 bg-cream border border-sand rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400" />
              </div>
              <button @click="applyPrice" class="w-full py-2 bg-primary-700 text-white text-sm font-medium rounded-xl hover:bg-primary-800 transition">
                Terapkan Harga
              </button>
            </div>

            <div class="space-y-2 mb-5">
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" v-model="filters.promotion_discount" class="accent-primary-700 w-4 h-4" />
                <span class="text-sm text-gray-700">Sedang Promo</span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" v-model="filters.free_shipping" class="accent-primary-700 w-4 h-4" />
                <span class="text-sm text-gray-700">Gratis Ongkir</span>
              </label>
            </div>

            <button @click="showMobileFilter = false" class="w-full py-3 bg-primary-700 text-white font-semibold rounded-xl hover:bg-primary-800 transition">
              Terapkan Filter
            </button>
          </div>
        </div>
      </transition>
    </Teleport>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { SearchX } from 'lucide-vue-next'
import type { PaginatedData, ProductListItem, FilterData, ProductCategory } from '~/types/api'
import LoadingSpinner from '~/components/ui/LoadingSpinner.vue'

const route = useRoute()
const router = useRouter()
const slug = computed(() => route.params.slug as string)
const showMobileFilter = ref(false)

// Load categories to find current + sub-categories
const { data: filterData } = await useAsyncData<FilterData>(
  'filter-data-category',
  () => $fetch<{ message: string; data: FilterData }>('/api/data/filter').then((r) => r.data),
  { server: true }
)

const currentCategory = computed<ProductCategory | undefined>(() =>
  filterData.value?.categories.find((c) => c.slug === slug.value) ??
  filterData.value?.categories.flatMap((c) => c.children ?? []).find((c) => c.slug === slug.value)
)
const categoryName = computed(() => currentCategory.value?.name ?? slug.value)
const subCategories = computed<ProductCategory[]>(() => currentCategory.value?.children ?? [])

useSeoMeta({
  title: computed(() => `${categoryName.value} | ArafaHijab`),
  description: computed(() => `Belanja ${categoryName.value} premium di ArafaHijab. Kualitas terbaik, harga terjangkau.`),
})

interface FilterState {
  sub_category_slug: string
  price_min: string
  price_max: string
  free_shipping: boolean
  promotion_discount: boolean
  sort_by: string
  sort_order: string
  page: number
}

const filters = reactive<FilterState>({
  sub_category_slug: (route.query.sub as string) || '',
  price_min: (route.query.price_min as string) || '',
  price_max: (route.query.price_max as string) || '',
  free_shipping: route.query.free_shipping === 'true',
  promotion_discount: route.query.promotion_discount === 'true',
  sort_by: (route.query.sort_by as string) || 'created_at',
  sort_order: (route.query.sort_order as string) || 'desc',
  page: Number(route.query.page) || 1,
})

// Local state for price inputs
const localPriceMin = ref(filters.price_min)
const localPriceMax = ref(filters.price_max)
watch(() => filters.price_min, (v) => { localPriceMin.value = v })
watch(() => filters.price_max, (v) => { localPriceMax.value = v })

function applyPrice() {
  filters.price_min = localPriceMin.value
  filters.price_max = localPriceMax.value
  filters.page = 1
}

// Sync filters to URL
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
  [slug.value, filters.sub_category_slug, filters.price_min, filters.price_max,
    filters.free_shipping, filters.promotion_discount, filters.sort_by,
    filters.sort_order, filters.page].join('|')
)

// Reset to first page whenever any non-page filter changes
const filterKey = computed(() =>
  [slug.value, filters.sub_category_slug, filters.price_min, filters.price_max,
    filters.free_shipping, filters.promotion_discount,
    filters.sort_by, filters.sort_order].join('|')
)
watch(filterKey, () => { filters.page = 1 })

const { data: result, pending } = await useAsyncData<PaginatedData<ProductListItem>>(
  () => `category-${queryKey.value}`,
  () => {
    const params = new URLSearchParams()
    // Use sub-category slug if selected, otherwise current category slug
    const categorySlug = filters.sub_category_slug || slug.value
    params.set('category_slug', categorySlug)
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
  localPriceMin.value = ''
  localPriceMax.value = ''
  Object.assign(filters, {
    sub_category_slug: '',
    price_min: '',
    price_max: '',
    free_shipping: false,
    promotion_discount: false,
    page: 1,
  })
}
</script>

<style>
.slide-up-enter-active, .slide-up-leave-active { transition: all .3s ease; }
.slide-up-enter-from, .slide-up-leave-to { transform: translateY(100%); opacity: 0; }
</style>
