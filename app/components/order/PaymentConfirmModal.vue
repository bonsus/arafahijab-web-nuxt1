<template>
  <Teleport to="body">
    <div class="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4" @click.self="emit('close')">
      <div class="bg-white rounded-3xl w-full max-w-md shadow-card-hover">
        <!-- Header -->
        <div class="flex items-center justify-between px-6 py-4 border-b border-sand">
          <h2 class="text-base font-bold text-gray-900">Konfirmasi Pembayaran</h2>
          <button @click="emit('close')" class="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-cream hover:text-gray-600 transition">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
          <!-- Amount -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1.5">Jumlah Transfer</label>
            <input
              v-model.number="form.amount"
              type="number"
              required
              class="w-full bg-cream border border-sand rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:bg-white transition"
              :placeholder="`Total: ${formatRupiah(orderTotal)}`"
            />
          </div>

          <!-- From Name -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1.5">Nama Pengirim</label>
            <input
              v-model="form.from_name"
              type="text"
              required
              class="w-full bg-cream border border-sand rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:bg-white transition"
            />
          </div>

          <!-- From Bank -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1.5">Bank Pengirim</label>
            <input
              v-model="form.from_bank"
              type="text"
              required
              placeholder="BCA / Mandiri / BRI / dll"
              class="w-full bg-cream border border-sand rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:bg-white transition"
            />
          </div>

          <!-- To Bank -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1.5">Transfer ke Rekening</label>
            <div v-if="loadingBanks" class="flex items-center gap-2 py-2">
              <div class="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
              <span class="text-sm text-gray-500">Memuat rekening...</span>
            </div>
            <select
              v-else
              v-model="selectedBankId"
              required
              class="w-full bg-cream border border-sand rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:bg-white transition"
            >
              <option value="" disabled>Pilih rekening tujuan</option>
              <option v-for="bank in banks" :key="bank.id" :value="bank.id">
                {{ bank.name }} - {{ bank.account_number }} ({{ bank.account_name }})
              </option>
            </select>
          </div>

          <!-- Error -->
          <div v-if="errorMsg" class="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">{{ errorMsg }}</div>

          <div class="flex gap-3 pt-1">
            <button
              type="button"
              @click="emit('close')"
              class="flex-1 py-2.5 border border-sand rounded-xl text-sm font-medium text-gray-700 hover:bg-cream transition"
            >
              Batal
            </button>
            <button
              type="submit"
              :disabled="submitting"
              class="flex-1 py-2.5 bg-primary-700 text-white rounded-xl text-sm font-medium hover:bg-primary-800 disabled:opacity-60 transition"
            >
              {{ submitting ? 'Mengirim...' : 'Kirim Konfirmasi' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import type { Bank } from '~/types/api'
import { formatRupiah } from '~/utils/format'

const props = defineProps<{
  orderId: string
  orderTotal: string
}>()

const emit = defineEmits<{
  close: []
  confirmed: []
}>()

const authStore = useAuthStore()

const form = reactive({
  amount: 0,
  from_name: authStore.user?.name ?? '',
  from_bank: '',
})
const selectedBankId = ref('')
const banks = ref<Bank[]>([])
const loadingBanks = ref(true)
const submitting = ref(false)
const errorMsg = ref('')

// Load bank list
onMounted(async () => {
  try {
    const res = await $fetch<{ message: string; data: { data: Bank[] } }>('/api/data/banks')
    banks.value = res.data.data ?? []
  } finally {
    loadingBanks.value = false
  }
})

async function handleSubmit() {
  errorMsg.value = ''
  if (!selectedBankId.value) { errorMsg.value = 'Pilih rekening tujuan'; return }
  const bank = banks.value.find((b) => b.id === selectedBankId.value)
  if (!bank) return

  submitting.value = true
  try {
    await $fetch('/api/checkout/payment-confirmation', {
      method: 'POST',
      headers: { Authorization: `Bearer ${authStore.token}` },
      body: {
        order_id: props.orderId,
        amount: form.amount,
        from_name: form.from_name,
        from_bank: form.from_bank,
        to_bank_id: bank.id,
        to_bank_name: bank.name,
        to_bank_account: bank.account_number,
      },
    })
    emit('confirmed')
  } catch (e: any) {
    errorMsg.value = e?.data?.error ?? 'Gagal mengirim konfirmasi. Coba lagi.'
  } finally {
    submitting.value = false
  }
}
</script>
