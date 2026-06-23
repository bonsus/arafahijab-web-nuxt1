<template>
  <NuxtLayout name="default">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

      <!-- Header -->
      <div class="mb-5">
        <h1 class="text-2xl font-bold text-gray-900">Cek Ongkir</h1>
        <p class="text-sm text-gray-400 mt-0.5">Hitung estimasi biaya pengiriman ke alamat tujuan</p>
      </div>

      <!-- Form -->
      <div class="bg-white rounded-2xl shadow-card p-5 space-y-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <!-- Province -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Provinsi</label>
            <select
              v-model="form.province"
              @change="onProvinceChange"
              class="w-full border border-sand rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 bg-cream"
            >
              <option value="">Pilih Provinsi</option>
              <option v-for="p in provinces" :key="p" :value="p">{{ p }}</option>
            </select>
          </div>

          <!-- City -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Kota / Kabupaten</label>
            <select
              v-model="form.city"
              @change="onCityChange"
              :disabled="!form.province"
              class="w-full border border-sand rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 bg-cream disabled:opacity-50"
            >
              <option value="">Pilih Kota / Kabupaten</option>
              <option v-for="c in cities" :key="c" :value="c">{{ c }}</option>
            </select>
          </div>

          <!-- District -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Kecamatan</label>
            <select
              v-model="form.district"
              @change="onDistrictChange"
              :disabled="!form.city"
              class="w-full border border-sand rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 bg-cream disabled:opacity-50"
            >
              <option value="">Pilih Kecamatan</option>
              <option v-for="d in districts" :key="d" :value="d">{{ d }}</option>
            </select>
          </div>

          <!-- Zipcode -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Kode Pos <span class="text-gray-300">(opsional)</span></label>
            <select
              v-model="form.zipcode"
              :disabled="!form.district"
              class="w-full border border-sand rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 bg-cream disabled:opacity-50"
            >
              <option value="">Pilih Kode Pos</option>
              <option v-for="z in zipcodes" :key="z" :value="z">{{ z }}</option>
            </select>
          </div>

          <!-- Weight -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Berat (gram)</label>
            <input
              v-model.number="form.weight"
              type="number"
              min="1"
              placeholder="contoh: 1000"
              class="w-full border border-sand rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 bg-cream"
            />
          </div>
        </div>

        <p v-if="error" class="text-sm text-red-500">{{ error }}</p>

        <button
          type="button"
          @click="checkOngkir"
          :disabled="!canSubmit || loading"
          class="w-full sm:w-auto bg-primary-700 hover:bg-primary-800 text-white font-semibold px-6 py-2.5 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ loading ? 'Menghitung...' : 'Cek Ongkir' }}
        </button>
      </div>

      <!-- Results -->
      <div v-if="searched" class="mt-6">
        <div v-if="loading" class="py-10">
          <LoadingSpinner />
        </div>

        <div v-else-if="!groups.length" class="text-center py-16 bg-white rounded-2xl shadow-card">
          <div class="w-16 h-16 rounded-full bg-cream-dark flex items-center justify-center mx-auto mb-3">
            <Truck class="w-8 h-8 text-primary-400" />
          </div>
          <p class="text-gray-500 font-medium">Tidak ada layanan pengiriman tersedia</p>
          <p class="text-sm text-gray-400 mt-1">Coba ubah alamat atau berat paket.</p>
        </div>

        <div v-else class="space-y-5">
          <div v-for="group in groups" :key="group.label">
            <h2 class="text-sm font-bold text-gray-700 mb-2">{{ group.label }}</h2>
            <div class="space-y-2">
              <div
                v-for="(opt, i) in group.data"
                :key="`${group.label}-${i}`"
                class="bg-white rounded-2xl shadow-card p-4 flex items-center justify-between gap-3"
              >
                <div class="min-w-0">
                  <div class="flex items-center gap-2 flex-wrap">
                    <p class="text-sm font-semibold text-gray-900">{{ opt.courierName }}</p>
                    <span class="text-xs text-gray-400">{{ opt.serviceName }}</span>
                    <span v-if="opt.cod" class="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-700">COD</span>
                  </div>
                  <p class="text-xs text-gray-400 mt-0.5">
                    Estimasi {{ opt.minDuration }}<template v-if="opt.maxDuration && opt.maxDuration !== opt.minDuration">–{{ opt.maxDuration }}</template> hari
                  </p>
                </div>
                <p class="text-base font-bold text-primary-700 flex-shrink-0">{{ formatRupiah(opt.price) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { Truck } from 'lucide-vue-next'
import type { ShippingGroup } from '~/types/api'
import { formatRupiah } from '~/utils/format'
import LoadingSpinner from '~/components/ui/LoadingSpinner.vue'

useSeoMeta({ title: 'Cek Ongkir' })

const form = reactive({
  province: '',
  city: '',
  district: '',
  zipcode: '',
  weight: 1000,
})

const provinces = ref<string[]>([])
const cities = ref<string[]>([])
const districts = ref<string[]>([])
const zipcodes = ref<string[]>([])

const loading = ref(false)
const searched = ref(false)
const error = ref('')
const groups = ref<ShippingGroup[]>([])

const canSubmit = computed(() =>
  !!form.province && !!form.city && !!form.district && !!form.weight && form.weight > 0
)

// Load provinces on mount
onMounted(async () => {
  const res = await $fetch<{ message: string; data: { provinces: string[] } }>('/api/data/provinces')
  provinces.value = res.data.provinces
})

async function onProvinceChange() {
  form.city = ''; form.district = ''; form.zipcode = ''
  cities.value = []; districts.value = []; zipcodes.value = []
  if (!form.province) return
  const res = await $fetch<{ message: string; data: { cities: string[] } }>(
    `/api/data/cities?province=${encodeURIComponent(form.province)}`
  )
  cities.value = res.data.cities
}

async function onCityChange() {
  form.district = ''; form.zipcode = ''
  districts.value = []; zipcodes.value = []
  if (!form.city) return
  const res = await $fetch<{ message: string; data: { districts: string[] } }>(
    `/api/data/districts?province=${encodeURIComponent(form.province)}&city=${encodeURIComponent(form.city)}`
  )
  districts.value = res.data.districts
}

async function onDistrictChange() {
  form.zipcode = ''; zipcodes.value = []
  if (!form.district) return
  const res = await $fetch<{ message: string; data: { zipcodes: string[] } }>(
    `/api/data/zipcodes?province=${encodeURIComponent(form.province)}&city=${encodeURIComponent(form.city)}&district=${encodeURIComponent(form.district)}`
  )
  zipcodes.value = res.data.zipcodes
  if (zipcodes.value.length === 1) form.zipcode = zipcodes.value[0] ?? ''
}

async function checkOngkir() {
  if (!canSubmit.value) return
  error.value = ''
  loading.value = true
  searched.value = true
  groups.value = []
  try {
    const res = await $fetch<{ message: string; data: { data: ShippingGroup[] } }>(
      '/api/data/shipping-fee',
      {
        method: 'POST',
        body: {
          province: form.province,
          city: form.city,
          district: form.district,
          zipcode: form.zipcode || undefined,
          weight: form.weight,
        },
      }
    )
    groups.value = res.data.data ?? []
  } catch (e: any) {
    error.value = e?.data?.error ?? 'Gagal menghitung ongkir. Coba lagi.'
    groups.value = []
  } finally {
    loading.value = false
  }
}
</script>
