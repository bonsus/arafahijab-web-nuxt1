<template>
  <NuxtLayout name="default">
    <div v-if="product" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

      <!-- Breadcrumb -->
      <nav class="text-xs text-gray-400 mb-5 flex items-center gap-1 flex-wrap">
        <NuxtLink to="/" class="hover:text-primary-600">Beranda</NuxtLink>
        <span>/</span>
        <NuxtLink to="/products" class="hover:text-primary-600">{{ product.category.parent_name || 'Produk' }}</NuxtLink>
        <span>/</span>
        <span class="text-gray-600 line-clamp-1">{{ product.name }}</span>
      </nav>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        <!-- ─── Gallery ─── -->
        <div class="lg:sticky lg:top-24 lg:self-start">
          <!-- Main image: swipe + arrows + dots -->
          <div
            ref="galleryRef"
            class="w-full max-h-[600px] aspect-[1/1] rounded-3xl overflow-hidden bg-white mb-3 relative select-none flex items-center justify-center border border-sand"
          >
            <img
              :src="activeImage"
              :alt="product.name"
              class="h-full w-auto object-contain transition-opacity duration-300"
            />
            <!-- Prev arrow -->
            <button
              v-if="activeImageIdx > 0"
              type="button"
              @click="activeImageIdx--"
              class="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 hover:bg-white shadow-sm flex items-center justify-center transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <!-- Next arrow -->
            <button
              v-if="activeImageIdx < allImages.length - 1"
              type="button"
              @click="activeImageIdx++"
              class="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 hover:bg-white shadow-sm flex items-center justify-center transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <!-- Dot indicators -->
            <div v-if="allImages.length > 1" class="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 pointer-events-none">
              <span
                v-for="(_, i) in allImages"
                :key="i"
                :class="['h-1.5 rounded-full bg-white transition-all', i === activeImageIdx ? 'w-4 opacity-100' : 'w-1.5 opacity-50']"
              />
            </div>
          </div>
          <!-- Thumbnail strip -->
          <div class="flex gap-2 overflow-x-auto pb-1">
            <button
              v-for="(img, idx) in allImages"
              :key="idx"
              @click="activeImageIdx = idx"
              :class="[
                'w-16 h-16 flex-shrink-0 rounded-2xl overflow-hidden border-2 transition',
                activeImageIdx === idx ? 'border-primary-500' : 'border-transparent ring-1 ring-sand hover:border-primary-300',
              ]"
            >
              <img :src="img" :alt="`${product.name} ${idx + 1}`" class="w-full h-full object-cover" />
            </button>
          </div>
        </div>

        <!-- ─── Product Info ─── -->
        <div>
          <p class="text-xs text-primary-600 font-semibold uppercase tracking-wider mb-1">{{ product.category.name }}</p>
          <h1 class="text-2xl font-bold text-gray-900 leading-snug mb-3">{{ product.name }}</h1>

          <!-- Rating row -->
          <div class="flex items-center gap-3 mb-4 flex-wrap">
            <div class="flex items-center gap-0.5">
              <span v-for="i in 5" :key="i" class="text-amber-400 text-sm">★</span>
            </div>
            <span class="text-sm text-gray-500">{{ product.sold }} terjual</span>
            <span class="text-gray-300">|</span>
            <!-- Stock status badge -->
            <template v-if="selectedSku">
              <span v-if="selectedSku.stock === 0" class="text-xs font-semibold bg-red-100 text-red-600 px-2.5 py-1 rounded-full">
                Stok Habis
              </span>
              <span v-else class="text-xs font-semibold bg-green-100 text-green-700 px-2.5 py-1 rounded-full">
                Stok Tersedia
              </span>
            </template>
            <template v-else>
              <span class="text-sm text-gray-400">Pilih varian</span>
            </template>
          </div>

          <!-- Price -->
          <div class="bg-cream rounded-2xl p-4 mb-5">
            <div class="flex items-baseline gap-3 flex-wrap">
              <span class="text-3xl font-bold text-primary-700">
                {{ formatRupiah(selectedSku?.price ?? product.prices.min) }}
              </span>
              <span v-if="(selectedSku?.discount_percentage ?? 0) > 0" class="text-gray-400 line-through text-lg">
                {{ formatRupiah(selectedSku?.original_price ?? product.original_prices.min) }}
              </span>
              <span v-if="(selectedSku?.discount_percentage ?? 0) > 0" class="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-lg">
                -{{ selectedSku?.discount_percentage }}%
              </span>
            </div>
            <p v-if="!selectedSku && product.prices.min !== product.prices.max" class="text-xs text-gray-400 mt-1">
              Harga mulai dari {{ formatRupiah(product.prices.min) }}
            </p>
          </div>

          <!-- Variant Selector (inline) -->
          <div v-if="product.variants?.length" class="space-y-3 mb-5">
            <div
              v-for="variant in product.variants"
              :key="variant.name"
              class="flex items-start gap-3"
            >
              <span class="text-sm font-semibold text-gray-700 w-20 flex-shrink-0 pt-1.5">
                {{ variant.name }}
              </span>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="option in variant.options"
                  :key="option"
                  type="button"
                  @click="pickOption(variant.name, option)"
                  :class="[
                    pickedVariants[variant.name] === option
                      ? 'border-primary-700 bg-primary-50 text-primary-700 ring-2 ring-primary-200 font-semibold'
                      : isSkuOutOfStock(variant.name, option)
                        ? 'border-sand text-gray-300 line-through cursor-default'
                        : 'border-sand text-gray-600 hover:border-primary-500 hover:bg-cream',
                  ]"
                  class="px-4 py-1.5 rounded-xl border text-sm transition"
                >
                  {{ option }}
                </button>
              </div>
            </div>
          </div>

          <!-- Badges row -->
          <div class="flex flex-wrap gap-2 mb-5">
            <span v-if="selectedSku?.free_shipping" class="bg-green-50 text-green-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-green-200">
              🚚 Gratis Ongkir
            </span>
            <span v-if="selectedSku?.promotion_discount" class="bg-orange-50 text-orange-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-orange-200">
              🔥 {{ selectedSku.promotion_discount.name }}
            </span>
            <span v-if="selectedSku?.free_product" class="bg-pink-50 text-pink-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-pink-200">
              🎁 Gratis Produk
            </span>
          </div>

          <!-- Free product promo info -->
          <div
            v-if="selectedSku?.promotion_free_product?.free_items?.length"
            class="bg-pink-50 border border-pink-200 rounded-2xl p-4 mb-5"
          >
            <div class="flex items-center gap-2 mb-3">
              <span class="text-lg">🎁</span>
              <div>
                <p class="text-sm font-bold text-pink-700">{{ selectedSku.promotion_free_product.name }}</p>
                <p class="text-[11px] text-pink-500">
                  Gratis produk hingga {{ formatDate(selectedSku.promotion_free_product.date_end) }}
                </p>
              </div>
            </div>
            <p class="text-xs font-medium text-gray-500 mb-2">
              {{ selectedSku.promotion_free_product.is_multiple
                ? 'Bonus berlaku kelipatan sesuai jumlah pembelian:'
                : 'Dapatkan produk gratis berikut:' }}
            </p>
            <div class="space-y-2">
              <NuxtLink
                v-for="freeItem in selectedSku.promotion_free_product.free_items"
                :key="freeItem.id"
                :to="`/products/${freeItem.product_slug}`"
                class="flex items-center gap-3 bg-white rounded-xl p-2.5 border border-pink-100 hover:border-pink-300 transition"
              >
                <img
                  v-if="freeItem.image"
                  :src="freeItem.image"
                  :alt="freeItem.product_name"
                  class="w-12 h-12 rounded-lg object-cover bg-cream flex-shrink-0"
                />
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-gray-800 line-clamp-1">{{ freeItem.product_name }}</p>
                  <p v-if="freeItem.variants?.length" class="text-[11px] text-gray-500 line-clamp-1">
                    {{ freeItem.variants.map(v => `${v.name}: ${v.value}`).join(' · ') }}
                  </p>
                  <p class="text-[11px] text-pink-500 mt-0.5">
                    <template v-if="selectedSku.promotion_free_product.is_multiple">
                      Gratis {{ freeItem.qty }} setiap kelipatan<span v-if="freeItem.max_qty"> · maks. {{ freeItem.max_qty }}</span>
                    </template>
                    <template v-else>
                      Gratis {{ freeItem.qty }}<span v-if="freeItem.max_qty"> · maks. {{ freeItem.max_qty }}</span>
                    </template>
                  </p>
                </div>
                <span class="text-xs font-semibold text-pink-600 flex-shrink-0">+{{ freeItem.qty }} Gratis</span>
              </NuxtLink>
            </div>
          </div>

          <!-- Qty + Actions -->
          <div class="space-y-3">
            <!-- Qty (hidden when out of stock) -->
            <div v-if="selectedSku && selectedSku.stock !== 0" class="flex items-center gap-3">
              <span class="text-sm text-gray-600 w-14">Jumlah</span>
              <div class="flex items-center border border-sand rounded-xl overflow-hidden">
                <button @click="qty = Math.max(1, qty - 1)" class="px-4 py-2.5 text-gray-500 hover:bg-cream transition text-lg leading-none">−</button>
                <span class="px-5 py-2.5 text-sm font-semibold min-w-[2.5rem] text-center">{{ qty }}</span>
                <button @click="qty = Math.min(99, qty + 1)" class="px-4 py-2.5 text-gray-500 hover:bg-cream transition text-lg leading-none">+</button>
              </div>
            </div>

            <!-- OUT OF STOCK state -->
            <template v-if="selectedSku && selectedSku.stock === 0">
              <div class="p-4 bg-red-50 border border-red-100 rounded-2xl text-center mb-2">
                <p class="text-sm font-semibold text-red-600 mb-0.5">Stok Habis</p>
                <p class="text-xs text-red-400">Varian ini sedang tidak tersedia</p>
              </div>
              <button
                v-if="isAuthenticated"
                @click="toggleWishlist"
                :disabled="togglingWishlist"
                class="w-full py-3.5 border-2 font-semibold rounded-xl transition"
                :class="isWishlisted
                  ? 'border-red-300 bg-red-50 text-red-500'
                  : 'border-primary-300 text-primary-700 hover:bg-primary-50'"
              >
                <span class="flex items-center justify-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" :fill="isWishlisted ? 'currentColor' : 'none'" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  {{ isWishlisted ? 'Tersimpan di Wishlist' : 'Simpan ke Wishlist' }}
                </span>
              </button>
              <NuxtLink v-else to="/auth/login" class="block w-full py-3.5 text-center border-2 border-primary-300 text-primary-700 font-semibold rounded-xl hover:bg-primary-50 transition">
                Masuk untuk Simpan ke Wishlist
              </NuxtLink>
            </template>

            <!-- IN STOCK state (or no variant selected yet) -->
            <template v-else>
              <div class="flex gap-3">
                <button
                  @click="handleAddToCart"
                  :disabled="addingToCart || !selectedSku"
                  class="flex-1 py-3.5 border-2 border-primary-600 text-primary-700 font-semibold rounded-xl hover:bg-primary-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  {{ addingToCart ? 'Menambahkan...' : 'Tambah Keranjang' }}
                </button>
                <button
                  @click="handleBuyNow"
                  :disabled="addingToCart || !selectedSku"
                  class="flex-1 py-3.5 bg-primary-700 text-white font-semibold rounded-xl hover:bg-primary-800 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  Beli Sekarang
                </button>
              </div>

              <!-- Wishlist toggle (in-stock) -->
              <button
                v-if="isAuthenticated && selectedSku"
                @click="toggleWishlist"
                :disabled="togglingWishlist"
                class="flex items-center gap-2 text-sm font-medium transition w-full justify-center py-1"
                :class="isWishlisted ? 'text-red-500' : 'text-gray-400 hover:text-red-400'"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" :fill="isWishlisted ? 'currentColor' : 'none'" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {{ isWishlisted ? 'Tersimpan di Wishlist' : 'Tambah ke Wishlist' }}
              </button>
            </template>

            <!-- Cart message -->
            <p v-if="cartMessage" :class="['text-sm font-medium text-center', cartMessage.type === 'error' ? 'text-red-600' : 'text-green-600']">
              {{ cartMessage.text }}
            </p>
          </div>
        </div>
      </div>

      <!-- ─── Tabs: Deskripsi / Ulasan / Pengiriman ─── -->
      <div class="bg-white rounded-3xl shadow-card overflow-hidden mb-10">
        <div class="flex border-b border-sand">
          <button
            v-for="tab in tabs"
            :key="tab"
            @click="activeTab = tab"
            :class="[
              'flex-1 sm:flex-none px-6 py-4 text-sm font-semibold transition border-b-2 -mb-px',
              activeTab === tab
                ? 'border-primary-600 text-primary-700'
                : 'border-transparent text-gray-500 hover:text-gray-700',
            ]"
          >
            {{ tab }}
          </button>
        </div>
        <div class="p-6">
          <div v-if="activeTab === 'Deskripsi'">
            <!-- <p class="text-sm text-gray-500 mb-3">{{ product.short_description }}</p> -->
            <div class="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
              <div v-html="product.description" />
            </div>
          </div>
          <div v-else-if="activeTab === 'Ulasan'" class="text-center py-8 text-gray-400">
            <div class="text-5xl mb-3">⭐</div>
            <p>Belum ada ulasan untuk produk ini.</p>
          </div>
          <div v-else-if="activeTab === 'Pengiriman'" class="text-sm text-gray-600 space-y-2">
            <p>Pengiriman tersedia ke seluruh Indonesia via JNE, J&T, SiCepat, dan kurir lainnya.</p>
            <p>Estimasi pengiriman 1–7 hari kerja tergantung lokasi tujuan.</p>
          </div>
        </div>
      </div>

      <!-- Related Products -->
      <div v-if="relatedProducts?.data?.length">
        <h2 class="text-xl font-bold text-gray-900 mb-5">Produk Terkait</h2>
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          <ProductCard v-for="p in relatedProducts.data" :key="p.id" :product="p" />
        </div>
      </div>
    </div>

    <LoadingSpinner v-else-if="pending" />

    <div v-else class="max-w-7xl mx-auto px-4 py-20 text-center">
      <p class="text-gray-500">Produk tidak ditemukan.</p>
      <NuxtLink to="/products" class="mt-3 inline-block text-primary-600 hover:underline">← Kembali</NuxtLink>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import type { ProductDetail, PaginatedData, ProductListItem, Sku } from '~/types/api'
import { formatRupiah, formatDate } from '~/utils/format'
import { storeToRefs } from 'pinia'

const route = useRoute()
const authStore = useAuthStore()
const cartStore = useCartStore()
const wishlistStore = useWishlistStore()
const { isAuthenticated } = storeToRefs(authStore)

const slug = computed(() => route.params.slug as string)
const tabs = ['Deskripsi', 'Ulasan', 'Pengiriman']
const activeTab = ref('Deskripsi')

const { data: product, error, pending } = await useAsyncData<ProductDetail>(
  () => `product-${slug.value}`,
  () =>
    $fetch<{ message: string; data: ProductDetail }>(
      `/api/products/${slug.value}`,
      { headers: authStore.token ? { Authorization: `Bearer ${authStore.token}` } : {} }
    ).then((r) => r.data),
  { watch: [slug], server: true }
)

if (error.value) throw createError({ statusCode: 404, statusMessage: 'Produk tidak ditemukan' })

const { data: relatedProducts } = await useAsyncData<PaginatedData<ProductListItem>>(
  () => `related-${slug.value}`,
  () =>
    $fetch<{ message: string; data: PaginatedData<ProductListItem> }>(
      `/api/products/${slug.value}/related?per_page=5`,
      { headers: authStore.token ? { Authorization: `Bearer ${authStore.token}` } : {} }
    ).then((r) => r.data),
  { server: true }
)

useSeoMeta({
  title: () => product.value?.name ?? 'Produk',
  description: () => product.value?.short_description ?? '',
  ogTitle: () => product.value?.name ?? '',
  ogDescription: () => product.value?.short_description ?? '',
  ogImage: () => product.value?.thumbnail ?? '',
  ogType: 'product',
})

const activeImageIdx = ref(0)
const allImages = computed(() => {
  if (!product.value) return []
  const seen = new Set<string>()
  const result: string[] = []
  for (const img of [product.value.thumbnail, ...(product.value.images ?? [])]) {
    if (img && !seen.has(img)) { seen.add(img); result.push(img) }
  }
  for (const sku of product.value.skus ?? []) {
    if (sku.image && !seen.has(sku.image)) { seen.add(sku.image); result.push(sku.image) }
  }
  return result
})
const activeImage = computed(() => allImages.value[activeImageIdx.value] ?? '')

const galleryRef = ref<HTMLElement | null>(null)
useSwipe(galleryRef, {
  onSwipeEnd(_e, direction) {
    if (direction === 'left') activeImageIdx.value = Math.min(allImages.value.length - 1, activeImageIdx.value + 1)
    else if (direction === 'right') activeImageIdx.value = Math.max(0, activeImageIdx.value - 1)
  },
})

// ─── Variant selection ────────────────────────────────────────────────────────
const pickedVariants = reactive<Record<string, string>>({})

// Auto-pick first available option per variant dimension when product loads
watchEffect(() => {
  const skus = product.value?.skus ?? []
  for (const variant of product.value?.variants ?? []) {
    if (pickedVariants[variant.name]) continue // already picked
    const first = variant.options.find((opt) => {
      const candidates = skus.filter((s) => s.variants.some((v) => v.name === variant.name && v.value === opt))
      return !(candidates.length > 0 && candidates.every((s) => s.stock === 0))
    })
    if (first) pickedVariants[variant.name] = first
  }
})

function isSkuOutOfStock(variantName: string, option: string): boolean {
  const skus = product.value?.skus ?? []
  const candidates = skus.filter((s) => s.variants.some((v) => v.name === variantName && v.value === option))
  return candidates.length > 0 && candidates.every((s) => s.stock === 0)
}

function pickOption(variantName: string, option: string) {
  if (isSkuOutOfStock(variantName, option)) return
  pickedVariants[variantName] = option
}

// Find the SKU matching all picked options
const selectedSku = computed<Sku | null>(() => {
  const skus = product.value?.skus ?? []
  const variants = product.value?.variants ?? []
  const keys = Object.keys(pickedVariants)
  if (keys.length < variants.length) return null
  return skus.find((sku) =>
    keys.every((name) => sku.variants.some((v) => v.name === name && v.value === pickedVariants[name]))
  ) ?? null
})

// Update gallery image when selected SKU has an image
watch(selectedSku, (sku) => {
  if (sku?.image) {
    const idx = allImages.value.indexOf(sku.image)
    if (idx !== -1) activeImageIdx.value = idx
  }
})

const qty = ref(1)

const addingToCart = ref(false)
const cartMessage = ref<{ type: 'success' | 'error'; text: string } | null>(null)

async function handleAddToCart() {
  if (!isAuthenticated.value) { navigateTo('/auth/login'); return }
  if (!selectedSku.value) {
    cartMessage.value = { type: 'error', text: 'Pilih varian terlebih dahulu' }; return
  }
  if (selectedSku.value.stock === 0) {
    cartMessage.value = { type: 'error', text: 'Stok habis' }; return
  }
  addingToCart.value = true
  try {
    await cartStore.addToCart(selectedSku.value.id, qty.value)
    cartMessage.value = { type: 'success', text: `${qty.value} item ditambahkan ke keranjang!` }
    setTimeout(() => { cartMessage.value = null }, 3000)
  } catch {
    cartMessage.value = { type: 'error', text: 'Gagal menambahkan ke keranjang.' }
  } finally {
    addingToCart.value = false
  }
}

async function handleBuyNow() {
  await handleAddToCart()
  if (cartMessage.value?.type !== 'error') navigateTo('/cart')
}

const togglingWishlist = ref(false)
const isWishlisted = computed(() =>
  selectedSku.value ? wishlistStore.isInWishlist(selectedSku.value.id) : false
)

onMounted(() => { if (isAuthenticated.value) wishlistStore.fetchWishlist() })

async function toggleWishlist() {
  if (!selectedSku.value) return
  togglingWishlist.value = true
  try {
    if (isWishlisted.value) await wishlistStore.removeFromWishlist(selectedSku.value.id)
    else await wishlistStore.addToWishlist(selectedSku.value.id)
  } finally {
    togglingWishlist.value = false
  }
}
</script>