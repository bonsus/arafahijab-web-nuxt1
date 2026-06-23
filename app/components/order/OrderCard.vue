<template>
  <div class="bg-white rounded-2xl border border-sand shadow-card p-4 hover:shadow-card-hover transition-shadow">
    <!-- Header -->
    <div class="flex items-start justify-between gap-2 mb-3">
      <div>
        <p class="text-xs text-gray-500">{{ formatDate(order.date_created) }}</p>
        <p class="text-sm font-semibold text-gray-900 mt-0.5">{{ order.no }}</p>
      </div>
      <span :class="statusClass" class="text-xs font-semibold px-2.5 py-1 rounded-full">
        {{ statusLabel }}
      </span>
    </div>

    <!-- Items preview -->
    <div class="flex gap-2 mb-3">
      <div
        v-for="(item, i) in order.items?.slice(0, 3)"
        :key="i"
        class="w-12 h-12 rounded-lg bg-cream overflow-hidden flex-shrink-0"
      >
        <img v-if="item.image" :src="item.image" :alt="item.product_name" class="w-full h-full object-cover" />
        <div v-else class="w-full h-full flex items-center justify-center text-primary-300"><Shirt class="w-5 h-5" /></div>
      </div>
      <div v-if="(order.items?.length || 0) > 3" class="w-12 h-12 rounded-lg bg-sand flex items-center justify-center text-xs text-gray-600 font-medium flex-shrink-0">
        +{{ (order.items?.length || 0) - 3 }}
      </div>
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
import type { Order } from '~/types/api'
const props = defineProps<{ order: Order }>()
const { formatRupiah, formatDate, getOrderStatusLabel, getOrderStatusColor } = useFormatters()
const statusLabel = computed(() => getOrderStatusLabel(props.order.status))
const statusClass = computed(() => getOrderStatusColor(props.order.status))
</script>
