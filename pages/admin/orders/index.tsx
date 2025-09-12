import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useAdmin } from '@/contexts/AdminContext'
import AdminLayout from '@/components/Admin/Layout/AdminLayout'
import {
  ShoppingCart,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  User,
  MapPin,
  CreditCard,
  DollarSign,
  TrendingUp,
  TrendingDown
} from 'lucide-react'

interface Order {
  id: string
  orderNumber: string
  customer: {
    name: string
    email: string
    phone: string
  }
  merchant: {
    name: string
    id: string
  }
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
  total: number
  items: number
  orderDate: string
  shippingAddress: string
  paymentMethod: string
  trackingNumber?: string
  estimatedDelivery?: string
}

const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD-2024-001',
    customer: {
      name: 'Sarah Chen',
      email: 'sarah.chen@email.com',
      phone: '+852 1234 5678'
    },
    merchant: {
      name: 'Baby Essentials Store',
      id: 'merchant-1'
    },
    status: 'delivered',
    total: 1250,
    items: 3,
    orderDate: '2024-01-15T10:30:00Z',
    shippingAddress: 'Central, Hong Kong',
    paymentMethod: 'Credit Card',
    trackingNumber: 'HK123456789',
    estimatedDelivery: '2024-01-18'
  },
  {
    id: '2',
    orderNumber: 'ORD-2024-002',
    customer: {
      name: 'Michael Wong',
      email: 'michael.wong@email.com',
      phone: '+852 2345 6789'
    },
    merchant: {
      name: 'Tiny Tots Fashion',
      id: 'merchant-2'
    },
    status: 'shipped',
    total: 890,
    items: 2,
    orderDate: '2024-01-16T14:20:00Z',
    shippingAddress: 'Tsim Sha Tsui, Hong Kong',
    paymentMethod: 'PayPal',
    trackingNumber: 'HK987654321',
    estimatedDelivery: '2024-01-19'
  },
  {
    id: '3',
    orderNumber: 'ORD-2024-003',
    customer: {
      name: 'Lisa Liu',
      email: 'lisa.liu@email.com',
      phone: '+852 3456 7890'
    },
    merchant: {
      name: 'Safe & Sound Toys',
      id: 'merchant-3'
    },
    status: 'processing',
    total: 2100,
    items: 5,
    orderDate: '2024-01-17T09:15:00Z',
    shippingAddress: 'Causeway Bay, Hong Kong',
    paymentMethod: 'AlipayHK',
    estimatedDelivery: '2024-01-20'
  },
  {
    id: '4',
    orderNumber: 'ORD-2024-004',
    customer: {
      name: 'David Kim',
      email: 'david.kim@email.com',
      phone: '+852 4567 8901'
    },
    merchant: {
      name: 'Mama\'s Choice',
      id: 'merchant-4'
    },
    status: 'cancelled',
    total: 750,
    items: 1,
    orderDate: '2024-01-18T16:45:00Z',
    shippingAddress: 'Admiralty, Hong Kong',
    paymentMethod: 'WeChat Pay'
  }
]

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  processing: 'bg-purple-100 text-purple-800',
  shipped: 'bg-indigo-100 text-indigo-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  refunded: 'bg-gray-100 text-gray-800'
}

const statusLabels = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
  refunded: 'Refunded'
}

const statusIcons = {
  pending: Clock,
  confirmed: CheckCircle,
  processing: Package,
  shipped: Truck,
  delivered: CheckCircle,
  cancelled: XCircle,
  refunded: XCircle
}

export default function OrdersPage() {
  const router = useRouter()
  const { adminUser, isAuthenticated, isLoading } = useAdmin()
  const [orders, setOrders] = useState<Order[]>(mockOrders)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedOrders, setSelectedOrders] = useState<string[]>([])

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

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        order.customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        order.merchant.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleSelectOrder = (orderId: string) => {
    setSelectedOrders(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    )
  }

  const handleSelectAll = () => {
    setSelectedOrders(
      selectedOrders.length === filteredOrders.length 
        ? [] 
        : filteredOrders.map(order => order.id)
    )
  }

  const stats = [
    {
      name: 'Total Orders',
      value: orders.length,
      icon: ShoppingCart,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      change: '+12%',
      changeType: 'positive'
    },
    {
      name: 'Pending Orders',
      value: orders.filter(o => o.status === 'pending').length,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      change: '+5%',
      changeType: 'positive'
    },
    {
      name: 'Total Revenue',
      value: `HK$${orders.reduce((sum, o) => sum + o.total, 0).toLocaleString()}`,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      change: '+18%',
      changeType: 'positive'
    },
    {
      name: 'Avg Order Value',
      value: `HK$${Math.round(orders.reduce((sum, o) => sum + o.total, 0) / orders.length)}`,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      change: '+8%',
      changeType: 'positive'
    }
  ]

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
            <p className="text-gray-600">Manage and track customer orders</p>
          </div>
          <div className="flex gap-2">
            <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 flex items-center gap-2">
              <Package className="h-4 w-4" />
              Export
            </button>
            <button className="bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700 flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Advanced Filter
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon
            return (
              <div key={index} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                      <IconComponent className={`h-6 w-6 ${stat.color}`} />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`flex items-center text-sm ${stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                      {stat.changeType === 'positive' ? (
                        <TrendingUp className="h-4 w-4 mr-1" />
                      ) : (
                        <TrendingDown className="h-4 w-4 mr-1" />
                      )}
                      {stat.change}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
                <option value="refunded">Refunded</option>
              </select>
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Date Range
              </button>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">
                Orders ({filteredOrders.length})
              </h3>
              {selectedOrders.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">
                    {selectedOrders.length} selected
                  </span>
                  <button className="text-sm text-sky-600 hover:text-sky-800">
                    Bulk Actions
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedOrders.length === filteredOrders.length && filteredOrders.length > 0}
                      onChange={handleSelectAll}
                      className="h-4 w-4 text-sky-600 focus:ring-sky-500 border-gray-300 rounded"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Merchant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order) => {
                  const StatusIcon = statusIcons[order.status]
                  return (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedOrders.includes(order.id)}
                          onChange={() => handleSelectOrder(order.id)}
                          className="h-4 w-4 text-sky-600 focus:ring-sky-500 border-gray-300 rounded"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{order.orderNumber}</div>
                          <div className="text-sm text-gray-500">{order.items} items</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{order.customer.name}</div>
                          <div className="text-sm text-gray-500">{order.customer.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{order.merchant.name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <StatusIcon className="h-4 w-4 mr-2 text-gray-400" />
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColors[order.status]}`}>
                            {statusLabels[order.status]}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">HK${order.total.toLocaleString()}</div>
                        <div className="text-sm text-gray-500">{order.paymentMethod}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {new Date(order.orderDate).toLocaleDateString()}
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(order.orderDate).toLocaleTimeString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button className="text-sky-600 hover:text-sky-800" title="View Details">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="text-gray-600 hover:text-gray-800" title="More Actions">
                            <MoreVertical className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <ShoppingCart className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No orders found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Orders will appear here once customers start placing them.'
                }
              </p>
            </div>
          )}
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
