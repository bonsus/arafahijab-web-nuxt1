<template>
  <NuxtLayout name="default">
    <div v-if="order" class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Back -->
      <NuxtLink to="/orders" class="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary-600 mb-6">
        ← Kembali ke Pesanan
      </NuxtLink>

      <!-- Header -->
      <div class="bg-white rounded-2xl border border-gray-200 p-5 mb-4">
        <div class="flex items-start justify-between flex-wrap gap-3">
          <div>
            <h1 class="text-xl font-bold text-gray-900">{{ order.no }}</h1>
            <p class="text-sm text-gray-500 mt-0.5">{{ formatDateTime(order.date_created) }}</p>
          </div>
          <div class="flex flex-col items-end gap-2">
            <span :class="['text-sm font-medium px-3 py-1 rounded-full', ORDER_STATUS_COLOR[order.status] ?? 'bg-gray-100 text-gray-600']">
              {{ ORDER_STATUS_LABEL[order.status] ?? order.status }}
            </span>
            <span :class="['text-sm font-medium px-3 py-1 rounded-full', PAYMENT_STATUS_COLOR[order.payment_status] ?? 'bg-gray-100 text-gray-600']">
              {{ PAYMENT_STATUS_LABEL[order.payment_status] ?? order.payment_status }}
            </span>
          </div>
        </div>
      </div>

      <!-- Payment Action: Virtual Account / QRIS -->
      <div v-if="order.xendit && order.payment_status === 'unpaid'" class="bg-blue-50 border border-blue-200 rounded-3xl p-5 mb-4">
        <h2 class="font-bold text-blue-900 mb-3">Informasi Pembayaran</h2>
        <div v-if="order.xendit.type === 'VIRTUAL_ACCOUNT'" class="text-sm text-blue-800 space-y-1">
          <p>Bank: <strong>{{ order.xendit.bank_name }}</strong></p>
          <p>Nomor VA: <strong class="text-lg font-mono">{{ order.xendit.account_number }}</strong></p>
          <p>Atas Nama: {{ order.xendit.account_name }}</p>
          <p>Total: <strong>{{ formatRupiah(String(order.xendit.amount)) }}</strong></p>
          <p>Batas Waktu: {{ formatDateTime(order.xendit.date_expired) }}</p>
        </div>
        <div v-else-if="order.xendit.type === 'QRIS' && order.xendit.qris" class="text-center">
          <img :src="order.xendit.qris" alt="QRIS" class="w-48 h-48 mx-auto rounded-xl" />
          <p class="text-sm text-blue-800 mt-2">Total: <strong>{{ formatRupiah(String(order.xendit.amount)) }}</strong></p>
        </div>
        <div v-else-if="order.xendit.url">
          <a :href="order.xendit.url" target="_blank" class="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition">
            Bayar Sekarang →
          </a>
        </div>
      </div>

      <!-- Payment Action: Bank Transfer Manual -->
      <div
        v-if="order.payment_status === 'unpaid' && !order.xendit"
        class="bg-amber-50 border border-amber-200 rounded-3xl p-5 mb-4"
      >
        <h2 class="font-bold text-amber-900 mb-2">Konfirmasi Pembayaran</h2>
        <p class="text-sm text-yellow-800 mb-3">Sudah transfer? Kirimkan konfirmasi pembayaran Anda.</p>
        <button
          @click="showPaymentModal = true"
          class="px-4 py-2 bg-yellow-600 text-white text-sm font-medium rounded-xl hover:bg-yellow-700 transition"
        >
          Konfirmasi Pembayaran
        </button>
      </div>

      <!-- Shipment Info -->
      <div v-if="order.shipment.tracking_no" class="bg-white rounded-3xl shadow-card p-5 mb-4">
        <h2 class="font-bold text-gray-900 mb-3">Informasi Pengiriman</h2>
        <div class="text-sm text-gray-700 space-y-1">
          <p>Kurir: <strong>{{ order.shipment.courier_name }} — {{ order.shipment.service_name }}</strong></p>
          <p>No. Resi: <strong class="font-mono">{{ order.shipment.tracking_no }}</strong></p>
        </div>
      </div>

      <!-- Dropship Info -->
      <div v-if="order.dropship" class="bg-white rounded-3xl shadow-card p-5 mb-4">
        <div class="flex items-center gap-2 mb-3">
          <h2 class="font-bold text-gray-900">Informasi Dropship</h2>
          <span
            :class="order.dropship.type === 'marketplace' ? 'bg-purple-100 text-purple-700' : 'bg-amber-100 text-amber-700'"
            class="text-xs font-bold px-2 py-0.5 rounded-full"
          >{{ order.dropship.type === 'marketplace' ? 'Marketplace' : 'Regular' }}</span>
        </div>

        <!-- Regular -->
        <div v-if="order.dropship.type === 'regular'" class="text-sm text-gray-700 space-y-1">
          <p>Nama Pengirim: <strong>{{ order.dropship.name }}</strong></p>
          <p>No. HP: <strong>{{ order.dropship.phone }}</strong></p>
        </div>

        <!-- Marketplace -->
        <div v-else class="text-sm text-gray-700 space-y-2">
          <p v-if="order.dropship.source">Marketplace:
            <strong class="capitalize">{{ order.dropship.source }}</strong>
          </p>
          <a
            v-if="order.dropship.file"
            :href="order.dropship.file"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-1.5 text-primary-700 hover:text-primary-800 font-medium transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Lihat Label Pengiriman
          </a>
        </div>
      </div>

      <!-- Delivery Address -->
      <div class="bg-white rounded-3xl shadow-card p-5 mb-4">
        <h2 class="font-bold text-gray-900 mb-3">Alamat Pengiriman</h2>
        <div class="text-sm text-gray-700 space-y-0.5">
          <p class="font-medium">{{ order.address.name }}</p>
          <p>{{ order.address.phone }}</p>
          <p>{{ order.address.address }}, {{ order.address.district }}, {{ order.address.city }}, {{ order.address.province }} {{ order.address.zipcode }}</p>
        </div>
      </div>

      <!-- Items -->
      <div class="bg-white rounded-3xl shadow-card p-5 mb-4">
        <h2 class="font-bold text-gray-900 mb-4">Produk Dipesan</h2>
        <div v-for="item in order.items" :key="item.sku_id" class="flex gap-3 py-3 border-b border-gray-100 last:border-0">
          <img :src="item.image" :alt="item.product_name" class="w-14 h-14 rounded-xl object-cover bg-gray-100 flex-shrink-0" />
          <div class="flex-1 min-w-0">
            <p class="font-medium text-gray-900 text-sm line-clamp-2">{{ item.product_name }}</p>
            <p class="text-xs text-gray-500 mt-0.5">{{ item.variants.map(v => `${v.name}: ${v.value}`).join(' | ') }}</p>
            <p class="text-xs text-gray-400 mt-0.5">{{ item.qty }} × {{ formatRupiah(item.price) }}</p>
          </div>
          <span class="font-semibold text-gray-900 text-sm">{{ formatRupiah(item.total) }}</span>
        </div>
      </div>

      <!-- Price Summary -->
      <div class="bg-white rounded-3xl shadow-card p-5">
        <h2 class="font-bold text-gray-900 mb-3">Rincian Harga</h2>
        <div class="space-y-2 text-sm text-gray-600">
          <div class="flex justify-between">
            <span>Subtotal ({{ order.qty }} produk)</span>
            <span>{{ formatRupiah(order.subtotal) }}</span>
          </div>
          <div v-if="parseFloat(order.discount) > 0" class="flex justify-between text-green-600">
            <span>Diskon</span>
            <span>-{{ formatRupiah(order.discount) }}</span>
          </div>
          <div class="flex justify-between">
            <span>Ongkos Kirim</span>
            <span>{{ formatRupiah(order.shipping_total) }}</span>
          </div>
          <div v-if="parseFloat(order.shipping_discount) > 0" class="flex justify-between text-green-600">
            <span>Diskon Ongkir</span>
            <span>-{{ formatRupiah(order.shipping_discount) }}</span>
          </div>
        </div>
        <div class="border-t border-gray-100 mt-3 pt-3 flex justify-between font-bold text-gray-900">
          <span>Total Pembayaran</span>
          <span>{{ formatRupiah(order.total) }}</span>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <LoadingSpinner v-else-if="pending" />

    <!-- Error -->
    <div v-else class="max-w-3xl mx-auto px-4 py-16 text-center">
      <p class="text-gray-500">Pesanan tidak ditemukan.</p>
      <NuxtLink to="/orders" class="mt-3 inline-block text-primary-600 hover:underline">Kembali ke Pesanan</NuxtLink>
    </div>

    <!-- Payment Confirm Modal -->
    <PaymentConfirmModal
      v-if="showPaymentModal && order"
      :order-id="order.id"
      :order-total="order.total"
      @close="showPaymentModal = false"
      @confirmed="onPaymentConfirmed"
    />
  </NuxtLayout>
</template>

<script setup lang="ts">
import type { Order } from '~/types/api'
import { formatRupiah, formatDateTime, ORDER_STATUS_LABEL, ORDER_STATUS_COLOR, PAYMENT_STATUS_LABEL, PAYMENT_STATUS_COLOR } from '~/utils/format'
import LoadingSpinner from '~/components/ui/LoadingSpinner.vue'
import PaymentConfirmModal from '~/components/order/PaymentConfirmModal.vue'

definePageMeta({ middleware: 'auth' })

const route = useRoute()
const token = useCookie('arafahijab_token')
const showPaymentModal = ref(false)

const { data: order, pending, refresh } = await useAsyncData<Order>(
  () => `order-${route.params.id}`,
  () =>
    $fetch<{ message: string; data: Order }>(`/api/orders/${route.params.id}`, {
      headers: { Authorization: `Bearer ${token.value}` },
    }).then((r) => r.data),
  { watch: [() => route.params.id] }
)

useSeoMeta({ title: () => order.value ? `Pesanan ${order.value.no}` : 'Detail Pesanan' })

async function onPaymentConfirmed() {
  showPaymentModal.value = false
  await refresh()
}
</script>
