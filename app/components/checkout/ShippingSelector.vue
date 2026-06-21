<template>
  <div>
    <div v-if="loading" class="flex justify-center py-6">
      <div class="w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
    </div>
    <div v-else-if="!groups.length" class="text-center py-6 text-sm text-gray-500">
      Pilih alamat terlebih dahulu untuk melihat opsi pengiriman.
    </div>
    <div v-else class="space-y-4">
      <div v-for="group in groups" :key="group.label">
        <p class="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">{{ group.label }}</p>
        <div class="space-y-2">
          <label
            v-for="opt in group.data"
            :key="opt.courierCode + opt.serviceCode"
            :class="modelValue?.courierCode === opt.courierCode && modelValue?.serviceCode === opt.serviceCode
              ? 'border-primary-500 bg-primary-50 ring-1 ring-primary-300'
              : 'border-sand bg-white hover:border-primary-300'"
            class="flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition"
            @click="$emit('update:modelValue', opt)"
          >
            <!-- Radio -->
            <span
              class="w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition"
              :class="modelValue?.courierCode === opt.courierCode && modelValue?.serviceCode === opt.serviceCode
                ? 'border-primary-600' : 'border-gray-300'"
            >
              <span
                v-if="modelValue?.courierCode === opt.courierCode && modelValue?.serviceCode === opt.serviceCode"
                class="w-2 h-2 rounded-full bg-primary-600"
              />
            </span>
            <div class="flex-1">
              <p class="text-sm font-semibold text-gray-800">{{ opt.courierName }} – {{ opt.serviceName }}</p>
              <p class="text-xs text-gray-500 mt-0.5">
                Estimasi {{ opt.minDuration }}–{{ opt.maxDuration }} hari
                <template v-if="opt.cod"> · COD tersedia</template>
              </p>
            </div>
            <span class="text-sm font-bold text-primary-700 flex-shrink-0">{{ formatRupiah(opt.price) }}</span>
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ShippingGroup, ShippingOption } from '~/types/api'
defineProps<{ groups: ShippingGroup[]; modelValue: ShippingOption | null; loading?: boolean }>()
defineEmits<{ 'update:modelValue': [opt: ShippingOption] }>()
const { formatRupiah } = useFormatters()
</script>
