<template>
  <div class="bg-white rounded-2xl border border-sand shadow-card p-4 hover:shadow-card-hover transition-shadow">
    <!-- Header -->
    <div class="flex items-start justify-between gap-2 mb-3">
      <div>
        <p class="text-xs text-gray-500">{{ formatDate(order.date_created) }}</p>
        <p class="text-sm font-semibold text-gray-900 mt-0.5">{{ order.no }}</p>
        <!-- Dropship badge -->
        <span
          v-if="order.dropship"
          :class="order.dropship.type === 'marketplace' ? 'bg-purple-100 text-purple-700' : 'bg-amber-100 text-amber-700'"
          class="inline-block text-[10px] font-bold px-1.5 py-0.5 rounded-full mt-1"
        >Dropship {{ order.dropship.type === 'marketplace' ? 'Marketplace' : 'Regular' }}</span>
      </div>
      <span :class="statusClass" class="text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0">
        {{ statusLabel }}
      </span>
    </div>

    <!-- Items list -->
    <div class="mb-3 space-y-2">
      <div
        v-for="(item, i) in visibleItems"
        :key="i"
        class="flex items-center gap-2.5"
      >
        <div class="w-11 h-11 rounded-xl bg-cream overflow-hidden flex-shrink-0 border border-sand">
          <img v-if="item.image" :src="item.image" :alt="item.product_name" class="w-full h-full object-cover" />
          <div v-else class="w-full h-full flex items-center justify-center text-primary-300">
            <Shirt class="w-5 h-5" />
          </div>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-xs font-medium text-gray-800 line-clamp-1 leading-snug">{{ itemLabel(item) }}</p>
          <p class="text-xs text-gray-400 mt-0.5">{{ item.qty }}×</p>
        </div>
      </div>

      <!-- Expand / collapse toggle -->
      <button
        v-if="(order.items?.length ?? 0) > 1"
        type="button"
        @click="expanded = !expanded"
        class="flex items-center gap-1 text-xs font-medium text-primary-600 hover:text-primary-700 transition pt-0.5"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-3.5 w-3.5 transition-transform"
          :class="expanded ? 'rotate-180' : ''"
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
        {{ expanded ? 'Sembunyikan' : `+${(order.items?.length ?? 0) - 1} produk lainnya` }}
      </button>
    </div>

    <!-- Footer -->
    <div class="flex items-center justify-between pt-3 border-t border-sand">
      <div>
        <p class="text-xs text-gray-500">Total</p>
        <p class="text-sm font-bold text-primary-700">{{ formatRupiah(order.total) }}</p>
      </div>
      <NuxtLink :to="`/orders/${order.id}`" class="text-xs font-medium text-primary-700 hover:text-primary-800 bg-primary-50 px-3 py-1.5 rounded-lg transition">
        Lihat Detail
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Shirt } from 'lucide-vue-next'
import type { Order, OrderItem } from '~/types/api'

const props = defineProps<{ order: Order }>()
const { formatRupiah, formatDate, getOrderStatusLabel, getOrderStatusColor } = useFormatters()

const statusLabel = computed(() => getOrderStatusLabel(props.order.status))
const statusClass = computed(() => getOrderStatusColor(props.order.status))

const expanded = ref(false)
const visibleItems = computed(() =>
  expanded.value ? (props.order.items ?? []) : (props.order.items ?? []).slice(0, 1)
)

function itemLabel(item: OrderItem): string {
  const variantStr = item.variants?.map(v => v.value).join(' ') ?? ''
  return variantStr ? `${item.product_name} - ${variantStr}` : item.product_name
}
</script>
