<template>
  <NuxtLayout name="default">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">

        <!-- Sidebar -->
        <div class="md:col-span-1">
          <AccountSidebar />
        </div>

        <!-- Content -->
        <div class="md:col-span-3">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Pesanan Saya</h1>

      <!-- Filters -->
      <div class="bg-white rounded-2xl shadow-card p-4 mb-5 flex flex-wrap gap-3">
        <input v-model="filters.search" type="text" placeholder="Cari No. Pesanan..." @keyup.enter="filters.page = 1"
          class="border border-sand rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 flex-1 min-w-[160px] bg-cream" />
        <select v-model="filters.status" @change="filters.page = 1"
          class="border border-sand rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 bg-cream">
          <option value="">Semua Status</option>
          <option v-for="(label, key) in ORDER_STATUS_LABEL" :key="key" :value="key">{{ label }}</option>
        </select>
        <select v-model="filters.payment_status" @change="filters.page = 1"
          class="border border-sand rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 bg-cream">
          <option value="">Semua Pembayaran</option>
          <option v-for="(label, key) in PAYMENT_STATUS_LABEL" :key="key" :value="key">{{ label }}</option>
        </select>
      </div>

      <LoadingSpinner v-if="pending" />

      <div v-else-if="!result?.data?.length" class="text-center py-20">
        <div class="w-20 h-20 rounded-full bg-cream-dark flex items-center justify-center mx-auto mb-4">
          <PackageOpen class="w-9 h-9 text-primary-400" />
        </div>
        <p class="text-gray-500 text-lg font-medium">Belum ada pesanan</p>
        <NuxtLink to="/products" class="mt-4 inline-flex items-center gap-1 text-primary-600 hover:underline font-medium">Belanja Sekarang <ArrowRight class="w-4 h-4" /></NuxtLink>
      </div>

      <div v-else class="space-y-3">
        <OrderCard v-for="order in result.data" :key="order.id" :order="order" />
        <AppPagination :current-page="filters.page" :total-pages="result.total_page" @change="filters.page = $event" />
      </div>
    </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { PackageOpen, ArrowRight } from 'lucide-vue-next'
import type { PaginatedData, Order } from '~/types/api'
import { ORDER_STATUS_LABEL, PAYMENT_STATUS_LABEL } from '~/utils/format'
import LoadingSpinner from '~/components/ui/LoadingSpinner.vue'
import AppPagination from '~/components/ui/AppPagination.vue'
import OrderCard from '~/components/order/OrderCard.vue'
definePageMeta({ middleware: 'auth' })
useSeoMeta({ title: 'Pesanan Saya' })
const token = useCookie('arafahijab_token')
const filters = reactive({ status: '', payment_status: '', search: '', page: 1 })
const queryKey = computed(() => [filters.status, filters.payment_status, filters.search, filters.page].join('|'))
const { data: result, pending } = await useAsyncData<PaginatedData<Order>>(
  () => `orders-${queryKey.value}`,
  () => {
    const params = new URLSearchParams({ per_page: '10' })
    if (filters.status) params.set('status', filters.status)
    if (filters.payment_status) params.set('payment_status', filters.payment_status)
    if (filters.search) params.set('search', filters.search)
    params.set('page', String(filters.page))
    return $fetch<{ message: string; data: PaginatedData<Order> }>(`/api/orders?${params}`, { headers: { Authorization: `Bearer ${token.value}` } }).then((r) => r.data)
  },
  { watch: [queryKey] }
)
</script>