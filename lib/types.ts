export interface User {
  _id: string
  email: string
  password: string
  phone?: string
  firstName: string
  lastName: string
  language: 'en' | 'zh-HK'
  currency: 'HKD' | 'USD'
  addresses: Address[]
  createdAt: Date
  updatedAt: Date
}

export interface Address {
  _id: string
  type: 'home' | 'work' | 'other'
  firstName: string
  lastName: string
  company?: string
  address1: string
  address2?: string
  city: string
  state: string
  postalCode: string
  country: string
  phone: string
  isDefault: boolean
}

export interface Category {
  _id: string
  name: {
    en: string
    'zh-HK': string
  }
  slug: string
  parentId?: string
  image?: string
  isActive: boolean
  sortOrder: number
  createdAt: Date
  updatedAt: Date
}

export interface Product {
  _id: string
  name: {
    en: string
    'zh-HK': string
  }
  description: {
    en: string
    'zh-HK': string
  }
  slug: string
  sku: string
  price: number
  compareAtPrice?: number
  costPrice: number
  categoryId: string
  category: Category
  merchantId: string
  merchant: Merchant
  images: string[]
  variants: ProductVariant[]
  tags: string[]
  isActive: boolean
  isFeatured: boolean
  isNew: boolean
  weight: number
  dimensions: {
    length: number
    width: number
    height: number
  }
  reviews?: Review[]
  averageRating?: number
  totalReviews?: number
  seoTitle?: {
    en: string
    'zh-HK': string
  }
  seoDescription?: {
    en: string
    'zh-HK': string
  }
  createdAt: Date
  updatedAt: Date
}

export interface ProductVariant {
  _id: string
  name: {
    en: string
    'zh-HK': string
  }
  sku: string
  price: number
  compareAtPrice?: number
  costPrice: number
  inventory: number
  weight: number
  attributes: Record<string, string>
  isActive: boolean
}

export interface Merchant {
  _id: string
  name: string
  slug: string
  description: {
    en: string
    'zh-HK': string
  }
  logo?: string
  banner?: string
  email: string
  phone: string
  address: {
    street: string
    city: string
    state: string
    postalCode: string
    country: string
  }
  isActive: boolean
  commissionRate: number
  payoutAccount: {
    type: 'bank' | 'paypal'
    accountId: string
    accountName: string
  }
  shippingTemplates: ShippingTemplate[]
  createdAt: Date
  updatedAt: Date
}

export interface ShippingTemplate {
  _id: string
  name: string
  type: 'weight' | 'price' | 'item'
  rules: ShippingRule[]
  isDefault: boolean
}

export interface ShippingRule {
  _id: string
  name: string
  minValue: number
  maxValue?: number
  cost: number
  freeShippingThreshold?: number
  regions: string[]
}

export interface CartItem {
  _id: string
  productId: string
  variantId?: string
  quantity: number
  price: number
  product: Product
  variant?: ProductVariant
}

export interface Order {
  _id: string
  orderNumber: string
  userId: string
  user: User
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
  items: OrderItem[]
  shippingAddress: Address
  billingAddress: Address
  subtotal: number
  shippingCost: number
  tax: number
  total: number
  currency: 'HKD' | 'USD'
  paymentMethod: string
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded'
  paymentId?: string
  shippingMethod: string
  trackingNumber?: string
  carrier?: string
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export interface OrderItem {
  _id: string
  productId: string
  variantId?: string
  product: Product
  variant?: ProductVariant
  quantity: number
  price: number
  total: number
}

export interface Review {
  _id: string
  userId: string
  user: User
  productId: string
  product: Product
  orderId: string
  rating: number
  title: string
  comment: string
  images: string[]
  isVerified: boolean
  helpful: number
  createdAt: Date
  updatedAt: Date
}

export interface Banner {
  _id: string
  title: {
    en: string
    'zh-HK': string
  }
  subtitle?: {
    en: string
    'zh-HK': string
  }
  image: string
  link?: string
  buttonText?: {
    en: string
    'zh-HK': string
  }
  isActive: boolean
  sortOrder: number
  startDate?: Date
  endDate?: Date
  createdAt: Date
  updatedAt: Date
}

