/**
 * Format angka ke format Rupiah: Rp 75.000
 */
export function formatRupiah(value: string | number): string {
  const num = typeof value === 'string' ? parseFloat(value) : value
  if (isNaN(num)) return 'Rp 0'
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num)
}

/**
 * Format ISO date ke format Indonesia: 18 Juni 2024
 */
export function formatDate(iso: string | null | undefined): string {
  if (!iso) return '-'
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(iso))
}

/**
 * Format ISO date + waktu: 18 Juni 2024, 10.00 WIB
 */
export function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return '-'
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
  }).format(new Date(iso))
}

export const ORDER_STATUS_LABEL: Record<string, string> = {
  pending: 'Menunggu Konfirmasi',
  processing: 'Diproses',
  packed: 'Dikemas',
  ready: 'Siap Kirim',
  shipped: 'Dikirim',
  delivered: 'Diterima',
  completed: 'Selesai',
  canceled: 'Dibatalkan',
}

export const ORDER_STATUS_COLOR: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  packed: 'bg-indigo-100 text-indigo-800',
  ready: 'bg-purple-100 text-purple-800',
  shipped: 'bg-cyan-100 text-cyan-800',
  delivered: 'bg-green-100 text-green-800',
  completed: 'bg-green-200 text-green-900',
  canceled: 'bg-red-100 text-red-800',
}

export const PAYMENT_STATUS_LABEL: Record<string, string> = {
  unpaid: 'Belum Bayar',
  paid: 'Lunas',
  partial: 'Bayar Sebagian',
  refunded: 'Refund',
}

export const PAYMENT_STATUS_COLOR: Record<string, string> = {
  unpaid: 'bg-red-100 text-red-800',
  paid: 'bg-green-100 text-green-800',
  partial: 'bg-yellow-100 text-yellow-800',
  refunded: 'bg-gray-100 text-gray-800',
}
