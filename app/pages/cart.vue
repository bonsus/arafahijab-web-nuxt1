<template>
  <NuxtLayout name="default">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

      <!-- Header -->
      <div class="flex items-center gap-3 mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Keranjang Belanja</h1>
        <span v-if="cartStore.totalItems > 0" class="bg-primary-100 text-primary-700 text-sm font-semibold px-2.5 py-0.5 rounded-full">
          {{ cartStore.totalItems }}
        </span>
      </div>

      <LoadingSpinner v-if="cartStore.loading" />

      <!-- Empty -->
      <div v-else-if="!cartStore.items.length" class="text-center py-20">
        <div class="w-24 h-24 rounded-full bg-cream-dark flex items-center justify-center mx-auto mb-5">
          <ShoppingBag class="w-10 h-10 text-primary-400" />
        </div>
        <h2 class="text-lg font-bold text-gray-900 mb-2">Keranjang Kosong</h2>
        <p class="text-gray-500 text-sm mb-6">Yuk, temukan hijab favoritmu!</p>
        <NuxtLink to="/products" class="inline-flex items-center px-7 py-3 bg-primary-700 text-white font-semibold rounded-xl hover:bg-primary-800 transition">
          Mulai Belanja
        </NuxtLink>
      </div>

      <!-- Cart Content -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Items -->
        <div class="lg:col-span-2 space-y-3">
          <!-- Select All row -->
          <div class="bg-white rounded-2xl shadow-card px-4 py-3 flex items-center justify-between">
            <button
              @click="cartStore.toggleSelectAll()"
              class="flex items-center gap-2.5 text-sm font-medium text-gray-700 hover:text-primary-700 transition"
            >
              <span
                class="w-5 h-5 rounded-md border-2 flex items-center justify-center transition flex-shrink-0"
                :class="cartStore.isAllSelected ? 'bg-primary-700 border-primary-700' : 'border-gray-300 bg-white'"
              >
                <svg v-if="cartStore.isAllSelected" xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
                <span v-else-if="cartStore.hasSelection && !cartStore.isAllSelected" class="w-2 h-2 rounded-sm bg-primary-500" />
              </span>
              Pilih Semua
            </button>
            <span v-if="cartStore.hasSelection" class="text-xs text-gray-500">
              {{ cartStore.selectedIds.size }} produk dipilih
            </span>
          </div>

          <!-- Items list -->
          <div class="bg-white rounded-3xl shadow-card p-4 sm:p-5 space-y-3">
            <CartItem
              v-for="item in cartStore.items"
              :key="item.id"
              :item="item"
              :checked="cartStore.selectedIds.has(item.id)"
              @toggle-check="cartStore.toggleSelect"
              @update-qty="cartStore.updateQty"
              @remove="cartStore.removeItem"
            />
          </div>

          <!-- Voucher -->
          <div class="bg-white rounded-3xl shadow-card p-4 sm:p-5">
            <h3 class="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
              <Ticket class="w-4 h-4 text-primary-600" /> Kode Voucher
            </h3>
            <div class="flex gap-2">
              <input
                v-model="voucherCode"
                type="text"
                placeholder="Masukkan kode voucher..."
                class="flex-1 border border-sand rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 bg-cream"
              />
              <button class="px-5 py-2.5 bg-primary-700 text-white text-sm font-semibold rounded-xl hover:bg-primary-800 transition">
                Pakai
              </button>
            </div>
          </div>
        </div>

        <!-- Order Summary -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-3xl shadow-card p-5 sticky top-24">
            <h2 class="font-bold text-gray-900 mb-4">Ringkasan Belanja</h2>

            <!-- Selected items preview -->
            <div v-if="cartStore.hasSelection" class="space-y-2 mb-4 max-h-40 overflow-y-auto">
              <div
                v-for="item in cartStore.selectedItems"
                :key="item.id"
                class="flex items-center gap-2"
              >
                <img :src="item.image" :alt="item.product_name" class="w-8 h-8 rounded-lg object-cover bg-cream flex-shrink-0" />
                <div class="flex-1 min-w-0">
                  <p class="text-xs font-medium text-gray-800 truncate">{{ item.product_name }}</p>
                  <p class="text-xs text-gray-400">
                    {{ item.variants?.map(v => v.value).join(', ') }}
                    <template v-if="item.variants?.length"> · </template>
                    {{ item.qty }}×
                  </p>
                </div>
                <span class="text-xs font-semibold text-gray-700 flex-shrink-0">{{ formatRupiah(item.subtotal) }}</span>
              </div>
            </div>
            <div v-else class="text-center py-4 mb-4">
              <p class="text-sm text-gray-400">Pilih produk untuk checkout</p>
            </div>

            <div class="space-y-2.5 text-sm border-t border-sand pt-3 mb-4">
              <div class="flex justify-between text-gray-600">
                <span>Subtotal ({{ cartStore.selectedTotalItems }} produk)</span>
                <span>{{ formatRupiah(cartStore.selectedTotalPrice) }}</span>
              </div>
              <div class="flex justify-between text-gray-400 text-xs">
                <span>Ongkos kirim</span>
                <span>Dihitung saat checkout</span>
              </div>
            </div>

            <div class="border-t border-sand pt-3 mb-4">
              <div class="flex justify-between font-bold text-gray-900">
                <span>Total</span>
                <span class="text-primary-700">{{ formatRupiah(cartStore.selectedTotalPrice) }}</span>
              </div>
              <p class="text-xs text-gray-400 mt-0.5">*Belum termasuk ongkir</p>
            </div>

            <NuxtLink
              v-if="cartStore.hasSelection"
              to="/checkout"
              class="block w-full py-3.5 bg-primary-700 text-white text-center font-bold rounded-xl hover:bg-primary-800 transition shadow-sm"
            >
              Checkout ({{ cartStore.selectedTotalItems }})
            </NuxtLink>
            <button
              v-else
              disabled
              class="block w-full py-3.5 bg-gray-200 text-gray-400 text-center font-bold rounded-xl cursor-not-allowed"
            >
              Pilih produk dulu
            </button>

            <NuxtLink to="/products" class="block text-center text-xs text-gray-400 mt-3 hover:text-primary-600">
              ← Lanjut Belanja
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ShoppingBag, Ticket } from 'lucide-vue-next'
import { formatRupiah } from '~/utils/format'

definePageMeta({ middleware: 'auth' })
useSeoMeta({ title: 'Keranjang Belanja' })

const cartStore = useCartStore()
const voucherCode = ref('')
onMounted(() => cartStore.fetchCart())
</script>