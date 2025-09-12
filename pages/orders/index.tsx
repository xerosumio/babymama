import React from 'react'
import { GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import Layout from '@/components/Layout/Layout'
import { Package, Truck, CheckCircle, Clock, ArrowRight } from 'lucide-react'
import Link from 'next/link'

// Mock order data
const mockOrders = [
  {
    id: 'ORD-001',
    date: '2024-01-15',
    status: 'delivered',
    total: 899,
    items: [
      {
        id: '1',
        name: { en: 'Premium Baby Stroller', 'zh-HK': '優質嬰兒推車' },
        quantity: 1,
        price: 899,
        image: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
      }
    ],
    trackingNumber: 'HK123456789',
    estimatedDelivery: '2024-01-18'
  },
  {
    id: 'ORD-002',
    date: '2024-01-20',
    status: 'shipped',
    total: 598,
    items: [
      {
        id: '2',
        name: { en: 'Baby Bottle Set - 4 Pack', 'zh-HK': '嬰兒奶瓶套裝 - 4件裝' },
        quantity: 2,
        price: 199,
        image: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
      },
      {
        id: '3',
        name: { en: 'Ultra Absorbent Diapers - 120 Count', 'zh-HK': '超強吸水尿布 - 120片裝' },
        quantity: 1,
        price: 289,
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
      }
    ],
    trackingNumber: 'HK987654321',
    estimatedDelivery: '2024-01-25'
  },
  {
    id: 'ORD-003',
    date: '2024-01-22',
    status: 'processing',
    total: 149,
    items: [
      {
        id: '4',
        name: { en: 'Baby Skincare Set - Natural', 'zh-HK': '嬰兒護膚套裝 - 天然' },
        quantity: 1,
        price: 149,
        image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
      }
    ],
    trackingNumber: null,
    estimatedDelivery: '2024-01-26'
  }
]

const OrdersPage: React.FC = () => {
  const { t } = useTranslation('common')
  const router = useRouter()
  const locale = router.locale as 'en' | 'zh-HK'

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-HK', {
      style: 'currency',
      currency: 'HKD',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'shipped':
        return <Truck className="w-5 h-5 text-blue-500" />
      case 'processing':
        return <Clock className="w-5 h-5 text-yellow-500" />
      default:
        return <Package className="w-5 h-5 text-gray-500" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'Delivered'
      case 'shipped':
        return 'Shipped'
      case 'processing':
        return 'Processing'
      default:
        return 'Unknown'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'text-green-600 bg-green-100'
      case 'shipped':
        return 'text-blue-600 bg-blue-100'
      case 'processing':
        return 'text-yellow-600 bg-yellow-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen">
        <div className="container py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Order History
            </h1>
            <p className="text-gray-600">
              Track and manage your orders
            </p>
          </div>

          {mockOrders.length === 0 ? (
            <div className="text-center py-16">
              <Package className="w-24 h-24 text-gray-400 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                No orders yet
              </h2>
              <p className="text-gray-600 mb-8">
                Start shopping to see your orders here.
              </p>
              <Link
                href="/products"
                className="inline-flex items-center space-x-2 bg-baby-500 text-white px-6 py-3 rounded-lg hover:bg-baby-600 transition-colors font-medium"
              >
                <span>Start Shopping</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {mockOrders.map((order) => (
                <div key={order.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  {/* Order Header */}
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center space-x-4">
                        {getStatusIcon(order.status)}
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            Order #{order.id}
                          </h3>
                          <p className="text-sm text-gray-600">
                            Placed on {new Date(order.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="mt-4 sm:mt-0 flex items-center space-x-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                          {getStatusText(order.status)}
                        </span>
                        <span className="text-lg font-semibold text-gray-900">
                          {formatPrice(order.total)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-6">
                    <div className="space-y-4">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-center space-x-4">
                          <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                            <img
                              src={item.image}
                              alt={item.name[locale]}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 truncate">
                              {item.name[locale]}
                            </h4>
                            <p className="text-sm text-gray-600">
                              Quantity: {item.quantity}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-gray-900">
                              {formatPrice(item.price * item.quantity)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Order Actions */}
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                        <div className="space-y-2">
                          {order.trackingNumber && (
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Tracking Number:</span> {order.trackingNumber}
                            </p>
                          )}
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Estimated Delivery:</span> {order.estimatedDelivery}
                          </p>
                        </div>
                        <div className="flex space-x-3">
                          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                            View Details
                          </button>
                          {order.status === 'delivered' && (
                            <button className="px-4 py-2 bg-baby-500 text-white rounded-lg hover:bg-baby-600 transition-colors text-sm font-medium">
                              Reorder
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'en', ['common'])),
    },
  }
}

export default OrdersPage
