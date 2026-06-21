<template>
  <div v-if="totalPages > 1" class="flex items-center justify-center gap-1.5">
    <button
      @click="$emit('change', currentPage - 1)"
      :disabled="currentPage === 1"
      class="w-9 h-9 rounded-xl border border-sand flex items-center justify-center text-gray-600 hover:bg-primary-50 hover:border-primary-300 hover:text-primary-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
    </button>

    <template v-for="page in visiblePages" :key="page">
      <span v-if="page === '...'" class="w-9 h-9 flex items-center justify-center text-gray-400 text-sm">…</span>
      <button
        v-else
        @click="$emit('change', page as number)"
        :class="page === currentPage ? 'bg-primary-700 text-white border-primary-700' : 'border-sand text-gray-700 hover:bg-primary-50 hover:border-primary-300 hover:text-primary-700'"
        class="w-9 h-9 rounded-xl border text-sm font-medium transition"
      >
        {{ page }}
      </button>
    </template>

    <button
      @click="$emit('change', currentPage + 1)"
      :disabled="currentPage === totalPages"
      class="w-9 h-9 rounded-xl border border-sand flex items-center justify-center text-gray-600 hover:bg-primary-50 hover:border-primary-300 hover:text-primary-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ currentPage: number; totalPages: number }>()
defineEmits<{ change: [page: number] }>()

const visiblePages = computed(() => {
  const pages: (number | string)[] = []
  const { currentPage, totalPages } = props
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i)
  } else {
    pages.push(1)
    if (currentPage > 3) pages.push('...')
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) pages.push(i)
    if (currentPage < totalPages - 2) pages.push('...')
    pages.push(totalPages)
  }
  return pages
})
</script>
