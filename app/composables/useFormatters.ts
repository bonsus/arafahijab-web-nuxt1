import {
  formatRupiah,
  formatDate,
  formatDateTime,
  ORDER_STATUS_LABEL,
  ORDER_STATUS_COLOR,
  PAYMENT_STATUS_LABEL,
  PAYMENT_STATUS_COLOR,
} from '~/utils/format'

export function useFormatters() {
  function getOrderStatusLabel(status: string) {
    return ORDER_STATUS_LABEL[status] ?? status
  }
  function getOrderStatusColor(status: string) {
    return ORDER_STATUS_COLOR[status] ?? 'bg-gray-100 text-gray-600'
  }
  function getPaymentStatusLabel(status: string) {
    return PAYMENT_STATUS_LABEL[status] ?? status
  }
  function getPaymentStatusColor(status: string) {
    return PAYMENT_STATUS_COLOR[status] ?? 'bg-gray-100 text-gray-600'
  }

  return {
    formatRupiah,
    formatDate,
    formatDateTime,
    getOrderStatusLabel,
    getOrderStatusColor,
    getPaymentStatusLabel,
    getPaymentStatusColor,
  }
}
