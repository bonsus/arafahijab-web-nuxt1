import { defineStore } from 'pinia'
import type { CartItem } from '~/types/api'

export const useCartStore = defineStore('cart', () => {
  const authStore = useAuthStore()
  const items = ref<CartItem[]>([])
  const loading = ref(false)
  const selectedIds = ref<Set<string>>(new Set())

  const totalItems = computed(() =>
    items.value.reduce((sum, item) => sum + item.qty, 0)
  )

  const totalPrice = computed(() =>
    items.value.reduce((sum, item) => sum + parseFloat(item.subtotal), 0)
  )

  const selectedItems = computed(() =>
    items.value.filter((item) => selectedIds.value.has(item.id))
  )

  const selectedTotalItems = computed(() =>
    selectedItems.value.reduce((sum, item) => sum + item.qty, 0)
  )

  const selectedTotalPrice = computed(() =>
    selectedItems.value.reduce((sum, item) => sum + parseFloat(item.subtotal), 0)
  )

  const isAllSelected = computed(
    () => items.value.length > 0 && items.value.every((item) => selectedIds.value.has(item.id))
  )

  const hasSelection = computed(() => selectedIds.value.size > 0)

  const LS_KEY = 'arafahijab_cart_selection'

  function persistSelection(ids: Set<string>) {
    if (process.client) {
      localStorage.setItem(LS_KEY, JSON.stringify([...ids]))
    }
  }

  function toggleSelect(id: string) {
    const next = new Set(selectedIds.value)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    selectedIds.value = next
    persistSelection(next)
  }

  function toggleSelectAll() {
    if (isAllSelected.value) {
      selectedIds.value = new Set()
    } else {
      selectedIds.value = new Set(items.value.map((i) => i.id))
    }
    persistSelection(selectedIds.value)
  }

  function authHeaders() {
    return { Authorization: `Bearer ${authStore.token}` }
  }

  async function fetchCart() {
    if (!authStore.token) {
      items.value = []
      selectedIds.value = new Set()
      return
    }
    loading.value = true
    try {
      const res = await $fetch<{ message: string; data: { data: CartItem[] | null } }>(
        '/api/cart',
        { headers: authHeaders() }
      )
      const fetched = res.data.data ?? []
      items.value = fetched
      // keep only valid selectedIds after refetch
      const validIds = new Set(fetched.map((i) => i.id))
      // restore from localStorage on page refresh (selectedIds will be empty)
      if (process.client && selectedIds.value.size === 0) {
        try {
          const saved = localStorage.getItem(LS_KEY)
          if (saved) selectedIds.value = new Set(JSON.parse(saved) as string[])
        } catch {}
      }
      selectedIds.value = new Set([...selectedIds.value].filter((id) => validIds.has(id)))
    } finally {
      loading.value = false
    }
  }

  async function addToCart(skuId: string, qty: number) {
    await $fetch('/api/cart', {
      method: 'POST',
      headers: authHeaders(),
      body: { sku_id: skuId, qty },
    })
    await fetchCart()
  }

  async function updateQty(itemId: string, qty: number) {
    await $fetch(`/api/cart/${itemId}`, {
      method: 'PUT',
      headers: authHeaders(),
      body: { qty },
    })
    await fetchCart()
  }

  async function removeItem(itemId: string) {
    await $fetch(`/api/cart/${itemId}`, {
      method: 'DELETE',
      headers: authHeaders(),
    })
    await fetchCart()
  }

  return {
    items, loading,
    totalItems, totalPrice,
    selectedIds, selectedItems, selectedTotalItems, selectedTotalPrice,
    isAllSelected, hasSelection,
    toggleSelect, toggleSelectAll,
    fetchCart, addToCart, updateQty, removeItem,
  }
})
