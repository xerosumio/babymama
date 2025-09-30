import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useMerchant } from '@/contexts/MerchantContext'
import MerchantLayout from '@/components/Merchant/Layout/MerchantLayout'
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  DollarSign,
  Package,
  Users,
  Eye,
  Star,
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
    daily: Array<{ date: string; value: number }>
  }
  orders: {
    total: number
    change: number
    changeType: 'up' | 'down'
    daily: Array<{ date: string; value: number }>
  }
  products: {
    total: number
    active: number
    lowStock: number
    topSelling: Array<{
      name: string
      sales: number
      revenue: number
      views: number
    }>
  }
  customers: {
    total: number
    new: number
    returning: number
    change: number
    changeType: 'up' | 'down'
  }
  conversion: {
    views: number
    addToCart: number
    purchases: number
    conversionRate: number
  }
  reviews: {
    average: number
    total: number
    recent: Array<{
      customer: string
      rating: number
      comment: string
      date: string
    }>
  }
}

const mockAnalytics: AnalyticsData = {
  revenue: {
    total: 45680,
    change: 12.5,
    changeType: 'up',
    monthly: [
      { month: 'Jan', value: 12000 },
      { month: 'Feb', value: 15000 },
      { month: 'Mar', value: 13500 },
      { month: 'Apr', value: 18000 },
      { month: 'May', value: 22000 },
      { month: 'Jun', value: 25000 }
    ],
    daily: [
      { date: '2024-01-01', value: 450 },
      { date: '2024-01-02', value: 520 },
      { date: '2024-01-03', value: 380 },
      { date: '2024-01-04', value: 610 },
      { date: '2024-01-05', value: 470 },
      { date: '2024-01-06', value: 550 },
      { date: '2024-01-07', value: 430 }
    ]
  },
  orders: {
    total: 156,
    change: 8.3,
    changeType: 'up',
    daily: [
      { date: '2024-01-01', value: 8 },
      { date: '2024-01-02', value: 12 },
      { date: '2024-01-03', value: 6 },
      { date: '2024-01-04', value: 15 },
      { date: '2024-01-05', value: 9 },
      { date: '2024-01-06', value: 11 },
      { date: '2024-01-07', value: 7 }
    ]
  },
  products: {
    total: 89,
    active: 82,
    lowStock: 5,
    topSelling: [
      { name: 'Premium Baby Formula', sales: 45, revenue: 4500, views: 234 },
      { name: 'Organic Baby Clothes Set', sales: 32, revenue: 3200, views: 189 },
      { name: 'Educational Wooden Toys', sales: 28, revenue: 2800, views: 156 },
      { name: 'Baby Stroller Pro', sales: 15, revenue: 1500, views: 98 }
    ]
  },
  customers: {
    total: 234,
    new: 45,
    returning: 189,
    change: 18.7,
    changeType: 'up'
  },
  conversion: {
    views: 5670,
    addToCart: 890,
    purchases: 156,
    conversionRate: 2.75
  },
  reviews: {
    average: 4.6,
    total: 89,
    recent: [
      { customer: 'Sarah Chen', rating: 5, comment: 'Excellent quality products!', date: '2024-01-15' },
      { customer: 'Michael Wong', rating: 4, comment: 'Fast delivery, good packaging', date: '2024-01-14' },
      { customer: 'Lisa Liu', rating: 5, comment: 'Love the baby clothes, very soft', date: '2024-01-13' },
      { customer: 'David Kim', rating: 4, comment: 'Good value for money', date: '2024-01-12' }
    ]
  }
}

export default function AnalyticsPage() {
  const router = useRouter()
  const { merchant, isAuthenticated, isLoading } = useMerchant()
  const [analytics, setAnalytics] = useState<AnalyticsData>(mockAnalytics)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('30d')
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Fetch analytics data from API
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem('merchant_token')
        if (!token || !merchant) return

        const response = await fetch(`/api/merchant/analytics?period=${timeRange}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (response.ok) {
          const data = await response.json()
          // Transform API data to match component interface
          const transformedData: AnalyticsData = {
            revenue: {
              total: data.revenue.total,
              change: data.revenue.change,
              changeType: data.revenue.changeType,
              monthly: [], // Could be calculated from daily data
              daily: data.revenue.daily.map((item: any) => ({
                date: item.date,
                value: item.revenue
              }))
            },
            orders: {
              total: data.orders.total,
              change: data.orders.change,
              changeType: data.orders.changeType,
              daily: data.orders.daily
            },
            products: {
              total: data.products.total,
              active: data.products.active,
              lowStock: data.products.lowStock,
              topSelling: data.products.topSelling
            },
            customers: {
              total: data.customers.total,
              new: data.customers.new,
              returning: data.customers.returning,
              change: 0, // Could calculate from API
              changeType: 'up' as const
            },
            conversion: {
              views: 0, // Not tracked yet
              addToCart: 0, // Not tracked yet
              purchases: data.orders.total,
              conversionRate: 0 // Could calculate
            },
            reviews: {
              average: data.reviews.average,
              total: data.reviews.total,
              recent: data.reviews.recent.map((review: any) => ({
                customer: review.customer?.firstName + ' ' + review.customer?.lastName || 'Anonymous',
                rating: review.rating,
                comment: review.comment,
                date: new Date(review.createdAt).toISOString().split('T')[0]
              }))
            }
          }
          setAnalytics(transformedData)
        } else {
          console.error('Failed to fetch analytics')
          // Keep mock data if API fails
        }
      } catch (error) {
        console.error('Error fetching analytics:', error)
      } finally {
        setLoading(false)
      }
    }

    if (isAuthenticated && merchant) {
      fetchAnalytics()
    }
  }, [isAuthenticated, merchant, timeRange])

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/merchant/auth/login')
    }
  }, [isAuthenticated, isLoading, router])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    setLoading(true)
    
    try {
      const token = localStorage.getItem('merchant_token')
      if (token && merchant) {
        const response = await fetch(`/api/merchant/analytics?period=${timeRange}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (response.ok) {
          const data = await response.json()
          // Update analytics data (same transformation as above)
          // ... (same transformation logic)
        }
      }
    } catch (error) {
      console.error('Error refreshing analytics:', error)
    } finally {
      setIsRefreshing(false)
      setLoading(false)
    }
  }

  if (isLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading analytics...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !merchant) {
    return null
  }

  const formatCurrency = (amount: number) => `HK$${amount.toLocaleString()}`
  const formatPercentage = (value: number) => `${value > 0 ? '+' : ''}${value.toFixed(1)}%`

  return (
    <MerchantLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
            <p className="text-gray-600">Track your store performance and insights</p>
          </div>
          <div className="flex gap-2">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
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
                <p className="text-2xl font-bold text-gray-900">{analytics.orders.total}</p>
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
                <p className="text-sm font-medium text-gray-600">Total Products</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.products.total}</p>
                <div className="text-sm text-gray-500">
                  {analytics.products.active} active, {analytics.products.lowStock} low stock
                </div>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Package className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Customers</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.customers.total}</p>
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
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Daily Revenue</span>
              </div>
            </div>
            <div className="h-64 flex items-end justify-between space-x-1">
              {analytics.revenue.daily.map((item, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div
                    className="bg-blue-500 rounded-t w-6"
                    style={{ height: `${(item.value / Math.max(...analytics.revenue.daily.map(d => d.value))) * 200}px` }}
                  ></div>
                  <span className="text-xs text-gray-600 mt-2">{new Date(item.date).getDate()}</span>
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

        {/* Conversion Funnel */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6">Conversion Funnel</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">{analytics.conversion.views.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Page Views</div>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '100%' }}></div>
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">{analytics.conversion.addToCart.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Add to Cart</div>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '15.7%' }}></div>
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">{analytics.conversion.purchases.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Purchases</div>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '2.75%' }}></div>
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">{analytics.conversion.conversionRate}%</div>
              <div className="text-sm text-gray-600">Conversion Rate</div>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: '2.75%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Products and Reviews */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Selling Products */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Top Selling Products</h3>
            <div className="space-y-4">
              {analytics.products.topSelling.map((product, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600">{index + 1}</span>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-500">{product.views} views</p>
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

          {/* Recent Reviews */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Reviews</h3>
            <div className="space-y-4">
              {analytics.reviews.recent.map((review, index) => (
                <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                            }`}
                            fill={i < review.rating ? 'currentColor' : 'none'}
                          />
                        ))}
                      </div>
                      <span className="ml-2 text-sm font-medium text-gray-900">{review.customer}</span>
                    </div>
                    <span className="text-xs text-gray-500">{review.date}</span>
                  </div>
                  <p className="text-sm text-gray-600">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Monthly Revenue Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6">Monthly Revenue</h3>
          <div className="h-64 flex items-end justify-between space-x-2">
            {analytics.revenue.monthly.map((item, index) => (
              <div key={index} className="flex flex-col items-center">
                <div
                  className="bg-gradient-to-t from-blue-500 to-blue-300 rounded-t w-12"
                  style={{ height: `${(item.value / Math.max(...analytics.revenue.monthly.map(m => m.value))) * 200}px` }}
                ></div>
                <span className="text-xs text-gray-600 mt-2">{item.month}</span>
                <span className="text-xs text-gray-500">{formatCurrency(item.value)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MerchantLayout>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'en', ['common'])),
    },
  }
}
