export interface Admin {
  _id: string
  username: string
  email: string
  role: 'super_admin' | 'admin' | 'moderator'
  permissions: string[]
  lastLoginAt?: Date
  createdAt: Date
  updatedAt: Date
}

export interface AdminDashboardStats {
  totalMerchants: number
  activeMerchants: number
  pendingMerchants: number
  totalOrders: number
  totalRevenue: number
  platformCommission: number
  totalProducts: number
  activeProducts: number
  totalCustomers: number
  recentActivity: Array<{
    id: string
    type: 'merchant_registered' | 'order_placed' | 'product_added' | 'payment_received'
    description: string
    timestamp: Date
    metadata?: any
  }>
}

export interface MerchantManagement {
  _id: string
  businessName: string
  contactPerson: string
  email: string
  phone: string
  status: 'pending' | 'approved' | 'rejected' | 'suspended'
  commissionRate: number
  totalOrders: number
  totalRevenue: number
  lastActiveAt?: Date
  createdAt: Date
  updatedAt: Date
}

export interface OrderManagement {
  _id: string
  orderNumber: string
  merchant: {
    _id: string
    businessName: string
  }
  customer: {
    name: string
    email: string
    phone: string
  }
  items: Array<{
    productId: string
    productName: string
    quantity: number
    price: number
    total: number
  }>
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned'
  payment: {
    method: string
    status: 'pending' | 'paid' | 'failed' | 'refunded'
    amount: number
  }
  total: number
  commission: number
  netAmount: number
  createdAt: Date
  updatedAt: Date
}

export interface PlatformAnalytics {
  period: 'daily' | 'weekly' | 'monthly' | 'yearly'
  date: string
  merchants: {
    total: number
    active: number
    new: number
    churned: number
  }
  orders: {
    total: number
    completed: number
    cancelled: number
    returned: number
  }
  revenue: {
    gross: number
    net: number
    commission: number
    averageOrderValue: number
  }
  products: {
    total: number
    active: number
    outOfStock: number
  }
  customers: {
    total: number
    new: number
    active: number
  }
  topMerchants: Array<{
    merchantId: string
    businessName: string
    orders: number
    revenue: number
    commission: number
  }>
  topProducts: Array<{
    productId: string
    productName: string
    merchant: string
    sales: number
    revenue: number
  }>
}

export interface SystemSettings {
  _id: string
  platform: {
    name: string
    description: string
    logo?: string
    favicon?: string
    theme: 'light' | 'dark'
  }
  commission: {
    defaultRate: number
    minimumRate: number
    maximumRate: number
  }
  payments: {
    supportedMethods: string[]
    processingFees: Record<string, number>
    payoutSchedule: 'daily' | 'weekly' | 'monthly'
  }
  notifications: {
    email: {
      enabled: boolean
      smtp: {
        host: string
        port: number
        username: string
        password: string
      }
    }
    sms: {
      enabled: boolean
      provider: string
      apiKey: string
    }
  }
  maintenance: {
    enabled: boolean
    message: string
    scheduledStart?: Date
    scheduledEnd?: Date
  }
  updatedAt: Date
}

