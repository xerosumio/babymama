import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useAdmin } from '@/contexts/AdminContext'
import AdminLayout from '@/components/Admin/Layout/AdminLayout'
import {
  Building2,
  Search,
  Filter,
  Plus,
  MoreVertical,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Edit,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  TrendingUp,
  Users,
  Package,
  DollarSign
} from 'lucide-react'

interface Merchant {
  id: string
  name: string
  email: string
  phone: string
  address: string
  status: 'active' | 'pending' | 'suspended' | 'inactive'
  registrationDate: string
  totalOrders: number
  totalRevenue: number
  totalProducts: number
  rating: number
  category: string
  description: string
}

const mockMerchants: Merchant[] = [
  {
    id: '1',
    name: 'Baby Essentials Store',
    email: 'contact@babyessentials.com',
    phone: '+852 1234 5678',
    address: 'Central, Hong Kong',
    status: 'active',
    registrationDate: '2024-01-15',
    totalOrders: 245,
    totalRevenue: 45680,
    totalProducts: 89,
    rating: 4.8,
    category: 'Baby Care',
    description: 'Premium baby care products and essentials'
  },
  {
    id: '2',
    name: 'Tiny Tots Fashion',
    email: 'info@tinytots.com',
    phone: '+852 2345 6789',
    address: 'Tsim Sha Tsui, Hong Kong',
    status: 'pending',
    registrationDate: '2024-02-20',
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    rating: 0,
    category: 'Clothing',
    description: 'Fashionable baby and toddler clothing'
  },
  {
    id: '3',
    name: 'Safe & Sound Toys',
    email: 'hello@safesoundtoys.com',
    phone: '+852 3456 7890',
    address: 'Causeway Bay, Hong Kong',
    status: 'active',
    registrationDate: '2024-01-10',
    totalOrders: 189,
    totalRevenue: 32150,
    totalProducts: 156,
    rating: 4.6,
    category: 'Toys',
    description: 'Educational and safe toys for children'
  },
  {
    id: '4',
    name: 'Mama\'s Choice',
    email: 'support@mamaschoice.com',
    phone: '+852 4567 8901',
    address: 'Admiralty, Hong Kong',
    status: 'suspended',
    registrationDate: '2024-01-05',
    totalOrders: 67,
    totalRevenue: 12340,
    totalProducts: 45,
    rating: 3.2,
    category: 'Maternity',
    description: 'Maternity and nursing essentials'
  }
]

const statusColors = {
  active: 'bg-green-100 text-green-800',
  pending: 'bg-yellow-100 text-yellow-800',
  suspended: 'bg-red-100 text-red-800',
  inactive: 'bg-gray-100 text-gray-800'
}

const statusLabels = {
  active: 'Active',
  pending: 'Pending',
  suspended: 'Suspended',
  inactive: 'Inactive'
}

export default function MerchantsPage() {
  const router = useRouter()
  const { adminUser, isAuthenticated, isLoading } = useAdmin()
  const [merchants, setMerchants] = useState<Merchant[]>(mockMerchants)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedMerchants, setSelectedMerchants] = useState<string[]>([])

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

  const filteredMerchants = merchants.filter(merchant => {
    const matchesSearch = merchant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        merchant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        merchant.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || merchant.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleStatusChange = (merchantId: string, newStatus: Merchant['status']) => {
    setMerchants(merchants.map(merchant => 
      merchant.id === merchantId ? { ...merchant, status: newStatus } : merchant
    ))
  }

  const handleSelectMerchant = (merchantId: string) => {
    setSelectedMerchants(prev => 
      prev.includes(merchantId) 
        ? prev.filter(id => id !== merchantId)
        : [...prev, merchantId]
    )
  }

  const handleSelectAll = () => {
    setSelectedMerchants(
      selectedMerchants.length === filteredMerchants.length 
        ? [] 
        : filteredMerchants.map(merchant => merchant.id)
    )
  }

  const stats = [
    {
      name: 'Total Merchants',
      value: merchants.length,
      icon: Building2,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      name: 'Active Merchants',
      value: merchants.filter(m => m.status === 'active').length,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      name: 'Pending Approval',
      value: merchants.filter(m => m.status === 'pending').length,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    },
    {
      name: 'Total Revenue',
      value: `HK$${merchants.reduce((sum, m) => sum + m.totalRevenue, 0).toLocaleString()}`,
      icon: DollarSign,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    }
  ]

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Merchants</h1>
            <p className="text-gray-600">Manage merchant accounts and approvals</p>
          </div>
          <button className="bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700 flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Merchant
          </button>
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
                  placeholder="Search merchants..."
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
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="suspended">Suspended</option>
                <option value="inactive">Inactive</option>
              </select>
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                <Filter className="h-4 w-4" />
                More Filters
              </button>
            </div>
          </div>
        </div>

        {/* Merchants Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">
                Merchants ({filteredMerchants.length})
              </h3>
              {selectedMerchants.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">
                    {selectedMerchants.length} selected
                  </span>
                  <button className="text-sm text-red-600 hover:text-red-800">
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
                      checked={selectedMerchants.length === filteredMerchants.length && filteredMerchants.length > 0}
                      onChange={handleSelectAll}
                      className="h-4 w-4 text-sky-600 focus:ring-sky-500 border-gray-300 rounded"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Merchant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Orders
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Revenue
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredMerchants.map((merchant) => (
                  <tr key={merchant.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedMerchants.includes(merchant.id)}
                        onChange={() => handleSelectMerchant(merchant.id)}
                        className="h-4 w-4 text-sky-600 focus:ring-sky-500 border-gray-300 rounded"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-sky-100 flex items-center justify-center">
                          <Building2 className="h-5 w-5 text-sky-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{merchant.name}</div>
                          <div className="text-sm text-gray-500">{merchant.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColors[merchant.status]}`}>
                        {statusLabels[merchant.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{merchant.category}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{merchant.totalOrders}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">HK${merchant.totalRevenue.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <span className="text-sm text-gray-900">{merchant.rating}</span>
                        {merchant.rating > 0 && (
                          <span className="ml-1 text-yellow-400">★</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button className="text-sky-600 hover:text-sky-800">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-800">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-800">
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredMerchants.length === 0 && (
            <div className="text-center py-12">
              <Building2 className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No merchants found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Get started by adding a new merchant.'
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
