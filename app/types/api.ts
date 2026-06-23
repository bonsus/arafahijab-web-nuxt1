// ─── Generic Response ────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  message: string
  data: T
}

export interface ApiError {
  error: string
  errors?: Record<string, string[]>
}

export interface PaginatedData<T> {
  page: number
  per_page: number
  total_page: number
  total: number
  data: T[]
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface CustomerCategory {
  id: string
  name: string
  discount_percentage: number
}

export interface User {
  id: string
  external_id: string
  email: string
  name: string
  phone: string
  avatar: string
  date_joined: string
  customer_category: CustomerCategory
}

export interface AuthResponse {
  token: string
  user: User
}

// ─── Address ──────────────────────────────────────────────────────────────────

export interface Address {
  id: string
  customer_id: string
  name: string
  phone: string
  country: string
  province: string
  city: string
  district: string
  zipcode: string
  address: string
  primary: boolean
  created_at: string
  updated_at: string
}

export interface AddressForm {
  name: string
  phone?: string
  country?: string
  province: string
  city: string
  district: string
  zipcode?: string
  address: string
  primary?: boolean
}

// ─── Product ──────────────────────────────────────────────────────────────────

export interface ProductCategory {
  id: string
  name: string
  slug: string
  product_count: number
  children: ProductCategory[]
}

export interface ProductVariantDef {
  name: string
  options: string[]
  option_count: number
}

export interface SkuVariant {
  name: string
  value: string
}

export interface PromotionDiscount {
  id: string
  name: string
  date_start: string
  date_end: string
}

export interface FreeItem {
  id: string
  product_id: string
  product_name: string
  product_slug: string
  image: string
  sku_id: string
  sku: string
  variants: SkuVariant[]
  qty: number
  max_qty: number
  stock: number
}

export interface PromotionFreeProduct {
  id: string
  name: string
  date_start: string
  date_end: string
  is_multiple: boolean
  free_items: FreeItem[]
}

export interface Sku {
  id: string
  sku: string
  variants: SkuVariant[]
  image: string
  original_price: string
  price: string
  discount: string
  discount_percentage: number
  stock: number
  sold: number
  wishlist_count: number
  is_wishlist: boolean
  free_shipping: boolean
  free_product: boolean
  promotion_discount: PromotionDiscount | null
  promotion_free_product: PromotionFreeProduct | null
}

export interface ProductListItem {
  id: string
  slug: string
  name: string
  category: ProductCategory
  variants: ProductVariantDef[]
  original_price: string
  price: string
  discount: string
  discount_percentage: number
  stock: number
  sold: number
  wishlist_count: number
  is_wishlist: boolean
  thumbnail: string
  free_shipping: boolean
  free_product: boolean
  promotion_discount: boolean
}

export interface ProductDetail {
  id: string
  slug: string
  name: string
  short_description: string
  description: string
  category: {
    id: string
    name: string
    slug: string
    parent_id: string
    parent_name: string
    parent_slug: string
  }
  variants: ProductVariantDef[]
  stock: number
  sold: number
  wishlist_count: number
  is_wishlist: boolean
  original_prices: { min: string; max: string }
  prices: { min: string; max: string }
  thumbnail: string
  images: string[]
  skus: Sku[]
}

export interface FilterData {
  categories: ProductCategory[]
  variants: unknown[]
  prices: { min: string; max: string }
}

export interface ProductsResponse {
  applied_filters: Record<string, unknown>
  data: PaginatedData<ProductListItem>
}

// ─── Wishlist ─────────────────────────────────────────────────────────────────

export interface WishlistItem {
  product_id: string
  product_name: string
  product_slug: string
  image: string
  category_name: string
  sku_id: string
  sku: string
  variants: SkuVariant[]
  original_price: string
  price: string
  discount: string
  discount_percentage: number
  stock: number
}

// ─── Cart ─────────────────────────────────────────────────────────────────────

export interface CartItem {
  id: string
  product_id: string
  product_name: string
  product_slug: string
  image: string
  category_name: string
  sku_id: string
  sku: string
  variants: SkuVariant[]
  original_price: string
  price: string
  discount: string
  discount_percentage: number
  qty: number
  subtotal: string
  stock: number
  free_shipping?: boolean
  free_product?: boolean
  promotion_free_product?: PromotionFreeProduct | null
}

// ─── Shipping ─────────────────────────────────────────────────────────────────

export interface ShippingOption {
  provider: string
  type: string
  courierName: string
  courierCode: string
  serviceName: string
  serviceCode: string
  cod: boolean
  price: number
  minDuration: number
  maxDuration: number
}

export interface ShippingGroup {
  label: string
  data: ShippingOption[]
}

// ─── Payment ──────────────────────────────────────────────────────────────────

export interface PaymentMethod {
  provider: string
  type: string
  code: string
  name: string
  description: string
  fee: string
  status: string
}

export interface Bank {
  id: string
  name: string
  account_name: string
  account_number: string
}

// ─── Order ────────────────────────────────────────────────────────────────────

export interface OrderAddress {
  id: string
  name: string
  phone: string
  country: string
  province: string
  city: string
  district: string
  address: string
  zipcode: string
}

export interface Shipment {
  id?: string
  courier_code: string
  courier_name: string
  service_code: string
  service_name: string
  price?: string
  total?: string
  tracking_no: string
}

export interface OrderItem {
  product_id: string
  product_name: string
  product_slug: string
  image: string
  category_name: string
  sku_id: string
  sku: string
  variants: SkuVariant[]
  original_price: string
  price: string
  discount: string
  total: string
  qty: number
  is_free: boolean
}

export interface PaymentRecord {
  id: string
  order_id: string
  amount: string
  from_name: string
  from_bank: string
  to_bank_id: string
  to_bank_name: string
  to_bank_account: string
  file: string
  date_created: string
}

export interface XenditPayment {
  id: string
  external_id: string
  date_created: string
  date_expired: string
  amount: number
  method: string
  bank_name: string
  account_name: string
  account_number: string
  qris: string
  url: string
  type: string
  status: string
}

export interface Order {
  id: string
  no: string
  business_id?: string
  store_id?: string
  customer_id?: string
  date_created: string
  date_due: string
  date_paid: string | null
  date_shipped: string | null
  date_delivered: string | null
  date_completed: string | null
  date_canceled: string | null
  status: string
  sub_status: string
  payment_status: string
  source?: string
  customer: { id: string; name: string; phone: string }
  dropship: {
    id?: string
    type: 'regular' | 'marketplace'
    source?: string
    name: string
    phone: string
    file?: string
  } | null
  address: OrderAddress
  shipment: Shipment
  qty: number
  weight: number
  subtotal: string
  discount: string
  shipping_cost: string
  shipping_discount: string
  shipping_total: string
  cod_fee?: string
  total: string
  payment_total: string
  items: OrderItem[]
  payments: PaymentRecord[]
  xendit: XenditPayment | null
}

// ─── Dropship ─────────────────────────────────────────────────────────────────

export interface DropshipCourier {
  courier_code: string
  courier_name: string
}

export interface DropshipState {
  enabled: boolean
  type: 'regular' | 'marketplace'
  name: string
  phone: string
  source: string
  resi: string
  courierCode: string
  courierName: string
  file: File | null
}

// ─── Checkout ─────────────────────────────────────────────────────────────────

export interface CheckoutPayload {
  address_id?: string
  dropship: {
    type: 'regular' | 'marketplace'
    name?: string
    phone?: string
    source?: string
    resi?: string
    courier_code?: string
    courier_name?: string
  } | null
  shipping?: {
    courier_code: string
    courier_name: string
    service_code: string
    service_name: string
    cost: number
  }
  payment: {
    provider: string
    type: string
    code: string
    name: string
  }
  items: { sku_id: string; qty: number }[]
  promotion_checkout_code?: string
  promotion_shipping_code?: string
}

export interface PaymentConfirmationPayload {
  order_id: string
  amount: number
  from_name: string
  from_bank: string
  to_bank_id: string
  to_bank_name: string
  to_bank_account: string
}
