import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useAdmin } from '@/contexts/AdminContext'
import AdminLayout from '@/components/Admin/Layout/AdminLayout'
import {
  Users,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Building2,
  Package,
  AlertCircle,
  CheckCircle,
  Clock,
  Activity
} from 'lucide-react'

interface DashboardStats {
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
    timestamp: string
    metadata?: any
  }>
}

const mockStats: DashboardStats = {
  totalMerchants: 45,
  activeMerchants: 38,
  pendingMerchants: 7,
  totalOrders: 1234,
  totalRevenue: 456780,
  platformCommission: 68517,
  totalProducts: 2890,
  activeProducts: 2650,
  totalCustomers: 5670,
  recentActivity: [
    {
      id: '1',
      type: 'merchant_registered',
      description: 'New merchant "Baby Care Store" registered',
      timestamp: '2024-01-15T10:30:00Z'
    },
    {
      id: '2',
      type: 'order_placed',
      description: 'Order #ORD-001 placed for HK$299.99',
      timestamp: '2024-01-15T09:15:00Z'
    },
    {
      id: '3',
      type: 'product_added',
      description: 'New product "Premium Baby Stroller" added',
      timestamp: '2024-01-15T08:45:00Z'
    },
    {
      id: '4',
      type: 'payment_received',
      description: 'Payment received for Order #ORD-002',
      timestamp: '2024-01-15T08:30:00Z'
    }
  ]
}

export default function AdminDashboard() {
  const router = useRouter()
  const { adminUser, isAuthenticated, isLoading } = useAdmin()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/admin/auth/login')
    }
  }, [isAuthenticated, isLoading, router])

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

  const stats = [
    {
      name: 'Total Merchants',
      value: mockStats.totalMerchants,
      icon: Building2,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      change: '+12%',
      changeType: 'positive'
    },
    {
      name: 'Active Merchants',
      value: mockStats.activeMerchants,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      change: '+8%',
      changeType: 'positive'
    },
    {
      name: 'Total Orders',
      value: mockStats.totalOrders,
      icon: ShoppingCart,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      change: '+23%',
      changeType: 'positive'
    },
    {
      name: 'Total Revenue',
      value: `HK$${mockStats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      change: '+18%',
      changeType: 'positive'
    },
    {
      name: 'Platform Commission',
      value: `HK$${mockStats.platformCommission.toLocaleString()}`,
      icon: TrendingUp,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      change: '+15%',
      changeType: 'positive'
    },
    {
      name: 'Total Products',
      value: mockStats.totalProducts,
      icon: Package,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100',
      change: '+31%',
      changeType: 'positive'
    }
  ]

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'merchant_registered':
        return <Building2 className="h-4 w-4 text-blue-600" />
      case 'order_placed':
        return <ShoppingCart className="h-4 w-4 text-green-600" />
      case 'product_added':
        return <Package className="h-4 w-4 text-purple-600" />
      case 'payment_received':
        return <DollarSign className="h-4 w-4 text-yellow-600" />
      default:
        return <Activity className="h-4 w-4 text-gray-600" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-HK', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Welcome section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {adminUser.username}!
          </h1>
          <p className="mt-2 text-gray-600">
            Here's what's happening with the platform today.
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
                  <div className="flex-shrink-0">
                    <span className={`text-sm font-medium ${
                      stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.change}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Alerts */}
        {mockStats.pendingMerchants > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Pending Merchant Approvals
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>
                    You have {mockStats.pendingMerchants} merchants waiting for approval. 
                    <a href="/admin/merchants" className="font-medium underline hover:text-yellow-600">
                      Review applications
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recent activity */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Recent Activity
            </h3>
            <div className="mt-5">
              <div className="flow-root">
                <ul className="-my-5 divide-y divide-gray-200">
                  {mockStats.recentActivity.map((activity) => (
                    <li key={activity.id} className="py-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                            {getActivityIcon(activity.type)}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">
                            {activity.description}
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatDate(activity.timestamp)}
                          </p>
                        </div>
                        <div className="flex-shrink-0">
                          <Clock className="h-4 w-4 text-gray-400" />
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
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
              <a
                href="/admin/merchants"
                className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-sky-500 rounded-lg border border-gray-300 hover:border-gray-400"
              >
                <div>
                  <span className="rounded-lg inline-flex p-3 bg-blue-50 text-blue-700 ring-4 ring-white">
                    <Building2 className="h-6 w-6" />
                  </span>
                </div>
                <div className="mt-8">
                  <h3 className="text-lg font-medium">
                    <span className="absolute inset-0" aria-hidden="true" />
                    Manage Merchants
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Review and manage merchant accounts
                  </p>
                </div>
              </a>

              <a
                href="/admin/orders"
                className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-sky-500 rounded-lg border border-gray-300 hover:border-gray-400"
              >
                <div>
                  <span className="rounded-lg inline-flex p-3 bg-green-50 text-green-700 ring-4 ring-white">
                    <ShoppingCart className="h-6 w-6" />
                  </span>
                </div>
                <div className="mt-8">
                  <h3 className="text-lg font-medium">
                    <span className="absolute inset-0" aria-hidden="true" />
                    View Orders
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Monitor platform orders
                  </p>
                </div>
              </a>

              <a
                href="/admin/analytics"
                className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-sky-500 rounded-lg border border-gray-300 hover:border-gray-400"
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
                    Check platform performance
                  </p>
                </div>
              </a>

              <a
                href="/admin/settings"
                className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-sky-500 rounded-lg border border-gray-300 hover:border-gray-400"
              >
                <div>
                  <span className="rounded-lg inline-flex p-3 bg-gray-50 text-gray-700 ring-4 ring-white">
                    <Users className="h-6 w-6" />
                  </span>
                </div>
                <div className="mt-8">
                  <h3 className="text-lg font-medium">
                    <span className="absolute inset-0" aria-hidden="true" />
                    Platform Settings
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Configure platform settings
                  </p>
                </div>
              </a>
            </div>
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

