<template>
  <div>
    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-8">
      <div class="w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
    </div>

    <!-- Empty -->
    <div v-else-if="!addresses.length" class="text-center py-8">
      <p class="text-gray-500 text-sm mb-3">Belum ada alamat tersimpan.</p>
      <button @click="openForm()" class="px-4 py-2 bg-primary-700 text-white text-sm font-semibold rounded-xl hover:bg-primary-800 transition">
        + Tambah Alamat
      </button>
    </div>


    <!-- Address list -->
    <div v-else class="space-y-3">
      <div
        v-for="addr in addresses"
        :key="addr.id"
        :class="modelValue?.id === addr.id
          ? 'border-primary-500 bg-primary-50/60 ring-1 ring-primary-300'
          : 'border-sand bg-white hover:border-primary-300'"
        class="flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition"
        @click="$emit('update:modelValue', addr)"
      >
        <!-- Radio -->
        <span
          class="mt-0.5 w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition"
          :class="modelValue?.id === addr.id ? 'border-primary-600' : 'border-gray-300'"
        >
          <span v-if="modelValue?.id === addr.id" class="w-2 h-2 rounded-full bg-primary-600" />
        </span>

        <!-- Info -->
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 flex-wrap">
            <span class="text-sm font-semibold text-gray-900">{{ addr.name }}</span>
            <span v-if="addr.primary" class="text-[10px] font-bold bg-primary-100 text-primary-700 px-1.5 py-0.5 rounded-full">Utama</span>
          </div>
          <p class="text-xs text-gray-500 mt-0.5">{{ addr.phone }}</p>
          <p class="text-xs text-gray-600 mt-1 leading-relaxed">
            {{ addr.address }}, {{ addr.district }}, {{ addr.city }}, {{ addr.province }} {{ addr.zipcode }}
          </p>
        </div>

        <!-- Actions -->
        <div class="flex flex-col gap-1.5 flex-shrink-0">
          <button
            type="button"
            @click.stop="openForm(addr)"
            class="text-xs text-gray-500 border border-gray-200 px-2.5 py-1 rounded-lg hover:border-primary-400 hover:text-primary-600 transition"
          >Edit</button>
          <button
            v-if="!addr.primary"
            type="button"
            @click.stop="setPrimary(addr.id)"
            class="text-xs text-gray-500 border border-gray-200 px-2.5 py-1 rounded-lg hover:border-primary-400 hover:text-primary-600 transition"
          >Utamakan</button>
        </div>
      </div>

      <!-- Add new address -->
      <button
        @click="openForm()"
        class="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-sand rounded-2xl text-sm text-gray-500 hover:border-primary-400 hover:text-primary-600 transition"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Tambah Alamat Baru
      </button>
    </div>
  </div>

  <!-- Modal: Add / Edit Address -->
  <Teleport to="body">
    <div
      v-if="showForm"
      class="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto"
      @click.self="showForm = false"
    >
      <div class="bg-white rounded-t-3xl sm:rounded-2xl w-full sm:max-w-lg p-6 shadow-xl sm:my-4 max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-5">
          <h2 class="text-lg font-bold text-gray-900">
            {{ editingId ? 'Edit Alamat' : 'Tambah Alamat Baru' }}
          </h2>
          <button @click="showForm = false" class="text-gray-400 hover:text-gray-600 transition">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form @submit.prevent="handleSave" class="space-y-4">
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-medium text-gray-700 mb-1">Nama Penerima *</label>
              <input v-model="form.name" type="text" required class="input-field" placeholder="Nama lengkap" />
              <p v-if="formErrors.name" class="mt-1 text-xs text-red-600">{{ formErrors.name[0] }}</p>
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-700 mb-1">Nomor HP</label>
              <input v-model="form.phone" type="tel" class="input-field" placeholder="08xx..." />
            </div>
          </div>

          <!-- Province -->
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Provinsi *</label>
            <select v-model="form.province" required @change="onProvinceChange" class="input-field">
              <option value="" disabled>Pilih Provinsi</option>
              <option v-for="p in provinces" :key="p" :value="p">{{ p }}</option>
            </select>
            <p v-if="formErrors.province" class="mt-1 text-xs text-red-600">{{ formErrors.province[0] }}</p>
          </div>

          <!-- City -->
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Kota/Kabupaten *</label>
            <select v-model="form.city" required :disabled="!cities.length" @change="onCityChange" class="input-field">
              <option value="" disabled>{{ form.province ? 'Pilih Kota' : 'Pilih provinsi dulu' }}</option>
              <option v-for="c in cities" :key="c" :value="c">{{ c }}</option>
            </select>
            <p v-if="formErrors.city" class="mt-1 text-xs text-red-600">{{ formErrors.city[0] }}</p>
          </div>

          <!-- District -->
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Kecamatan *</label>
            <select v-model="form.district" required :disabled="!districts.length" @change="onDistrictChange" class="input-field">
              <option value="" disabled>{{ form.city ? 'Pilih Kecamatan' : 'Pilih kota dulu' }}</option>
              <option v-for="d in districts" :key="d" :value="d">{{ d }}</option>
            </select>
            <p v-if="formErrors.district" class="mt-1 text-xs text-red-600">{{ formErrors.district[0] }}</p>
          </div>

          <!-- Zipcode -->
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Kode Pos</label>
            <select v-model="form.zipcode" :disabled="!zipcodes.length" class="input-field">
              <option value="" disabled>{{ form.district ? 'Pilih Kode Pos' : 'Pilih kecamatan dulu' }}</option>
              <option v-for="z in zipcodes" :key="z" :value="z">{{ z }}</option>
            </select>
          </div>

          <!-- Full address -->
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Alamat Lengkap *</label>
            <textarea
              v-model="form.address"
              required
              rows="2"
              class="input-field resize-none"
              placeholder="Nama jalan, nomor rumah, gedung, dll"
            />
            <p v-if="formErrors.address" class="mt-1 text-xs text-red-600">{{ formErrors.address[0] }}</p>
          </div>

          <label class="flex items-center gap-2 cursor-pointer">
            <input v-model="form.primary" type="checkbox" class="rounded accent-primary-600" />
            <span class="text-sm text-gray-700">Jadikan alamat utama</span>
          </label>

          <p v-if="globalError" class="text-sm text-red-600">{{ globalError }}</p>

          <div class="flex gap-3 pt-1">
            <button
              type="button"
              @click="showForm = false"
              class="flex-1 py-2.5 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50"
            >Batal</button>
            <button
              type="submit"
              :disabled="saving"
              class="flex-1 py-2.5 bg-primary-700 text-white rounded-xl text-sm font-medium hover:bg-primary-800 disabled:opacity-60 transition"
            >{{ saving ? 'Menyimpan...' : 'Simpan' }}</button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import type { Address } from '~/types/api'

const props = defineProps<{
  addresses: Address[]
  modelValue: Address | null
  loading?: boolean
}>()
const emit = defineEmits<{
  'update:modelValue': [addr: Address]
  refresh: []
}>()

const authStore = useAuthStore()
const token = useCookie('arafahijab_token')
const authHeaders = () => ({ Authorization: `Bearer ${token.value}` })

async function setPrimary(id: string) {
  await $fetch(`/api/auth/addresses/${id}/primary`, { method: 'PUT', headers: authHeaders() })
  emit('refresh')
}

// ── Form ──────────────────────────────────────────────────────────────────────
const showForm = ref(false)
const editingId = ref<string | null>(null)
const saving = ref(false)
const globalError = ref('')
const formErrors = reactive<Record<string, string[]>>({})

const form = reactive({
  name: '',
  phone: '',
  country: 'Indonesia',
  province: '',
  city: '',
  district: '',
  zipcode: '',
  address: '',
  primary: false,
})

// Cascading location data
const provinces = ref<string[]>([])
const cities = ref<string[]>([])
const districts = ref<string[]>([])
const zipcodes = ref<string[]>([])

async function onProvinceChange() {
  form.city = ''; form.district = ''; form.zipcode = ''
  cities.value = []; districts.value = []; zipcodes.value = []
  if (!form.province) return
  const res = await $fetch<{ message: string; data: { cities: string[] } }>(
    `/api/data/cities?province=${encodeURIComponent(form.province)}`,
    { headers: authHeaders() }
  )
  cities.value = res.data.cities
}

async function onCityChange() {
  form.district = ''; form.zipcode = ''
  districts.value = []; zipcodes.value = []
  if (!form.city) return
  const res = await $fetch<{ message: string; data: { districts: string[] } }>(
    `/api/data/districts?province=${encodeURIComponent(form.province)}&city=${encodeURIComponent(form.city)}`,
    { headers: authHeaders() }
  )
  districts.value = res.data.districts
}

async function onDistrictChange() {
  form.zipcode = ''; zipcodes.value = []
  if (!form.district) return
  const res = await $fetch<{ message: string; data: { zipcodes: string[] } }>(
    `/api/data/zipcodes?province=${encodeURIComponent(form.province)}&city=${encodeURIComponent(form.city)}&district=${encodeURIComponent(form.district)}`,
    { headers: authHeaders() }
  )
  zipcodes.value = res.data.zipcodes
  if (zipcodes.value.length === 1) form.zipcode = zipcodes.value[0]
}

function openForm(addr?: Address) {
  Object.keys(formErrors).forEach((k) => delete formErrors[k])
  globalError.value = ''
  if (addr) {
    editingId.value = addr.id
    Object.assign(form, {
      name: addr.name, phone: addr.phone, country: addr.country || 'Indonesia',
      province: addr.province, city: addr.city, district: addr.district,
      zipcode: addr.zipcode, address: addr.address, primary: addr.primary,
    })
    // preload cascading data
    if (addr.province) {
      $fetch<{ message: string; data: { cities: string[] } }>(
        `/api/data/cities?province=${encodeURIComponent(addr.province)}`,
        { headers: authHeaders() }
      ).then((r) => { cities.value = r.data.cities })
    }
    if (addr.city) {
      $fetch<{ message: string; data: { districts: string[] } }>(
        `/api/data/districts?province=${encodeURIComponent(addr.province)}&city=${encodeURIComponent(addr.city)}`,
        { headers: authHeaders() }
      ).then((r) => { districts.value = r.data.districts })
    }
    if (addr.district) {
      $fetch<{ message: string; data: { zipcodes: string[] } }>(
        `/api/data/zipcodes?province=${encodeURIComponent(addr.province)}&city=${encodeURIComponent(addr.city)}&district=${encodeURIComponent(addr.district)}`,
        { headers: authHeaders() }
      ).then((r) => { zipcodes.value = r.data.zipcodes })
    }
  } else {
    editingId.value = null
    Object.assign(form, { name: '', phone: '', country: 'Indonesia', province: '', city: '', district: '', zipcode: '', address: '', primary: false })
    cities.value = []; districts.value = []; zipcodes.value = []
  }
  // load provinces lazily on first open
  if (!provinces.value.length) {
    $fetch<{ message: string; data: { provinces: string[] } }>('/api/data/provinces', { headers: authHeaders() })
      .then((r) => { provinces.value = r.data.provinces })
  }
  showForm.value = true
}

async function handleSave() {
  Object.keys(formErrors).forEach((k) => delete formErrors[k])
  globalError.value = ''
  saving.value = true
  try {
    if (editingId.value) {
      await $fetch(`/api/auth/addresses/${editingId.value}`, {
        method: 'PUT', headers: authHeaders(), body: { ...form },
      })
    } else {
      await $fetch('/api/auth/addresses', {
        method: 'POST', headers: authHeaders(), body: { ...form },
      })
    }
    showForm.value = false
    emit('refresh')
  } catch (e: any) {
    if (e?.data?.errors) Object.assign(formErrors, e.data.errors)
    else globalError.value = e?.data?.error ?? 'Gagal menyimpan alamat.'
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.input-field {
  @apply w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white;
}
</style>
