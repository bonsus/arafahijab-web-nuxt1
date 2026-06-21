import type { WishlistItem } from '~/types/api'

export const useWishlistStore = defineStore('wishlist', () => {
  const authStore = useAuthStore()
  const items = ref<WishlistItem[]>([])

  function authHeaders() {
    return { Authorization: `Bearer ${authStore.token}` }
  }

  async function fetchWishlist() {
    if (!authStore.token) { items.value = []; return }
    const res = await $fetch<{ message: string; data: { data: WishlistItem[] | null } }>(
      '/api/wishlist',
      { headers: authHeaders() }
    )
    items.value = res.data.data ?? []
  }

  async function addToWishlist(skuId: string) {
    await $fetch('/api/wishlist', {
      method: 'POST',
      headers: authHeaders(),
      body: { sku_id: skuId },
    })
    await fetchWishlist()
  }

  async function removeFromWishlist(skuId: string) {
    await $fetch(`/api/wishlist/${skuId}`, {
      method: 'DELETE',
      headers: authHeaders(),
    })
    await fetchWishlist()
  }

  function isInWishlist(skuId: string): boolean {
    return items.value.some((i) => i.sku_id === skuId)
  }

  return { items, fetchWishlist, addToWishlist, removeFromWishlist, isInWishlist }
})
