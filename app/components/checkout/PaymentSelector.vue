<template>
  <div>
    <div v-if="loading" class="flex justify-center py-6">
      <div class="w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
    </div>
    <div v-else-if="!methods.length" class="text-center py-6 text-sm text-gray-500">
      Memuat metode pembayaran...
    </div>
    <div v-else class="space-y-3">
      <label
        v-for="method in methods"
        :key="method.code"
        :class="modelValue?.code === method.code
          ? 'border-primary-500 bg-primary-50 ring-1 ring-primary-300'
          : 'border-sand bg-white hover:border-primary-300'"
        class="flex items-center gap-3 p-4 rounded-2xl border cursor-pointer transition"
        @click="$emit('update:modelValue', method)"
      >
        <span
          class="w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition"
          :class="modelValue?.code === method.code ? 'border-primary-600' : 'border-gray-300'"
        >
          <span v-if="modelValue?.code === method.code" class="w-2 h-2 rounded-full bg-primary-600" />
        </span>
        <div class="flex-1">
          <p class="text-sm font-semibold text-gray-900">{{ method.name }}</p>
          <p v-if="method.description" class="text-xs text-gray-500 mt-0.5">{{ method.description }}</p>
          <p v-if="method.fee && method.fee !== '0'" class="text-xs text-gray-400 mt-0.5">Biaya: {{ method.fee }}</p>
        </div>
      </label>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PaymentMethod } from '~/types/api'
defineProps<{ methods: PaymentMethod[]; modelValue: PaymentMethod | null; loading?: boolean }>()
defineEmits<{ 'update:modelValue': [method: PaymentMethod] }>()
</script>
