import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useMerchant } from '@/contexts/MerchantContext'
import MerchantLayout from '@/components/Merchant/Layout/MerchantLayout'
import {
  ShoppingCart,
  Package,
  DollarSign,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Users
} from 'lucide-react'

interface DashboardStats {
  totalOrders: number
  pendingOrders: number
  totalRevenue: number
  totalProducts: number
  lowStockProducts: number
  recentOrders: Array<{
    id: string
    orderNumber: string
    customer: string
    total: number
    status: string
    date: string
  }>
}

const mockStats: DashboardStats = {
  totalOrders: 156,
  pendingOrders: 12,
  totalRevenue: 45680,
  totalProducts: 89,
  lowStockProducts: 5,
  recentOrders: [
    {
      id: '1',
      orderNumber: 'ORD-001',
      customer: 'John Smith',
      total: 299.99,
      status: 'pending',
      date: '2024-01-15'
    },
    {
      id: '2',
      orderNumber: 'ORD-002',
      customer: 'Sarah Johnson',
      total: 149.50,
      status: 'shipped',
      date: '2024-01-14'
    },
    {
      id: '3',
      orderNumber: 'ORD-003',
      customer: 'Mike Chen',
      total: 89.99,
      status: 'delivered',
      date: '2024-01-13'
    },
    {
      id: '4',
      orderNumber: 'ORD-004',
      customer: 'Lisa Wong',
      total: 199.99,
      status: 'processing',
      date: '2024-01-12'
    }
  ]
}

interface DashboardData {
  stats: {
    totalProducts: number
    activeProducts: number
    totalOrders: number
    pendingOrders: number
    processingOrders: number
    totalSales: number
    averageRating: number
    totalReviews: number
  }
  recentOrders: Array<{
    orderNumber: string
    customer: any
    status: string
    total: number
    createdAt: string
  }>
  recentReviews: Array<{
    id: string
    rating: number
    comment: string
    customer: any
    product: any
    createdAt: string
  }>
}

export default function MerchantDashboard() {
  const router = useRouter()
  const { merchant, isAuthenticated, isLoading } = useMerchant()
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/merchant/auth/login')
    }
  }, [isAuthenticated, isLoading, router])

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('merchant_token')
        if (!token || !merchant) return

        const response = await fetch(`/api/merchant/dashboard?merchantId=${merchant._id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (response.ok) {
          const data = await response.json()
          setDashboardData(data)
        } else {
          console.error('Failed to fetch dashboard data')
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    if (isAuthenticated && merchant) {
      fetchDashboardData()
    }
  }, [isAuthenticated, merchant])

  if (isLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !merchant) {
    return null
  }

  const stats = [
    {
      name: 'Total Orders',
      value: dashboardData?.stats.totalOrders || 0,
      icon: ShoppingCart,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      name: 'Pending Orders',
      value: dashboardData?.stats.pendingOrders || 0,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    },
    {
      name: 'Total Revenue',
      value: `HK$${(dashboardData?.stats.totalSales || 0).toLocaleString()}`,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      name: 'Total Products',
      value: dashboardData?.stats.totalProducts || 0,
      icon: Package,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'processing':
        return 'bg-blue-100 text-blue-800'
      case 'shipped':
        return 'bg-purple-100 text-purple-800'
      case 'delivered':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <MerchantLayout>
      <div className="space-y-6">
        {/* Welcome section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {merchant.contactPerson}!
          </h1>
          <p className="mt-2 text-gray-600">
            Here's what's happening with your store today.
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className={`p-3 rounded-md ${stat.bgColor}`}>
                      <stat.icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {stat.name}
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {stat.value}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Alerts */}
        {dashboardData && (dashboardData.stats.totalProducts - dashboardData.stats.activeProducts) > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Inactive Products Alert
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>
                    You have {dashboardData.stats.totalProducts - dashboardData.stats.activeProducts} inactive products. 
                    <Link href="/merchant/products" className="font-medium underline hover:text-yellow-600">
                      Review products
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recent orders */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Recent Orders
            </h3>
            <div className="mt-5">
              <div className="flow-root">
                <ul className="-my-5 divide-y divide-gray-200">
                  {dashboardData?.recentOrders?.length > 0 ? (
                    dashboardData.recentOrders.map((order) => (
                      <li key={order.orderNumber} className="py-4">
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <ShoppingCart className="h-5 w-5 text-gray-500" />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {order.orderNumber}
                            </p>
                            <p className="text-sm text-gray-500 truncate">
                              {order.customer ? `${order.customer.firstName} ${order.customer.lastName}` : 'Guest Customer'}
                            </p>
                          </div>
                          <div className="flex-shrink-0 text-right">
                            <p className="text-sm font-medium text-gray-900">
                              HK${order.total.toLocaleString()}
                            </p>
                            <p className="text-sm text-gray-500">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex-shrink-0">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                          </div>
                        </div>
                      </li>
                    ))
                  ) : (
                    <li className="py-4 text-center text-gray-500">
                      No recent orders
                    </li>
                  )}
                </ul>
              </div>
              <div className="mt-6">
                <Link
                  href="/merchant/orders"
                  className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  View all orders
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Quick Actions
            </h3>
            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Link
                href="/merchant/products/new"
                className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 rounded-lg border border-gray-300 hover:border-gray-400"
              >
                <div>
                  <span className="rounded-lg inline-flex p-3 bg-blue-50 text-blue-700 ring-4 ring-white">
                    <Package className="h-6 w-6" />
                  </span>
                </div>
                <div className="mt-8">
                  <h3 className="text-lg font-medium">
                    <span className="absolute inset-0" aria-hidden="true" />
                    Add Product
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Create a new product listing
                  </p>
                </div>
              </Link>

              <Link
                href="/merchant/orders"
                className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 rounded-lg border border-gray-300 hover:border-gray-400"
              >
                <div>
                  <span className="rounded-lg inline-flex p-3 bg-green-50 text-green-700 ring-4 ring-white">
                    <ShoppingCart className="h-6 w-6" />
                  </span>
                </div>
                <div className="mt-8">
                  <h3 className="text-lg font-medium">
                    <span className="absolute inset-0" aria-hidden="true" />
                    Manage Orders
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    View and process orders
                  </p>
                </div>
              </Link>

              <Link
                href="/merchant/analytics"
                className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 rounded-lg border border-gray-300 hover:border-gray-400"
              >
                <div>
                  <span className="rounded-lg inline-flex p-3 bg-purple-50 text-purple-700 ring-4 ring-white">
                    <TrendingUp className="h-6 w-6" />
                  </span>
                </div>
                <div className="mt-8">
                  <h3 className="text-lg font-medium">
                    <span className="absolute inset-0" aria-hidden="true" />
                    View Analytics
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Check sales performance
                  </p>
                </div>
              </Link>

              <Link
                href="/merchant/settings"
                className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 rounded-lg border border-gray-300 hover:border-gray-400"
              >
                <div>
                  <span className="rounded-lg inline-flex p-3 bg-gray-50 text-gray-700 ring-4 ring-white">
                    <Users className="h-6 w-6" />
                  </span>
                </div>
                <div className="mt-8">
                  <h3 className="text-lg font-medium">
                    <span className="absolute inset-0" aria-hidden="true" />
                    Store Settings
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Manage store preferences
                  </p>
                </div>
              </Link>
            </div>
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

