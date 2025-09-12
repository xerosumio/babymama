import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useAdmin } from '@/contexts/AdminContext'
import AdminLayout from '@/components/Admin/Layout/AdminLayout'
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  ShoppingCart,
  DollarSign,
  Package,
  Building2,
  Calendar,
  Download,
  Filter,
  RefreshCw
} from 'lucide-react'

interface AnalyticsData {
  revenue: {
    total: number
    change: number
    changeType: 'up' | 'down'
    monthly: Array<{ month: string; value: number }>
  }
  orders: {
    total: number
    change: number
    changeType: 'up' | 'down'
    daily: Array<{ date: string; value: number }>
  }
  merchants: {
    total: number
    active: number
    pending: number
    change: number
    changeType: 'up' | 'down'
  }
  customers: {
    total: number
    new: number
    change: number
    changeType: 'up' | 'down'
  }
  topMerchants: Array<{
    name: string
    revenue: number
    orders: number
    growth: number
  }>
  topProducts: Array<{
    name: string
    category: string
    sales: number
    revenue: number
  }>
  recentActivity: Array<{
    type: string
    description: string
    timestamp: string
    value?: number
  }>
}

const mockAnalytics: AnalyticsData = {
  revenue: {
    total: 2456780,
    change: 12.5,
    changeType: 'up',
    monthly: [
      { month: 'Jan', value: 180000 },
      { month: 'Feb', value: 220000 },
      { month: 'Mar', value: 195000 },
      { month: 'Apr', value: 250000 },
      { month: 'May', value: 280000 },
      { month: 'Jun', value: 320000 }
    ]
  },
  orders: {
    total: 15432,
    change: 8.3,
    changeType: 'up',
    daily: [
      { date: '2024-01-01', value: 45 },
      { date: '2024-01-02', value: 52 },
      { date: '2024-01-03', value: 38 },
      { date: '2024-01-04', value: 61 },
      { date: '2024-01-05', value: 47 },
      { date: '2024-01-06', value: 55 },
      { date: '2024-01-07', value: 43 }
    ]
  },
  merchants: {
    total: 45,
    active: 38,
    pending: 7,
    change: 15.2,
    changeType: 'up'
  },
  customers: {
    total: 5670,
    new: 234,
    change: 18.7,
    changeType: 'up'
  },
  topMerchants: [
    { name: 'Baby Essentials Store', revenue: 45680, orders: 245, growth: 12.5 },
    { name: 'Safe & Sound Toys', revenue: 32150, orders: 189, growth: 8.3 },
    { name: 'Tiny Tots Fashion', revenue: 28900, orders: 156, growth: 15.2 },
    { name: 'Mama\'s Choice', revenue: 12340, orders: 67, growth: -5.2 }
  ],
  topProducts: [
    { name: 'Premium Baby Formula', category: 'Feeding', sales: 456, revenue: 45600 },
    { name: 'Organic Baby Clothes Set', category: 'Clothing', sales: 234, revenue: 23400 },
    { name: 'Educational Wooden Toys', category: 'Toys', sales: 189, revenue: 18900 },
    { name: 'Baby Stroller Pro', category: 'Gear & Travel', sales: 123, revenue: 12300 }
  ],
  recentActivity: [
    { type: 'order', description: 'New order #ORD-2024-001 placed', timestamp: '2024-01-15T10:30:00Z', value: 1250 },
    { type: 'merchant', description: 'New merchant "Tiny Tots Fashion" registered', timestamp: '2024-01-15T09:15:00Z' },
    { type: 'payment', description: 'Payment received for order #ORD-2024-000', timestamp: '2024-01-15T08:45:00Z', value: 890 },
    { type: 'product', description: 'New product added by Baby Essentials Store', timestamp: '2024-01-15T07:20:00Z' }
  ]
}

export default function AnalyticsPage() {
  const router = useRouter()
  const { adminUser, isAuthenticated, isLoading } = useAdmin()
  const [analytics, setAnalytics] = useState<AnalyticsData>(mockAnalytics)
  const [timeRange, setTimeRange] = useState('30d')
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/admin/auth/login')
    }
  }, [isAuthenticated, isLoading, router])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsRefreshing(false)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !adminUser) {
    return null
  }

  const formatCurrency = (amount: number) => `HK$${amount.toLocaleString()}`
  const formatPercentage = (value: number) => `${value > 0 ? '+' : ''}${value.toFixed(1)}%`

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
            <p className="text-gray-600">Platform performance and insights</p>
          </div>
          <div className="flex gap-2">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button className="bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700 flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(analytics.revenue.total)}</p>
                <div className={`flex items-center text-sm ${analytics.revenue.changeType === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                  {analytics.revenue.changeType === 'up' ? (
                    <TrendingUp className="h-4 w-4 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 mr-1" />
                  )}
                  {formatPercentage(analytics.revenue.change)} from last period
                </div>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.orders.total.toLocaleString()}</p>
                <div className={`flex items-center text-sm ${analytics.orders.changeType === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                  {analytics.orders.changeType === 'up' ? (
                    <TrendingUp className="h-4 w-4 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 mr-1" />
                  )}
                  {formatPercentage(analytics.orders.change)} from last period
                </div>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <ShoppingCart className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Merchants</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.merchants.active}</p>
                <div className="text-sm text-gray-500">
                  {analytics.merchants.pending} pending approval
                </div>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Building2 className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Customers</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.customers.total.toLocaleString()}</p>
                <div className={`flex items-center text-sm ${analytics.customers.changeType === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                  {analytics.customers.changeType === 'up' ? (
                    <TrendingUp className="h-4 w-4 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 mr-1" />
                  )}
                  {formatPercentage(analytics.customers.change)} from last period
                </div>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <Users className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Revenue Trend</h3>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-sky-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Monthly Revenue</span>
              </div>
            </div>
            <div className="h-64 flex items-end justify-between space-x-2">
              {analytics.revenue.monthly.map((item, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div
                    className="bg-sky-500 rounded-t w-8"
                    style={{ height: `${(item.value / Math.max(...analytics.revenue.monthly.map(m => m.value))) * 200}px` }}
                  ></div>
                  <span className="text-xs text-gray-600 mt-2">{item.month}</span>
                  <span className="text-xs text-gray-500">{formatCurrency(item.value)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Orders Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Daily Orders</h3>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Daily Orders</span>
              </div>
            </div>
            <div className="h-64 flex items-end justify-between space-x-1">
              {analytics.orders.daily.map((item, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div
                    className="bg-green-500 rounded-t w-6"
                    style={{ height: `${(item.value / Math.max(...analytics.orders.daily.map(d => d.value))) * 200}px` }}
                  ></div>
                  <span className="text-xs text-gray-600 mt-2">{new Date(item.date).getDate()}</span>
                  <span className="text-xs text-gray-500">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Performers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Merchants */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Top Merchants</h3>
            <div className="space-y-4">
              {analytics.topMerchants.map((merchant, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-sky-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-sky-600">{index + 1}</span>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{merchant.name}</p>
                      <p className="text-sm text-gray-500">{merchant.orders} orders</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{formatCurrency(merchant.revenue)}</p>
                    <p className={`text-sm ${merchant.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatPercentage(merchant.growth)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Top Products</h3>
            <div className="space-y-4">
              {analytics.topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Package className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-500">{product.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{product.sales} sales</p>
                    <p className="text-sm text-gray-500">{formatCurrency(product.revenue)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {analytics.recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between py-2">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-sky-500 rounded-full mr-3"></div>
                  <div>
                    <p className="text-sm text-gray-900">{activity.description}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(activity.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
                {activity.value && (
                  <span className="text-sm font-medium text-gray-900">
                    {formatCurrency(activity.value)}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'en', ['common'])),
    },
  }
}
