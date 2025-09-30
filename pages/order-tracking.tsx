import React, { useState } from 'react'
import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Layout from '@/components/Layout/Layout'
import { Truck, Package, CheckCircle, Clock, AlertCircle, Search } from 'lucide-react'

interface TrackingInfo {
  order: {
    orderNumber: string
    status: string
    trackingNumber: string
    carrier: string
    shippingAddress: {
      city: string
      state: string
      country: string
    }
    estimatedDelivery: string | null
    createdAt: string
    updatedAt: string
  }
}

const statusConfig = {
  pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, label: 'Pending' },
  processing: { color: 'bg-blue-100 text-blue-800', icon: Package, label: 'Processing' },
  shipped: { color: 'bg-purple-100 text-purple-800', icon: Truck, label: 'Shipped' },
  delivered: { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Delivered' },
  cancelled: { color: 'bg-red-100 text-red-800', icon: AlertCircle, label: 'Cancelled' },
  refunded: { color: 'bg-gray-100 text-gray-800', icon: AlertCircle, label: 'Refunded' },
}

export default function OrderTracking() {
  const [trackingNumber, setTrackingNumber] = useState('')
  const [trackingInfo, setTrackingInfo] = useState<TrackingInfo | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!trackingNumber.trim()) return

    setLoading(true)
    setError('')
    setTrackingInfo(null)

    try {
      const response = await fetch(`/api/orders/tracking?trackingNumber=${encodeURIComponent(trackingNumber)}`)
      
      if (response.ok) {
        const data = await response.json()
        setTrackingInfo(data)
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Order not found')
      }
    } catch (error) {
      setError('Failed to fetch tracking information')
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    const Icon = config.icon
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
        <Icon className="w-4 h-4 mr-2" />
        {config.label}
      </span>
    )
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Track Your Order</h1>
            <p className="text-lg text-gray-600">
              Enter your tracking number to check the status of your order
            </p>
          </div>

          {/* Search Form */}
          <div className="bg-white shadow rounded-lg p-6 mb-8">
            <form onSubmit={handleSearch} className="space-y-4">
              <div>
                <label htmlFor="trackingNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  Tracking Number
                </label>
                <div className="flex space-x-4">
                  <div className="flex-1">
                    <input
                      type="text"
                      id="trackingNumber"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your tracking number"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Searching...
                      </>
                    ) : (
                      <>
                        <Search className="h-5 w-5 mr-2" />
                        Track Order
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-8">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-red-400" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{error}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tracking Results */}
          {trackingInfo && (
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Order Tracking Information</h2>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Order Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Order Number</h3>
                    <p className="text-lg font-mono text-gray-900">{trackingInfo.order.orderNumber}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Current Status</h3>
                    {getStatusBadge(trackingInfo.order.status)}
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Tracking Number</h3>
                    <p className="text-lg font-mono text-gray-900">{trackingInfo.order.trackingNumber}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Carrier</h3>
                    <p className="text-lg text-gray-900">{trackingInfo.order.carrier}</p>
                  </div>
                </div>

                {/* Shipping Address */}
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Shipping Address</h3>
                  <p className="text-gray-900">
                    {trackingInfo.order.shippingAddress.city}, {trackingInfo.order.shippingAddress.state}, {trackingInfo.order.shippingAddress.country}
                  </p>
                </div>

                {/* Estimated Delivery */}
                {trackingInfo.order.estimatedDelivery && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Estimated Delivery</h3>
                    <p className="text-gray-900">
                      {new Date(trackingInfo.order.estimatedDelivery).toLocaleDateString()}
                    </p>
                  </div>
                )}

                {/* Timeline */}
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-4">Order Timeline</h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <Package className="w-4 h-4 text-blue-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-900">Order Placed</p>
                        <p className="text-sm text-gray-500">
                          {new Date(trackingInfo.order.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {trackingInfo.order.status === 'shipped' && (
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                            <Truck className="w-4 h-4 text-purple-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-900">Order Shipped</p>
                          <p className="text-sm text-gray-500">
                            {new Date(trackingInfo.order.updatedAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    )}

                    {trackingInfo.order.status === 'delivered' && (
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-900">Order Delivered</p>
                          <p className="text-sm text-gray-500">
                            {new Date(trackingInfo.order.updatedAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Help Section */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-medium text-blue-900 mb-2">Need Help?</h3>
            <p className="text-blue-700 mb-4">
              If you're having trouble tracking your order or have any questions, please contact our customer service team.
            </p>
            <div className="flex space-x-4">
              <a
                href="mailto:support@babymama.com"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Email Support
              </a>
              <a
                href="tel:+852-1234-5678"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Call Us: +852-1234-5678
              </a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'en', ['common'])),
    },
  }
}
