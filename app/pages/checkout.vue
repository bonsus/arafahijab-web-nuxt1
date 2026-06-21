<template>
  <NuxtLayout name="checkout">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Checkout</h1>

      <!-- Step indicator -->
      <div class="flex items-center gap-2 mb-7 overflow-x-auto pb-1">
        <div v-for="(step, i) in checkoutSteps" :key="step" class="flex items-center gap-2 flex-shrink-0">
          <div :class="['w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition',
            i === currentStep ? 'bg-primary-700 text-white' : i < currentStep ? 'bg-green-500 text-white' : 'bg-sand text-gray-400']">
            <span v-if="i < currentStep">✓</span>
            <span v-else>{{ i + 1 }}</span>
          </div>
          <span :class="['text-sm font-medium flex-shrink-0',
            i === currentStep ? 'text-primary-700' : i < currentStep ? 'text-green-600' : 'text-gray-400']">{{ step }}</span>
          <div v-if="i < checkoutSteps.length - 1" class="w-8 h-px bg-sand flex-shrink-0" />
        </div>
      </div>

      <!-- No selection guard (shown briefly while cart loads) -->
      <div v-if="!cartStore.hasSelection && !initLoading" class="text-center py-12">
        <p class="text-gray-500 mb-4">Tidak ada produk yang dipilih.</p>
        <NuxtLink to="/cart" class="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-700 text-white text-sm font-semibold rounded-xl hover:bg-primary-800 transition">
          ← Kembali ke Keranjang
        </NuxtLink>
      </div>

      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Left: Checkout Steps -->
        <div class="lg:col-span-2 space-y-4">

          <!-- Step 1: Address -->
          <div class="bg-white rounded-3xl shadow-card p-5">
            <div class="flex items-center justify-between gap-2 mb-4">
              <div class="flex items-center gap-2">
                <div class="w-6 h-6 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xs font-bold">1</div>
                <h2 class="font-bold text-gray-900">Alamat Pengiriman</h2>
              </div>
              <button
                v-if="selectedAddress"
                type="button"
                @click="showAddressModal = true"
                class="text-xs font-semibold text-primary-700 hover:text-primary-800 transition"
              >Ubah</button>
            </div>

            <!-- Selected address summary -->
            <button
              v-if="selectedAddress"
              type="button"
              @click="showAddressModal = true"
              class="w-full text-left rounded-2xl border border-sand p-4 hover:border-primary-300 transition"
            >
              <div class="flex items-center gap-2 flex-wrap">
                <span class="text-sm font-semibold text-gray-900">{{ selectedAddress.name }}</span>
                <span v-if="selectedAddress.primary" class="text-[10px] font-bold bg-primary-100 text-primary-700 px-1.5 py-0.5 rounded-full">Utama</span>
              </div>
              <p class="text-xs text-gray-500 mt-0.5">{{ selectedAddress.phone }}</p>
              <p class="text-xs text-gray-600 mt-1 leading-relaxed">
                {{ selectedAddress.address }}, {{ selectedAddress.district }}, {{ selectedAddress.city }}, {{ selectedAddress.province }} {{ selectedAddress.zipcode }}
              </p>
            </button>

            <!-- No address yet -->
            <button
              v-else
              type="button"
              @click="showAddressModal = true"
              :disabled="loadingAddresses"
              class="w-full flex items-center justify-center gap-2 py-3.5 border-2 border-dashed border-sand rounded-2xl text-sm font-medium text-gray-500 hover:border-primary-400 hover:text-primary-600 transition disabled:opacity-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              {{ loadingAddresses ? 'Memuat alamat...' : 'Pilih Alamat Pengiriman' }}
            </button>
          </div>

          <!-- Step 2: Shipping -->
          <div class="bg-white rounded-3xl shadow-card p-5">
            <div class="flex items-center justify-between gap-2 mb-4">
              <div class="flex items-center gap-2">
                <div class="w-6 h-6 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xs font-bold">2</div>
                <h2 class="font-bold text-gray-900">Pengiriman</h2>
              </div>
              <button
                v-if="selectedShipping"
                type="button"
                @click="showShippingModal = true"
                class="text-xs font-semibold text-primary-700 hover:text-primary-800 transition"
              >Ubah</button>
            </div>

            <!-- No address -->
            <p v-if="!selectedAddress" class="text-sm text-gray-400 py-4 text-center">
              Lengkapi alamat pengiriman terlebih dahulu.
            </p>

            <!-- Selected shipping summary -->
            <button
              v-else-if="selectedShipping"
              type="button"
              @click="showShippingModal = true"
              class="w-full text-left rounded-2xl border border-sand p-4 hover:border-primary-300 transition flex items-center gap-3"
            >
              <div class="flex-1 min-w-0">
                <p class="text-sm font-semibold text-gray-800">{{ selectedShipping.courierName }} – {{ selectedShipping.serviceName }}</p>
                <p class="text-xs text-gray-500 mt-0.5">Estimasi {{ selectedShipping.minDuration }}–{{ selectedShipping.maxDuration }} hari</p>
              </div>
              <span class="text-sm font-bold text-primary-700 flex-shrink-0">{{ formatRupiah(selectedShipping.price) }}</span>
            </button>

            <!-- Choose shipping -->
            <button
              v-else
              type="button"
              @click="showShippingModal = true"
              :disabled="loadingShipping"
              class="w-full flex items-center justify-center gap-2 py-3.5 border-2 border-dashed border-sand rounded-2xl text-sm font-medium text-gray-500 hover:border-primary-400 hover:text-primary-600 transition disabled:opacity-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              {{ loadingShipping ? 'Memuat kurir...' : 'Pilih Metode Pengiriman' }}
            </button>
          </div>

          <!-- Step 3: Payment -->
          <div class="bg-white rounded-3xl shadow-card p-5">
            <div class="flex items-center justify-between gap-2 mb-4">
              <div class="flex items-center gap-2">
                <div class="w-6 h-6 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xs font-bold">3</div>
                <h2 class="font-bold text-gray-900">Metode Pembayaran</h2>
              </div>
              <button
                v-if="selectedPayment"
                type="button"
                @click="showPaymentModal = true"
                class="text-xs font-semibold text-primary-700 hover:text-primary-800 transition"
              >Ubah</button>
            </div>

            <!-- Selected payment summary -->
            <button
              v-if="selectedPayment"
              type="button"
              @click="showPaymentModal = true"
              class="w-full text-left rounded-2xl border border-sand p-4 hover:border-primary-300 transition"
            >
              <p class="text-sm font-semibold text-gray-900">{{ selectedPayment.name }}</p>
              <p v-if="selectedPayment.description" class="text-xs text-gray-500 mt-0.5">{{ selectedPayment.description }}</p>
            </button>

            <!-- Choose payment -->
            <button
              v-else
              type="button"
              @click="showPaymentModal = true"
              :disabled="loadingPayments"
              class="w-full flex items-center justify-center gap-2 py-3.5 border-2 border-dashed border-sand rounded-2xl text-sm font-medium text-gray-500 hover:border-primary-400 hover:text-primary-600 transition disabled:opacity-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              {{ loadingPayments ? 'Memuat metode...' : 'Pilih Metode Pembayaran' }}
            </button>
          </div>

          <!-- Promo Codes -->
          <div class="bg-white rounded-3xl shadow-card p-5">
            <h3 class="font-semibold text-gray-900 mb-3">🎟️ Kode Promo <span class="font-normal text-gray-400 text-sm">(opsional)</span></h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-xs text-gray-500 mb-1">Voucher Belanja</label>
                <input v-model="promoCheckoutCode" type="text" placeholder="Kode voucher..." class="w-full border border-sand rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 bg-cream" />
              </div>
              <div>
                <label class="block text-xs text-gray-500 mb-1">Voucher Ongkir</label>
                <input v-model="promoShippingCode" type="text" placeholder="Kode voucher..." class="w-full border border-sand rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 bg-cream" />
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Summary -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-3xl shadow-card p-5 sticky top-24">
            <h2 class="font-bold text-gray-900 mb-4">Ringkasan Pesanan</h2>

            <!-- Items -->
            <div class="space-y-2.5 max-h-56 overflow-y-auto mb-4">
              <div v-for="item in checkoutItems" :key="item.id" class="flex items-start gap-2.5">
                <img :src="item.image" :alt="item.product_name" class="w-10 h-10 rounded-xl object-cover bg-cream flex-shrink-0 mt-0.5" />
                <div class="flex-1 min-w-0">
                  <p class="text-xs font-medium text-gray-800 line-clamp-1">{{ item.product_name }}</p>
                  <div v-if="item.variants?.length" class="flex flex-wrap gap-x-2 mt-0.5">
                    <span v-for="v in item.variants" :key="v.name" class="text-xs text-gray-500">
                      {{ v.name }}: <span class="font-medium text-gray-700">{{ v.value }}</span>
                    </span>
                  </div>
                  <p class="text-xs text-gray-400 mt-0.5">{{ item.qty }}× {{ formatRupiah(item.price) }}</p>
                  <!-- Free product promo -->
                  <div v-if="item.promotion_free_product?.free_items?.length" class="mt-1 space-y-0.5">
                    <p
                      v-for="freeItem in item.promotion_free_product.free_items"
                      :key="freeItem.id"
                      class="text-[11px] text-pink-600 flex items-center gap-1"
                    >
                      <span>🎁</span>
                      <span class="truncate">
                        +{{ freeQty(item, freeItem) }}
                        {{ freeItem.product_name }} (Gratis)
                      </span>
                    </p>
                  </div>
                </div>
                <span class="text-xs font-semibold text-gray-800 flex-shrink-0">{{ formatRupiah(item.subtotal) }}</span>
              </div>
            </div>

            <!-- Totals -->
            <div class="border-t border-sand pt-3 space-y-2 text-sm text-gray-600 mb-3">
              <div class="flex justify-between">
                <span>Subtotal ({{ cartStore.selectedTotalItems }} produk)</span>
                <span>{{ formatRupiah(cartStore.selectedTotalPrice) }}</span>
              </div>
              <div class="flex justify-between">
                <span>Ongkos Kirim</span>
                <span :class="selectedShipping ? 'text-gray-800 font-medium' : 'text-gray-400'">
                  {{ selectedShipping ? formatRupiah(selectedShipping.price) : 'Belum dipilih' }}
                </span>
              </div>
            </div>

            <div class="border-t border-sand pt-3 mb-4">
              <div class="flex justify-between font-bold text-gray-900">
                <span>Total</span>
                <span class="text-primary-700">{{ formatRupiah(grandTotal) }}</span>
              </div>
              <p class="text-xs text-gray-400 mt-0.5">*sudah termasuk ongkir</p>
            </div>

            <p v-if="errorMsg" class="text-sm text-red-600 mb-3 bg-red-50 rounded-xl px-3 py-2">{{ errorMsg }}</p>

            <button
              @click="placeOrder"
              :disabled="placing || !canPlace"
              class="w-full py-3.5 bg-primary-700 text-white font-bold rounded-xl hover:bg-primary-800 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm"
            >
              {{ placing ? 'Membuat Pesanan...' : 'Buat Pesanan' }}
            </button>
            <p v-if="!canPlace && !placing" class="text-xs text-center text-gray-400 mt-2">
              {{ !selectedAddress ? 'Pilih alamat pengiriman' : !selectedShipping ? 'Pilih metode pengiriman' : 'Pilih metode pembayaran' }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Address selection modal -->
    <CheckoutModal v-model="showAddressModal" title="Pilih Alamat Pengiriman">
      <AddressSelector
        :model-value="selectedAddress"
        :addresses="addresses"
        :loading="loadingAddresses"
        @update:model-value="(val: Address | null) => { selectedAddress = val; onAddressPicked() }"
        @refresh="loadAddresses"
      />
    </CheckoutModal>

    <!-- Shipping selection modal -->
    <CheckoutModal v-model="showShippingModal" title="Pilih Metode Pengiriman">
      <ShippingSelector
        :model-value="selectedShipping"
        :groups="shippingGroups"
        :loading="loadingShipping"
        @update:model-value="(val: ShippingOption | null) => { selectedShipping = val; onShippingPicked() }"
      />
    </CheckoutModal>

    <!-- Payment selection modal -->
    <CheckoutModal v-model="showPaymentModal" title="Pilih Metode Pembayaran">
      <PaymentSelector
        :model-value="selectedPayment"
        :methods="paymentMethods"
        :loading="loadingPayments"
        @update:model-value="(val: PaymentMethod | null) => { selectedPayment = val; onPaymentPicked() }"
      />
    </CheckoutModal>
  </NuxtLayout>
</template>

<script setup lang="ts">
import type { Address, ShippingGroup, ShippingOption, PaymentMethod, CartItem, FreeItem } from '~/types/api'
import { formatRupiah } from '~/utils/format'
import AddressSelector from '~/components/checkout/AddressSelector.vue'
import ShippingSelector from '~/components/checkout/ShippingSelector.vue'
import PaymentSelector from '~/components/checkout/PaymentSelector.vue'
import CheckoutModal from '~/components/checkout/CheckoutModal.vue'

definePageMeta({ middleware: 'auth' })
useSeoMeta({ title: 'Checkout' })

const authStore = useAuthStore()
const cartStore = useCartStore()
const router = useRouter()
const token = useCookie('arafahijab_token')

const checkoutSteps = ['Alamat Pengiriman', 'Pengiriman', 'Pembayaran']
const currentStep = computed(() => {
  if (!selectedAddress.value) return 0
  if (!selectedShipping.value) return 1
  return 2
})

function freeQty(item: CartItem, freeItem: FreeItem): number {
  const base = item.promotion_free_product?.is_multiple
    ? freeItem.qty * item.qty
    : freeItem.qty
  return freeItem.max_qty ? Math.min(base, freeItem.max_qty) : base
}

const initLoading = ref(true)

const selectedAddress = ref<Address | null>(null)
const selectedShipping = ref<ShippingOption | null>(null)
const selectedPayment = ref<PaymentMethod | null>(null)
const addresses = ref<Address[]>([])
const shippingGroups = ref<ShippingGroup[]>([])
const paymentMethods = ref<PaymentMethod[]>([])
const loadingAddresses = ref(true)
const loadingShipping = ref(false)
const loadingPayments = ref(true)
const promoCheckoutCode = ref('')
const promoShippingCode = ref('')
const placing = ref(false)
const errorMsg = ref('')

// Modal visibility
const showAddressModal = ref(false)
const showShippingModal = ref(false)
const showPaymentModal = ref(false)

function onAddressPicked() {
  showAddressModal.value = false
}
function onShippingPicked() {
  showShippingModal.value = false
}
function onPaymentPicked() {
  showPaymentModal.value = false
}

const checkoutItems = computed(() =>
  cartStore.selectedItems.length ? cartStore.selectedItems : cartStore.items
)
const grandTotal = computed(() =>
  cartStore.selectedTotalPrice + (selectedShipping.value?.price ?? 0)
)
const canPlace = computed(() =>
  !!selectedAddress.value && !!selectedShipping.value && !!selectedPayment.value
)

const authHeaders = () => ({ Authorization: `Bearer ${token.value}` })

async function loadAddresses() {
  loadingAddresses.value = true
  try {
    const res = await $fetch<{ message: string; data: Address[] }>(
      '/api/auth/addresses',
      { headers: authHeaders() }
    )
    addresses.value = res.data ?? []
    // auto-select primary (or first) if nothing selected yet
    if (!selectedAddress.value) {
      const primary = addresses.value.find((a) => a.primary) ?? addresses.value[0] ?? null
      selectedAddress.value = primary
    } else {
      // refresh selected address object in case data changed
      const refreshed = addresses.value.find((a) => a.id === selectedAddress.value!.id)
      if (refreshed) selectedAddress.value = refreshed
    }
  } finally {
    loadingAddresses.value = false
  }
}
onMounted(async () => {
  await cartStore.fetchCart()
  initLoading.value = false

  // Redirect if nothing selected after cart load
  if (!cartStore.hasSelection) {
    await router.replace('/cart')
    return
  }

  // Load addresses and payment methods in parallel
  await Promise.all([
    loadAddresses(),
    $fetch<{ message: string; data: { data: PaymentMethod[] } }>('/api/payment-methods')
      .then((pmRes) => { paymentMethods.value = pmRes.data.data ?? [] })
      .finally(() => { loadingPayments.value = false }),
  ])
})

// When address changes, fetch shipping options
watch(selectedAddress, async (addr) => {
  selectedShipping.value = null
  shippingGroups.value = []
  if (!addr) return

  // weight = total qty of selected items × 200g per item
  const totalWeight = checkoutItems.value.reduce((sum, item) => sum + item.qty * 200, 0)
  loadingShipping.value = true
  try {
    const res = await $fetch<{ message: string; data: { data: ShippingGroup[] } }>('/api/data/shipping-fee', {
      method: 'POST',
      body: {
        province: addr.province,
        city: addr.city,
        district: addr.district,
        zipcode: addr.zipcode,
        weight: totalWeight || 200,
      },
    })
    shippingGroups.value = res.data.data ?? []
  } finally {
    loadingShipping.value = false
  }
})

async function placeOrder() {
  if (!canPlace.value) return
  errorMsg.value = ''
  placing.value = true
  try {
    const res = await $fetch<{ message: string; data: { id: string } }>('/api/checkout', {
      method: 'POST',
      headers: authHeaders(),
      body: {
        address_id: selectedAddress.value!.id,
        dropship: null,
        shipping: {
          courier_code: selectedShipping.value!.courierCode,
          courier_name: selectedShipping.value!.courierName,
          service_code: selectedShipping.value!.serviceCode,
          service_name: selectedShipping.value!.serviceName,
          cost: selectedShipping.value!.price,
        },
        payment: {
          provider: selectedPayment.value!.provider,
          type: selectedPayment.value!.type,
          code: selectedPayment.value!.code,
          name: selectedPayment.value!.name,
        },
        items: checkoutItems.value.map((i) => ({ sku_id: i.sku_id, qty: i.qty })),
        promotion_checkout_code: promoCheckoutCode.value || undefined,
        promotion_shipping_code: promoShippingCode.value || undefined,
      },
    })
    await router.push(`/orders/${res.data.id}`)
  } catch (e: any) {
    errorMsg.value = e?.data?.error ?? 'Gagal membuat pesanan. Silakan coba lagi.'
  } finally {
    placing.value = false
  }
}
</script>