<template>
  <div class="bg-white rounded-3xl shadow-card p-5">
    <!-- Header with toggle -->
    <div class="flex items-center justify-between gap-2">
      <div class="flex items-center gap-2">
        <div class="w-6 h-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-xs font-bold">D</div>
        <h2 class="font-bold text-gray-900">Dropship</h2>
        <span class="text-sm text-gray-400 font-normal">(opsional)</span>
      </div>
      <button
        type="button"
        role="switch"
        :aria-checked="enabled"
        @click="toggleEnabled"
        :class="['relative inline-flex h-5 w-9 flex-shrink-0 items-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
          enabled ? 'bg-primary-600' : 'bg-gray-200']"
      >
        <span
          :class="['inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform',
            enabled ? 'translate-x-4' : 'translate-x-0.5']"
        />
      </button>
    </div>

    <!-- Form -->
    <Transition name="ds-expand">
      <div v-if="enabled" class="mt-4 space-y-4">
        <!-- Type tabs -->
        <div class="flex gap-1 bg-sand rounded-xl p-1">
          <button
            v-for="t in dropshipTypes"
            :key="t.value"
            type="button"
            @click="selectType(t.value)"
            :class="['flex-1 py-2 rounded-lg text-sm font-semibold transition',
              type === t.value
                ? 'bg-white text-primary-700 shadow-sm'
                : 'text-gray-500 hover:text-gray-700']"
          >{{ t.label }}</button>
        </div>

        <!-- Regular fields -->
        <template v-if="type === 'regular'">
          <div>
            <label class="block text-xs font-medium text-gray-500 mb-1.5">
              Nama Pengirim <span class="text-red-500">*</span>
            </label>
            <input
              v-model="name"
              type="text"
              placeholder="Nama toko / dropshipper"
              class="w-full border border-sand rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 bg-cream"
            />
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-500 mb-1.5">
              No. HP Pengirim <span class="text-red-500">*</span>
            </label>
            <input
              v-model="phone"
              type="tel"
              placeholder="08xxxxxxxxxx"
              class="w-full border border-sand rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 bg-cream"
            />
          </div>
        </template>

        <!-- Marketplace fields -->
        <template v-else>
          <!-- Source -->
          <div>
            <label class="block text-xs font-medium text-gray-500 mb-1.5">
              Sumber Marketplace <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <select
                v-model="source"
                class="w-full border border-sand rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 bg-cream appearance-none pr-8"
              >
                <option value="" disabled>Pilih marketplace...</option>
                <option v-for="s in marketplaceSources" :key="s.value" :value="s.value">{{ s.label }}</option>
              </select>
              <div class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <!-- Courier -->
          <div>
            <label class="block text-xs font-medium text-gray-500 mb-1.5">
              Kurir <span class="text-red-500">*</span>
            </label>
            <div class="flex gap-2">
              <div class="relative flex-1">
                <select
                  v-model="courierCode"
                  :disabled="loadingCouriers"
                  class="w-full border border-sand rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 bg-cream appearance-none pr-8 disabled:opacity-60"
                >
                  <option value="" disabled>
                    {{ loadingCouriers ? 'Memuat kurir...' : couriers.length ? 'Pilih kurir...' : 'Tidak ada kurir tersedia' }}
                  </option>
                  <option v-for="c in couriers" :key="c.courier_code" :value="c.courier_code">{{ c.courier_name }}</option>
                </select>
                <div class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              <!-- Retry button when couriers failed to load -->
              <button
                v-if="!loadingCouriers && !couriers.length"
                type="button"
                @click="$emit('reload-couriers')"
                class="flex-shrink-0 px-3 py-2.5 text-xs font-semibold text-primary-700 border border-primary-300 rounded-xl hover:bg-primary-50 transition"
              >Muat ulang</button>
            </div>
          </div>

          <!-- Resi -->
          <div>
            <label class="block text-xs font-medium text-gray-500 mb-1.5">
              Nomor Resi <span class="text-red-500">*</span>
            </label>
            <input
              v-model="resi"
              type="text"
              placeholder="Nomor resi dari marketplace"
              class="w-full border border-sand rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 bg-cream"
            />
          </div>

          <!-- PDF Label upload -->
          <div>
            <label class="block text-xs font-medium text-gray-500 mb-1.5">
              Label Pengiriman (PDF) <span class="text-red-500">*</span>
            </label>
            <div
              class="relative w-full rounded-xl border-2 transition cursor-pointer"
              :class="labelFile
                ? 'border-primary-400 bg-primary-50'
                : 'border-dashed border-sand bg-cream hover:border-primary-400'"
              @click="fileInput?.click()"
              @dragover.prevent
              @drop.prevent="onDrop"
            >
              <input
                ref="fileInput"
                type="file"
                accept=".pdf,application/pdf"
                class="hidden"
                @change="onFileChange"
              />
              <div class="flex items-center gap-3 px-4 py-3.5">
                <template v-if="labelFile">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span class="flex-1 text-sm font-medium text-gray-800 truncate">{{ labelFile.name }}</span>
                  <button
                    type="button"
                    @click.stop="clearFile"
                    class="flex-shrink-0 text-gray-400 hover:text-red-500 transition p-0.5"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </template>
                <template v-else>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <div>
                    <p class="text-sm text-gray-600">Klik atau seret file PDF label</p>
                    <p class="text-xs text-gray-400 mt-0.5">Hanya file .pdf</p>
                  </div>
                </template>
              </div>
            </div>
          </div>
        </template>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import type { DropshipCourier, DropshipState } from '~/types/api'

const props = defineProps<{
  couriers: DropshipCourier[]
  loadingCouriers: boolean
}>()

const emit = defineEmits<{
  change: [state: DropshipState]
  'reload-couriers': []
}>()

const dropshipTypes = [
  { value: 'regular' as const, label: 'Regular' },
  { value: 'marketplace' as const, label: 'Marketplace' },
]

const marketplaceSources = [
  { value: 'shopee', label: 'Shopee' },
  { value: 'tiktok', label: 'TikTok Shop' },
  { value: 'lazada', label: 'Lazada' },
  { value: 'tokopedia', label: 'Tokopedia' },
  { value: 'lainnya', label: 'Lainnya' },
]

const enabled = ref(false)
const type = ref<'regular' | 'marketplace'>('regular')
const name = ref('')
const phone = ref('')
const source = ref('')
const resi = ref('')
const courierCode = ref('')
const courierName = ref('')
const labelFile = ref<File | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)

function emitChange() {
  emit('change', {
    enabled: enabled.value,
    type: type.value,
    name: name.value,
    phone: phone.value,
    source: source.value,
    resi: resi.value,
    courierCode: courierCode.value,
    courierName: courierName.value,
    file: labelFile.value,
  })
}

function toggleEnabled() {
  enabled.value = !enabled.value
  emitChange()
}

function selectType(t: 'regular' | 'marketplace') {
  type.value = t
  emitChange()
}

watch(courierCode, (code) => {
  const found = props.couriers.find(c => c.courier_code === code)
  courierName.value = found?.courier_name ?? ''
  emitChange()
})

watch([name, phone, source, resi], emitChange)

function onFileChange(e: Event) {
  const f = (e.target as HTMLInputElement).files?.[0] ?? null
  if (f && f.type !== 'application/pdf') return
  labelFile.value = f
  emitChange()
}

function onDrop(e: DragEvent) {
  const f = e.dataTransfer?.files[0] ?? null
  if (f?.type === 'application/pdf') {
    labelFile.value = f
    emitChange()
  }
}

function clearFile() {
  labelFile.value = null
  if (fileInput.value) fileInput.value.value = ''
  emitChange()
}
</script>

<style scoped>
.ds-expand-enter-active,
.ds-expand-leave-active {
  transition: opacity 0.2s ease, max-height 0.25s ease;
  overflow: hidden;
  max-height: 900px;
}
.ds-expand-enter-from,
.ds-expand-leave-to {
  opacity: 0;
  max-height: 0;
}
</style>
