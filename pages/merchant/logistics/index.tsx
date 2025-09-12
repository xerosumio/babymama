import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useMerchant } from '@/contexts/MerchantContext'
import MerchantLayout from '@/components/Merchant/Layout/MerchantLayout'
import {
  Truck,
  Package,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  MoreVertical,
  Calendar,
  User,
  Phone,
  Mail,
  RefreshCw,
  Download
} from 'lucide-react'

interface Shipment {
  id: string
  orderNumber: string
  customer: {
    name: string
    email: string
    phone: string
  }
  shippingAddress: {
    street: string
    city: string
    postalCode: string
    country: string
  }
  carrier: string
  trackingNumber: string
  status: 'pending' | 'picked_up' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'failed'
  estimatedDelivery: string
  actualDelivery?: string
  weight: number
  dimensions: {
    length: number
    width: number
    height: number
  }
  shippingCost: number
  insuranceValue: number
  specialInstructions?: string
  createdAt: string
  updatedAt: string
}

const mockShipments: Shipment[] = [
  {
    id: '1',
    orderNumber: 'ORD-2024-001',
    customer: {
      name: 'Sarah Chen',
      email: 'sarah.chen@email.com',
      phone: '+852 1234 5678'
    },
    shippingAddress: {
      street: '123 Central Plaza',
      city: 'Central',
      postalCode: '00000',
      country: 'Hong Kong'
    },
    carrier: 'SF Express',
    trackingNumber: 'SF123456789',
    status: 'delivered',
    estimatedDelivery: '2024-01-18',
    actualDelivery: '2024-01-17',
    weight: 1.5,
    dimensions: { length: 30, width: 20, height: 15 },
    shippingCost: 45,
    insuranceValue: 1250,
    specialInstructions: 'Handle with care - fragile items',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-17T14:20:00Z'
  },
  {
    id: '2',
    orderNumber: 'ORD-2024-002',
    customer: {
      name: 'Michael Wong',
      email: 'michael.wong@email.com',
      phone: '+852 2345 6789'
    },
    shippingAddress: {
      street: '456 TST Mall',
      city: 'Tsim Sha Tsui',
      postalCode: '00000',
      country: 'Hong Kong'
    },
    carrier: 'Hongkong Post',
    trackingNumber: 'HK987654321',
    status: 'in_transit',
    estimatedDelivery: '2024-01-19',
    weight: 0.8,
    dimensions: { length: 25, width: 18, height: 12 },
    shippingCost: 30,
    insuranceValue: 890,
    createdAt: '2024-01-16T14:20:00Z',
    updatedAt: '2024-01-18T09:15:00Z'
  },
  {
    id: '3',
    orderNumber: 'ORD-2024-003',
    customer: {
      name: 'Lisa Liu',
      email: 'lisa.liu@email.com',
      phone: '+852 3456 7890'
    },
    shippingAddress: {
      street: '789 Causeway Bay Plaza',
      city: 'Causeway Bay',
      postalCode: '00000',
      country: 'Hong Kong'
    },
    carrier: 'Lalamove',
    trackingNumber: 'LL456789123',
    status: 'out_for_delivery',
    estimatedDelivery: '2024-01-20',
    weight: 2.1,
    dimensions: { length: 35, width: 25, height: 20 },
    shippingCost: 60,
    insuranceValue: 2100,
    createdAt: '2024-01-17T09:15:00Z',
    updatedAt: '2024-01-19T16:45:00Z'
  },
  {
    id: '4',
    orderNumber: 'ORD-2024-004',
    customer: {
      name: 'David Kim',
      email: 'david.kim@email.com',
      phone: '+852 4567 8901'
    },
    shippingAddress: {
      street: '321 Admiralty Centre',
      city: 'Admiralty',
      postalCode: '00000',
      country: 'Hong Kong'
    },
    carrier: 'SF Express',
    trackingNumber: 'SF789123456',
    status: 'pending',
    estimatedDelivery: '2024-01-21',
    weight: 1.2,
    dimensions: { length: 28, width: 22, height: 18 },
    shippingCost: 40,
    insuranceValue: 750,
    createdAt: '2024-01-18T16:45:00Z',
    updatedAt: '2024-01-18T16:45:00Z'
  }
]

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  picked_up: 'bg-blue-100 text-blue-800',
  in_transit: 'bg-purple-100 text-purple-800',
  out_for_delivery: 'bg-indigo-100 text-indigo-800',
  delivered: 'bg-green-100 text-green-800',
  failed: 'bg-red-100 text-red-800'
}

const statusLabels = {
  pending: 'Pending Pickup',
  picked_up: 'Picked Up',
  in_transit: 'In Transit',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
  failed: 'Delivery Failed'
}

const statusIcons = {
  pending: Clock,
  picked_up: Package,
  in_transit: Truck,
  out_for_delivery: Truck,
  delivered: CheckCircle,
  failed: AlertCircle
}

export default function LogisticsPage() {
  const router = useRouter()
  const { merchant, isAuthenticated, isLoading } = useMerchant()
  const [shipments, setShipments] = useState<Shipment[]>(mockShipments)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [carrierFilter, setCarrierFilter] = useState<string>('all')
  const [selectedShipments, setSelectedShipments] = useState<string[]>([])

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/merchant/auth/login')
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !merchant) {
    return null
  }

  const filteredShipments = shipments.filter(shipment => {
    const matchesSearch = shipment.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        shipment.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        shipment.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || shipment.status === statusFilter
    const matchesCarrier = carrierFilter === 'all' || shipment.carrier === carrierFilter
    return matchesSearch && matchesStatus && matchesCarrier
  })

  const handleSelectShipment = (shipmentId: string) => {
    setSelectedShipments(prev => 
      prev.includes(shipmentId) 
        ? prev.filter(id => id !== shipmentId)
        : [...prev, shipmentId]
    )
  }

  const handleSelectAll = () => {
    setSelectedShipments(
      selectedShipments.length === filteredShipments.length 
        ? [] 
        : filteredShipments.map(shipment => shipment.id)
    )
  }

  const stats = [
    {
      name: 'Total Shipments',
      value: shipments.length,
      icon: Truck,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      name: 'In Transit',
      value: shipments.filter(s => s.status === 'in_transit' || s.status === 'out_for_delivery').length,
      icon: Package,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      name: 'Delivered Today',
      value: shipments.filter(s => s.status === 'delivered' && s.actualDelivery === new Date().toISOString().split('T')[0]).length,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      name: 'Pending Pickup',
      value: shipments.filter(s => s.status === 'pending').length,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    }
  ]

  const carriers = [...new Set(shipments.map(s => s.carrier))]

  return (
    <MerchantLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Logistics</h1>
            <p className="text-gray-600">Manage shipments and delivery tracking</p>
          </div>
          <div className="flex gap-2">
            <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export
            </button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create Shipment
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon
            return (
              <div key={index} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <IconComponent className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
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
                  placeholder="Search shipments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending Pickup</option>
                <option value="picked_up">Picked Up</option>
                <option value="in_transit">In Transit</option>
                <option value="out_for_delivery">Out for Delivery</option>
                <option value="delivered">Delivered</option>
                <option value="failed">Failed</option>
              </select>
              <select
                value={carrierFilter}
                onChange={(e) => setCarrierFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Carriers</option>
                {carriers.map(carrier => (
                  <option key={carrier} value={carrier}>{carrier}</option>
                ))}
              </select>
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Date Range
              </button>
            </div>
          </div>
        </div>

        {/* Shipments Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">
                Shipments ({filteredShipments.length})
              </h3>
              {selectedShipments.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">
                    {selectedShipments.length} selected
                  </span>
                  <button className="text-sm text-blue-600 hover:text-blue-800">
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
                      checked={selectedShipments.length === filteredShipments.length && filteredShipments.length > 0}
                      onChange={handleSelectAll}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tracking
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Carrier
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Delivery
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredShipments.map((shipment) => {
                  const StatusIcon = statusIcons[shipment.status]
                  return (
                    <tr key={shipment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedShipments.includes(shipment.id)}
                          onChange={() => handleSelectShipment(shipment.id)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{shipment.orderNumber}</div>
                          <div className="text-sm text-gray-500">
                            {new Date(shipment.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{shipment.customer.name}</div>
                          <div className="text-sm text-gray-500">{shipment.customer.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{shipment.trackingNumber}</div>
                        <div className="text-sm text-gray-500">{shipment.carrier}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <StatusIcon className="h-4 w-4 mr-2 text-gray-400" />
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColors[shipment.status]}`}>
                            {statusLabels[shipment.status]}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{shipment.carrier}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {shipment.actualDelivery || shipment.estimatedDelivery}
                        </div>
                        <div className="text-sm text-gray-500">
                          {shipment.actualDelivery ? 'Delivered' : 'Estimated'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button className="text-blue-600 hover:text-blue-800" title="Track Shipment">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="text-gray-600 hover:text-gray-800" title="Edit Shipment">
                            <Edit className="h-4 w-4" />
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

          {filteredShipments.length === 0 && (
            <div className="text-center py-12">
              <Truck className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No shipments found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || statusFilter !== 'all' || carrierFilter !== 'all'
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Create your first shipment to get started.'
                }
              </p>
            </div>
          )}
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
