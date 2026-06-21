<template>
  <div class="space-y-3 mb-5">
    <div
      v-for="variant in productVariants"
      :key="variant.name"
      class="flex items-start gap-4"
    >
      <!-- Label -->
      <span class="text-sm font-semibold text-gray-700 w-20 flex-shrink-0 pt-1.5">
        {{ variant.name }}
      </span>

      <!-- Option pills -->
      <div class="flex flex-wrap gap-2">
        <button
          v-for="option in variant.options"
          :key="option"
          type="button"
          @click="selectOption(variant.name, option)"
          :class="[
            selected[variant.name] === option
              ? 'border-primary-700 bg-primary-50 text-primary-700 ring-2 ring-primary-200'
              : isOutOfStock(variant.name, option)
                ? 'border-sand text-gray-300 line-through cursor-default'
                : 'border-sand text-gray-600 hover:border-primary-400 hover:bg-cream cursor-pointer',
          ]"
          class="px-3.5 py-1.5 rounded-xl border text-sm font-medium transition"
        >
          {{ option }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ProductVariantDef, Sku } from '~/types/api'

const props = defineProps<{
  productVariants: ProductVariantDef[]
  skus: Sku[]
}>()

const emit = defineEmits<{
  'update:selectedSku': [sku: Sku | null]
}>()

// Returns true when every SKU that includes this option has stock === 0
function isOutOfStock(variantName: string, option: string): boolean {
  const candidates = (props.skus ?? []).filter((sku) =>
    sku.variants.some((v) => v.name === variantName && v.value === option)
  )
  return candidates.length > 0 && candidates.every((sku) => sku.stock === 0)
}

// Pick the first available option per variant dimension on setup
function buildInitialSelected(): Record<string, string> {
  const result: Record<string, string> = {}
  for (const variant of (props.productVariants ?? [])) {
    const first = variant.options.find((opt) => !isOutOfStock(variant.name, opt))
    if (first) result[variant.name] = first
  }
  return result
}

const selected = reactive<Record<string, string>>(buildInitialSelected())

// SKU that matches ALL selected dimensions
const matchedSku = computed<Sku | null>(() => {
  const keys = Object.keys(selected)
  if (keys.length < (props.productVariants?.length ?? 0)) return null
  return (props.skus ?? []).find((sku) =>
    keys.every((name) => sku.variants.some((v) => v.name === name && v.value === selected[name]))
  ) ?? null
})

// Emit to parent immediately on setup and on every change
watch(matchedSku, (sku) => emit('update:selectedSku', sku), { immediate: true })

function selectOption(variantName: string, option: string) {
  if (isOutOfStock(variantName, option)) return
  selected[variantName] = option
}
</script>
