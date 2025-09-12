export interface Merchant {
  _id: string
  businessName: string
  businessType: 'individual' | 'company'
  contactPerson: string
  email: string
  phone: string
  address: {
    street: string
    city: string
    state: string
    postalCode: string
    country: string
  }
  businessLicense?: string
  taxId?: string
  bankAccount: {
    accountName: string
    accountNumber: string
    bankName: string
    bankCode: string
  }
  status: 'pending' | 'approved' | 'rejected' | 'suspended'
  commissionRate: number
  createdAt: Date
  updatedAt: Date
  lastLoginAt?: Date
}

export interface MerchantProduct {
  _id: string
  merchantId: string
  name: string
  description: string
  price: number
  comparePrice?: number
  category: string
  subCategory?: string
  images: string[]
  variants?: ProductVariant[]
  inventory: {
    sku: string
    quantity: number
    lowStockThreshold: number
  }
  status: 'draft' | 'active' | 'inactive' | 'out_of_stock'
  featured: boolean
  tags: string[]
  specifications: Record<string, any>
  seo: {
    title?: string
    description?: string
    keywords?: string[]
  }
  createdAt: Date
  updatedAt: Date
}

export interface ProductVariant {
  _id: string
  name: string
  value: string
  price?: number
  sku?: string
  quantity?: number
}

export interface MerchantOrder {
  _id: string
  orderNumber: string
  merchantId: string
  customer: {
    name: string
    email: string
    phone: string
  }
  items: OrderItem[]
  shipping: {
    address: Address
    method: string
    trackingNumber?: string
    carrier?: string
  }
  payment: {
    method: string
    status: 'pending' | 'paid' | 'failed' | 'refunded'
    amount: number
    transactionId?: string
  }
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned'
  total: number
  commission: number
  netAmount: number
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export interface OrderItem {
  productId: string
  productName: string
  variant?: string
  quantity: number
  price: number
  total: number
}

export interface Address {
  street: string
  city: string
  state: string
  postalCode: string
  country: string
}

export interface MerchantAnalytics {
  period: 'daily' | 'weekly' | 'monthly' | 'yearly'
  date: string
  orders: {
    total: number
    pending: number
    completed: number
    cancelled: number
  }
  revenue: {
    gross: number
    net: number
    commission: number
  }
  products: {
    total: number
    active: number
    outOfStock: number
  }
  topProducts: Array<{
    productId: string
    productName: string
    sales: number
    revenue: number
  }>
}

export interface MerchantSettings {
  _id: string
  merchantId: string
  store: {
    name: string
    description: string
    logo?: string
    banner?: string
    theme: 'light' | 'dark'
  }
  notifications: {
    email: boolean
    sms: boolean
    push: boolean
    orderUpdates: boolean
    inventoryAlerts: boolean
    paymentNotifications: boolean
  }
  shipping: {
    freeShippingThreshold: number
    defaultShippingRate: number
    supportedRegions: string[]
  }
  payment: {
    acceptedMethods: string[]
    autoWithdraw: boolean
    withdrawThreshold: number
  }
  seo: {
    metaTitle?: string
    metaDescription?: string
    metaKeywords?: string[]
  }
  updatedAt: Date
}

