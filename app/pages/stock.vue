<template>
  <NuxtLayout name="default">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

      <!-- Header -->
      <div class="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Stok Produk</h1>
          <p v-if="result" class="text-sm text-gray-400 mt-0.5">{{ result.total }} produk</p>
        </div>
      </div>

      <!-- Filters + Sort -->
      <div class="bg-white rounded-2xl shadow-card p-4 mb-5 flex flex-wrap items-center gap-3">
        <!-- Search -->
        <div class="relative flex-1 min-w-[180px]">
          <input
            v-model="search"
            type="text"
            placeholder="Cari produk..."
            class="w-full border border-sand rounded-xl pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 bg-cream"
          />
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <!-- Category -->
        <select
          v-model="categoryId"
          class="border border-sand rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 bg-cream"
        >
          <option value="">Semua Kategori</option>
          <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
        </select>

        <!-- Sort -->
        <select
          :value="`${sortBy}:${sortOrder}`"
          @change="onSortChange(($event.target as HTMLSelectElement).value)"
          class="border border-sand rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 bg-cream"
        >
          <option value="created_at:desc">Terbaru</option>
          <option value="name:asc">Nama A–Z</option>
          <option value="name:desc">Nama Z–A</option>
          <option value="price:asc">Harga ↑</option>
          <option value="price:desc">Harga ↓</option>
        </select>

        <!-- Stock status (client-side, current page) -->
        <select
          v-model="stockFilter"
          class="border border-sand rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 bg-cream"
        >
          <option value="">Semua Stok</option>
          <option value="in">Tersedia</option>
          <option value="low">Menipis (&lt;10)</option>
          <option value="out">Habis</option>
        </select>

        <button
          v-if="hasActiveFilters"
          @click="resetFilters"
          class="text-xs text-gray-500 hover:text-primary-700 underline"
        >
          Reset
        </button>
      </div>

      <LoadingSpinner v-if="isInitialLoading" />

      <div v-else-if="!items.length" class="text-center py-20">
        <div class="text-6xl mb-4">📦</div>
        <p class="text-gray-500 text-lg font-medium">Produk tidak ditemukan</p>
      </div>

      <div v-else-if="!visibleProducts.length" class="text-center py-20">
        <div class="text-6xl mb-4">📦</div>
        <p class="text-gray-500 text-lg font-medium">Tidak ada produk sesuai filter stok</p>
      </div>

      <div v-else class="space-y-3">
        <!-- Product rows -->
        <div
          v-for="product in visibleProducts"
          :key="product.id"
          class="bg-white rounded-2xl shadow-card overflow-hidden"
        >
          <!-- Product header (clickable to expand) -->
          <button
            type="button"
            @click="toggle(product.slug)"
            class="w-full flex items-center gap-3 p-4 text-left hover:bg-cream/50 transition"
          >
            <div class="w-14 h-14 rounded-xl bg-cream overflow-hidden flex-shrink-0">
              <img v-if="product.thumbnail" :src="product.thumbnail" :alt="product.name" class="w-full h-full object-cover" />
              <div v-else class="w-full h-full flex items-center justify-center text-xl">🧕</div>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-semibold text-gray-900 line-clamp-1">{{ product.name }}</p>
              <p class="text-xs text-gray-400 mt-0.5">{{ product.category.name }}</p>
            </div>
            <div class="text-right flex-shrink-0">
              <span
                :class="[
                  'text-xs font-bold px-2.5 py-1 rounded-full',
                  product.stock < 1 ? 'bg-red-100 text-red-600' : product.stock < 10 ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700',
                ]"
              >
                Total {{ product.stock }}
              </span>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 text-gray-400 flex-shrink-0 transition-transform"
              :class="{ 'rotate-180': expanded === product.slug }"
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <!-- Expanded SKU list -->
          <div v-if="expanded === product.slug" class="border-t border-sand">
            <div v-if="loadingSkus" class="py-6 text-center text-sm text-gray-400">Memuat varian...</div>
            <div v-else-if="!skus.length" class="py-6 text-center text-sm text-gray-400">Tidak ada varian.</div>
            <table v-else class="w-full text-sm">
              <thead>
                <tr class="text-left text-xs text-gray-400 bg-cream/40">
                  <th class="font-medium px-4 py-2">SKU</th>
                  <th class="font-medium px-4 py-2">Varian</th>
                  <th class="font-medium px-4 py-2 text-right">Harga</th>
                  <th class="font-medium px-4 py-2 text-right">Stok</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="sku in skus"
                  :key="sku.id"
                  class="border-t border-sand/60"
                >
                  <td class="px-4 py-2.5 font-mono text-xs text-gray-500">{{ sku.sku }}</td>
                  <td class="px-4 py-2.5">
                    <span v-if="sku.variants?.length" class="text-gray-700">
                      {{ sku.variants.map(v => `${v.name}: ${v.value}`).join(' · ') }}
                    </span>
                    <span v-else class="text-gray-300">—</span>
                  </td>
                  <td class="px-4 py-2.5 text-right text-gray-700">{{ formatRupiah(sku.price) }}</td>
                  <td class="px-4 py-2.5 text-right">
                    <span
                      :class="[
                        'font-semibold',
                        sku.stock < 1 ? 'text-red-500' : sku.stock < 10 ? 'text-amber-600' : 'text-green-600',
                      ]"
                    >
                      {{ sku.stock }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Infinite scroll sentinel + loader -->
        <div ref="sentinel" class="h-px" />
        <div v-if="isLoadingMore" class="flex justify-center py-6">
          <LoadingSpinner />
        </div>
        <p v-else-if="!hasMore" class="text-center text-sm text-gray-400 py-4">
          Semua produk telah ditampilkan
        </p>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import type { PaginatedData, ProductListItem, Sku, FilterData, ProductCategory } from '~/types/api'
import { formatRupiah } from '~/utils/format'
import LoadingSpinner from '~/components/ui/LoadingSpinner.vue'

useSeoMeta({ title: 'Stok Produk' })

const search = ref('')
const categoryId = ref('')
const sortBy = ref('created_at')
const sortOrder = ref('desc')
const stockFilter = ref<'' | 'in' | 'low' | 'out'>('')
const page = ref(1)

const debouncedSearch = ref('')
let searchTimer: ReturnType<typeof setTimeout> | undefined
watch(search, (val) => {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    debouncedSearch.value = val
    page.value = 1
  }, 350)
})

// Reset to page 1 when filters change
watch([categoryId, sortBy, sortOrder], () => { page.value = 1 })

const hasActiveFilters = computed(() =>
  !!search.value || !!categoryId.value || !!stockFilter.value ||
  sortBy.value !== 'created_at' || sortOrder.value !== 'desc'
)

function onSortChange(val: string) {
  const [by, order] = val.split(':')
  sortBy.value = by ?? 'created_at'
  sortOrder.value = order ?? 'desc'
}

function resetFilters() {
  search.value = ''
  debouncedSearch.value = ''
  categoryId.value = ''
  sortBy.value = 'created_at'
  sortOrder.value = 'desc'
  stockFilter.value = ''
  page.value = 1
}

// ─── Categories for filter ────────────────────────────────────────────────────
const { data: filterData } = await useAsyncData<FilterData>(
  'stock-filter-data',
  () => $fetch<{ message: string; data: FilterData }>('/api/data/filter').then((r) => r.data),
  { server: true }
)
const categories = computed<ProductCategory[]>(() => filterData.value?.categories ?? [])

// ─── Products ─────────────────────────────────────────────────────────────────
const queryKey = computed(() =>
  [debouncedSearch.value, categoryId.value, sortBy.value, sortOrder.value, page.value].join('|')
)

const { data: result, pending } = await useAsyncData<PaginatedData<ProductListItem>>(
  () => `stock-${queryKey.value}`,
  () => {
    const params = new URLSearchParams()
    if (debouncedSearch.value) params.set('search', debouncedSearch.value)
    if (categoryId.value) params.set('category_id', categoryId.value)
    params.set('sort_by', sortBy.value)
    params.set('sort_order', sortOrder.value)
    params.set('page', String(page.value))
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

const hasMore = computed(() => !!result.value && page.value < result.value.total_page)
const isInitialLoading = computed(() => pending.value && items.value.length === 0)
const isLoadingMore = computed(() => pending.value && items.value.length > 0)

const { sentinel } = useInfiniteScroll(
  () => { if (hasMore.value && !pending.value) page.value += 1 },
  () => hasMore.value && !pending.value,
)

// Client-side stock-status filter (applies to loaded products)
const visibleProducts = computed<ProductListItem[]>(() => {
  const list = items.value
  switch (stockFilter.value) {
    case 'in': return list.filter((p) => p.stock >= 1)
    case 'low': return list.filter((p) => p.stock >= 1 && p.stock < 10)
    case 'out': return list.filter((p) => p.stock < 1)
    default: return list
  }
})

// ─── Expand / SKU loading ─────────────────────────────────────────────────────
const expanded = ref<string | null>(null)
const skus = ref<Sku[]>([])
const loadingSkus = ref(false)

async function toggle(slug: string) {
  if (expanded.value === slug) {
    expanded.value = null
    return
  }
  expanded.value = slug
  skus.value = []
  loadingSkus.value = true
  try {
    const res = await $fetch<{ message: string; data: { skus: Sku[] } }>(
      `/api/products/${slug}/skus`
    )
    skus.value = res.data.skus ?? []
  } finally {
    loadingSkus.value = false
  }
}
</script>
