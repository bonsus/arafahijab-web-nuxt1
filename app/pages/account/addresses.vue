<template>
  <NuxtLayout name="default">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">

        <!-- Sidebar -->
        <div class="md:col-span-1">
          <AccountSidebar />
        </div>

        <!-- Content -->
        <div class="md:col-span-3">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Alamat Saya</h1>
        <button
          @click="openForm()"
          class="flex items-center gap-2 px-4 py-2 bg-primary-700 text-white text-sm font-semibold rounded-xl hover:bg-primary-800 transition"
        >
          + Tambah Alamat
        </button>
      </div>

      <LoadingSpinner v-if="loading" />

      <div v-else-if="!addresses.length" class="text-center py-16">
        <p class="text-gray-500 mb-4">Belum ada alamat tersimpan</p>
        <button @click="openForm()" class="text-primary-600 hover:underline text-sm">+ Tambah Alamat</button>
      </div>

      <div v-else class="space-y-3">
        <div
          v-for="addr in addresses"
          :key="addr.id"
          class="bg-white rounded-2xl border border-gray-200 p-5"
        >
          <div class="flex items-start justify-between gap-4 flex-wrap">
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-1">
                <span class="font-semibold text-gray-900">{{ addr.name }}</span>
                <span v-if="addr.primary" class="text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full">Utama</span>
              </div>
              <p class="text-sm text-gray-500">{{ addr.phone }}</p>
              <p class="text-sm text-gray-700 mt-1 leading-relaxed">
                {{ addr.address }}, {{ addr.district }}, {{ addr.city }}, {{ addr.province }} {{ addr.zipcode }}
              </p>
            </div>
            <div class="flex gap-2 flex-wrap">
              <button
                v-if="!addr.primary"
                @click="setPrimary(addr.id)"
                class="text-xs text-gray-600 border border-gray-300 px-3 py-1.5 rounded-lg hover:border-primary-500 hover:text-primary-600 transition"
              >
                Jadikan Utama
              </button>
              <button
                @click="openForm(addr)"
                class="text-xs text-gray-600 border border-gray-300 px-3 py-1.5 rounded-lg hover:border-primary-500 hover:text-primary-600 transition"
              >
                Edit
              </button>
              <button
                @click="deleteAddress(addr.id)"
                class="text-xs text-red-500 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-50 transition"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
        </div>
      </div>
      </div>
    </div>

    <!-- Address Form Modal -->
    <Teleport to="body">
      <div
        v-if="showForm"
        class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto"
        @click.self="showForm = false"
      >
        <div class="bg-white rounded-2xl w-full max-w-lg p-6 shadow-xl my-4">
          <h2 class="text-lg font-bold text-gray-900 mb-5">
            {{ editingId ? 'Edit Alamat' : 'Tambah Alamat Baru' }}
          </h2>

          <form @submit.prevent="handleSaveAddress" class="space-y-4">
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-medium text-gray-700 mb-1">Nama Penerima *</label>
                <input v-model="addrForm.name" type="text" required class="input-field" />
                <p v-if="addrErrors.name" class="mt-1 text-xs text-red-600">{{ addrErrors.name[0] }}</p>
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-700 mb-1">Nomor HP</label>
                <input v-model="addrForm.phone" type="tel" class="input-field" />
              </div>
            </div>

            <div>
              <label class="block text-xs font-medium text-gray-700 mb-1">Provinsi *</label>
              <select v-model="addrForm.province" required @change="onProvinceChange" class="input-field">
                <option value="" disabled>Pilih Provinsi</option>
                <option v-for="p in provinces" :key="p" :value="p">{{ p }}</option>
              </select>
              <p v-if="addrErrors.province" class="mt-1 text-xs text-red-600">{{ addrErrors.province[0] }}</p>
            </div>

            <div>
              <label class="block text-xs font-medium text-gray-700 mb-1">Kota/Kabupaten *</label>
              <select v-model="addrForm.city" required :disabled="!cities.length" @change="onCityChange" class="input-field">
                <option value="" disabled>Pilih Kota</option>
                <option v-for="c in cities" :key="c" :value="c">{{ c }}</option>
              </select>
              <p v-if="addrErrors.city" class="mt-1 text-xs text-red-600">{{ addrErrors.city[0] }}</p>
            </div>

            <div>
              <label class="block text-xs font-medium text-gray-700 mb-1">Kecamatan *</label>
              <select v-model="addrForm.district" required :disabled="!districts.length" @change="onDistrictChange" class="input-field">
                <option value="" disabled>Pilih Kecamatan</option>
                <option v-for="d in districts" :key="d" :value="d">{{ d }}</option>
              </select>
              <p v-if="addrErrors.district" class="mt-1 text-xs text-red-600">{{ addrErrors.district[0] }}</p>
            </div>

            <div>
              <label class="block text-xs font-medium text-gray-700 mb-1">Kode Pos</label>
              <select v-model="addrForm.zipcode" :disabled="!zipcodes.length" class="input-field">
                <option value="">Pilih Kode Pos</option>
                <option v-for="z in zipcodes" :key="z" :value="z">{{ z }}</option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-medium text-gray-700 mb-1">Alamat Lengkap *</label>
              <textarea
                v-model="addrForm.address"
                required
                rows="2"
                class="input-field resize-none"
                placeholder="Nama jalan, nomor, gedung, dll"
              />
              <p v-if="addrErrors.address" class="mt-1 text-xs text-red-600">{{ addrErrors.address[0] }}</p>
            </div>

            <label class="flex items-center gap-2 cursor-pointer">
              <input v-model="addrForm.primary" type="checkbox" class="rounded text-primary-600" />
              <span class="text-sm text-gray-700">Jadikan alamat utama</span>
            </label>

            <p v-if="addrGlobalError" class="text-sm text-red-600">{{ addrGlobalError }}</p>

            <div class="flex gap-3 pt-2">
              <button type="button" @click="showForm = false" class="flex-1 py-2.5 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50">
                Batal
              </button>
              <button type="submit" :disabled="savingAddr" class="flex-1 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700 disabled:opacity-60 transition">
                {{ savingAddr ? 'Menyimpan...' : 'Simpan' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>
  </NuxtLayout>
</template>

<script setup lang="ts">
import type { Address } from '~/types/api'

definePageMeta({ middleware: 'auth' })
useSeoMeta({ title: 'Alamat Saya' })

const authStore = useAuthStore()

const addresses = ref<Address[]>([])
const loading = ref(true)
const showForm = ref(false)
const editingId = ref<string | null>(null)

const addrForm = reactive({
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
const addrErrors = reactive<Record<string, string[]>>({})
const addrGlobalError = ref('')
const savingAddr = ref(false)

// Location data
const provinces = ref<string[]>([])
const cities = ref<string[]>([])
const districts = ref<string[]>([])
const zipcodes = ref<string[]>([])

function authHeaders() {
  return { Authorization: `Bearer ${authStore.token}` }
}

async function loadAddresses() {
  try {
    const res = await $fetch<{ message: string; data: Address[] }>(
      '/api/auth/addresses',
      { headers: authHeaders() }
    )
    addresses.value = res.data ?? []
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await loadAddresses()
  // Load provinces
  const res = await $fetch<{ message: string; data: { provinces: string[] } }>('/api/data/provinces', { headers: authHeaders() })
  provinces.value = res.data.provinces
})

async function onProvinceChange() {
  addrForm.city = ''
  addrForm.district = ''
  addrForm.zipcode = ''
  cities.value = []
  districts.value = []
  zipcodes.value = []
  if (!addrForm.province) return
  const res = await $fetch<{ message: string; data: { cities: string[] } }>(
    `/api/data/cities?province=${encodeURIComponent(addrForm.province)}`,
    { headers: authHeaders() }
  )
  cities.value = res.data.cities
}

async function onCityChange() {
  addrForm.district = ''
  addrForm.zipcode = ''
  districts.value = []
  zipcodes.value = []
  if (!addrForm.city) return
  const res = await $fetch<{ message: string; data: { districts: string[] } }>(
    `/api/data/districts?province=${encodeURIComponent(addrForm.province)}&city=${encodeURIComponent(addrForm.city)}`,
    { headers: authHeaders() }
  )
  districts.value = res.data.districts
}

async function onDistrictChange() {
  addrForm.zipcode = ''
  zipcodes.value = []
  if (!addrForm.district) return
  const res = await $fetch<{ message: string; data: { zipcodes: string[] } }>(
    `/api/data/zipcodes?province=${encodeURIComponent(addrForm.province)}&city=${encodeURIComponent(addrForm.city)}&district=${encodeURIComponent(addrForm.district)}`,
    { headers: authHeaders() }
  )
  zipcodes.value = res.data.zipcodes
  if (zipcodes.value.length === 1) addrForm.zipcode = zipcodes.value[0]
}

function openForm(addr?: Address) {
  Object.keys(addrErrors).forEach((k) => delete addrErrors[k])
  addrGlobalError.value = ''

  if (addr) {
    editingId.value = addr.id
    addrForm.name = addr.name
    addrForm.phone = addr.phone
    addrForm.province = addr.province
    addrForm.city = addr.city
    addrForm.district = addr.district
    addrForm.zipcode = addr.zipcode
    addrForm.address = addr.address
    addrForm.primary = addr.primary
    addrForm.country = addr.country || 'Indonesia'
  } else {
    editingId.value = null
    Object.assign(addrForm, { name: '', phone: '', country: 'Indonesia', province: '', city: '', district: '', zipcode: '', address: '', primary: false })
  }
  showForm.value = true
}

async function handleSaveAddress() {
  Object.keys(addrErrors).forEach((k) => delete addrErrors[k])
  addrGlobalError.value = ''
  savingAddr.value = true
  try {
    const body = { ...addrForm }
    if (editingId.value) {
      await $fetch(`/api/auth/addresses/${editingId.value}`, {
        method: 'PUT',
        headers: authHeaders(),
        body,
      })
    } else {
      await $fetch('/api/auth/addresses', {
        method: 'POST',
        headers: authHeaders(),
        body,
      })
    }
    showForm.value = false
    await loadAddresses()
  } catch (e: any) {
    if (e?.data?.errors) Object.assign(addrErrors, e.data.errors)
    else addrGlobalError.value = e?.data?.error ?? 'Gagal menyimpan alamat.'
  } finally {
    savingAddr.value = false
  }
}

async function setPrimary(id: string) {
  await $fetch(`/api/auth/addresses/${id}/primary`, {
    method: 'PUT',
    headers: authHeaders(),
  })
  await loadAddresses()
}

async function deleteAddress(id: string) {
  if (!confirm('Hapus alamat ini?')) return
  await $fetch(`/api/auth/addresses/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  })
  await loadAddresses()
}
</script>

<style scoped>
.input-field {
  @apply w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white;
}
</style>
