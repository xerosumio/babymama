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
  contactPerson: string
  businessType: 'individual' | 'company'
  businessLicense?: string
  taxId?: string
  commissionRate: number
  payoutAccount: {
    type: 'bank' | 'paypal' | 'stripe'
    accountId: string
    accountName: string
  }
  createdAt: string
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
    description: 'Premium baby care products and essentials',
    contactPerson: 'John Smith',
    businessType: 'company',
    commissionRate: 8,
    payoutAccount: {
      type: 'bank',
      accountId: '1234567890',
      accountName: 'Baby Essentials Store Ltd'
    },
    createdAt: '2024-01-15'
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
    description: 'Fashionable baby and toddler clothing',
    contactPerson: 'Jane Doe',
    businessType: 'individual',
    commissionRate: 10,
    payoutAccount: {
      type: 'paypal',
      accountId: 'jane.doe@tinytots.com',
      accountName: 'Jane Doe'
    },
    createdAt: '2024-02-20'
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
    description: 'Educational and safe toys for children',
    contactPerson: 'Mike Johnson',
    businessType: 'company',
    commissionRate: 12,
    payoutAccount: {
      type: 'bank',
      accountId: '3456789012',
      accountName: 'Safe & Sound Toys Ltd'
    },
    createdAt: '2024-01-10'
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
    description: 'Maternity and nursing essentials',
    contactPerson: 'Sarah Wilson',
    businessType: 'individual',
    commissionRate: 15,
    payoutAccount: {
      type: 'stripe',
      accountId: 'acct_sarah_wilson',
      accountName: 'Sarah Wilson'
    },
    createdAt: '2024-01-05'
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
  const [merchants, setMerchants] = useState<Merchant[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedMerchants, setSelectedMerchants] = useState<string[]>([])
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    pending: 0,
    suspended: 0,
    inactive: 0
  })
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null)
  const [selectedMerchant, setSelectedMerchant] = useState<Merchant | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [confirmAction, setConfirmAction] = useState<{
    type: 'approve' | 'reject' | 'suspend' | 'reactivate' | 'deactivate'
    merchantId: string
    merchantName: string
  } | null>(null)

  // Fetch merchants from API
  useEffect(() => {
    const fetchMerchants = async () => {
      try {
        const token = localStorage.getItem('adminToken')
        const response = await fetch('/api/admin/merchants', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        
        if (response.ok) {
          const data = await response.json()
          setMerchants(data.merchants)
          setStats(data.stats)
        } else {
          console.error('Failed to fetch merchants')
        }
      } catch (error) {
        console.error('Error fetching merchants:', error)
      } finally {
        setLoading(false)
      }
    }

    if (isAuthenticated) {
      fetchMerchants()
    }
  }, [isAuthenticated])

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
                        (merchant.contactPerson && merchant.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesStatus = statusFilter === 'all' || merchant.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleStatusChange = async (merchantId: string, newStatus: Merchant['status']) => {
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch(`/api/admin/merchants/${merchantId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      })

      if (response.ok) {
        setMerchants(merchants.map(merchant => 
          merchant.id === merchantId ? { ...merchant, status: newStatus } : merchant
        ))
        // Refresh stats
        const statsResponse = await fetch('/api/admin/merchants', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        if (statsResponse.ok) {
          const data = await statsResponse.json()
          setStats(data.stats)
        }
        setNotification({ type: 'success', message: `Merchant status updated to ${newStatus}` })
        setTimeout(() => setNotification(null), 3000)
      } else {
        console.error('Failed to update merchant status')
        setNotification({ type: 'error', message: 'Failed to update merchant status' })
        setTimeout(() => setNotification(null), 3000)
      }
    } catch (error) {
      console.error('Error updating merchant status:', error)
    }
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

  const handleViewMerchant = (merchant: Merchant) => {
    setSelectedMerchant(merchant)
    setShowDetailModal(true)
  }

  const handleApproveMerchant = async (merchantId: string) => {
    await handleStatusChange(merchantId, 'active')
    setShowDetailModal(false)
  }

  const handleRejectMerchant = async (merchantId: string) => {
    await handleStatusChange(merchantId, 'inactive')
    setShowDetailModal(false)
  }

  const handleSuspendMerchant = async (merchantId: string) => {
    await handleStatusChange(merchantId, 'suspended')
    setShowDetailModal(false)
  }

  const showConfirmDialog = (type: 'approve' | 'reject' | 'suspend' | 'reactivate' | 'deactivate', merchantId: string, merchantName: string) => {
    setConfirmAction({ type, merchantId, merchantName })
    setShowConfirmModal(true)
  }

  const getMerchantStatus = (merchantId: string) => {
    return merchants.find(m => m.id === merchantId)?.status || 'pending'
  }

  const handleConfirmAction = async () => {
    if (!confirmAction) return

    let newStatus: string
    switch (confirmAction.type) {
      case 'approve':
      case 'reactivate':
        newStatus = 'active'
        break
      case 'reject':
      case 'deactivate':
        newStatus = 'inactive'
        break
      case 'suspend':
        newStatus = 'suspended'
        break
      default:
        return
    }

    await handleStatusChange(confirmAction.merchantId, newStatus as any)
    setShowConfirmModal(false)
    setShowDetailModal(false)
    setConfirmAction(null)
  }

  const handleCancelAction = () => {
    setShowConfirmModal(false)
    setConfirmAction(null)
  }

  const statsData = [
    {
      name: 'Total Merchants',
      value: stats.total,
      icon: Building2,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      name: 'Active Merchants',
      value: stats.active,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      name: 'Pending Approval',
      value: stats.pending,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    },
    {
      name: 'Suspended',
      value: stats.suspended,
      icon: XCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    }
  ]

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Notification */}
        {notification && (
          <div className={`fixed top-4 right-4 z-50 p-4 rounded-md shadow-lg ${
            notification.type === 'success' 
              ? 'bg-green-100 text-green-800 border border-green-200' 
              : 'bg-red-100 text-red-800 border border-red-200'
          }`}>
            <div className="flex items-center">
              <span className="font-medium">{notification.message}</span>
              <button 
                onClick={() => setNotification(null)}
                className="ml-4 text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Merchants</h1>
            <p className="text-gray-600">Manage merchant accounts and approvals</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsData.map((stat, index) => {
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
                    Business Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact Person
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Registration Date
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
                    <td className="px-6 py-4 text-sm text-gray-900">{merchant.businessType}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{merchant.contactPerson}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{merchant.phone}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {new Date(merchant.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        {/* 待审核商家 - 通过/拒绝 */}
                        {merchant.status === 'pending' && (
                          <>
                            <button 
                              onClick={() => showConfirmDialog('approve', merchant.id, merchant.name)}
                              className="text-green-600 hover:text-green-800"
                              title="Approve"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => showConfirmDialog('reject', merchant.id, merchant.name)}
                              className="text-red-600 hover:text-red-800"
                              title="Reject"
                            >
                              <XCircle className="h-4 w-4" />
                            </button>
                          </>
                        )}
                        
                        {/* 已通过商家 - 暂停/停用 */}
                        {merchant.status === 'active' && (
                          <>
                            <button 
                              onClick={() => showConfirmDialog('suspend', merchant.id, merchant.name)}
                              className="text-yellow-600 hover:text-yellow-800"
                              title="Suspend"
                            >
                              <Clock className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => showConfirmDialog('deactivate', merchant.id, merchant.name)}
                              className="text-red-600 hover:text-red-800"
                              title="Deactivate"
                            >
                              <XCircle className="h-4 w-4" />
                            </button>
                          </>
                        )}
                        
                        {/* 已暂停商家 - 恢复/停用 */}
                        {merchant.status === 'suspended' && (
                          <>
                            <button 
                              onClick={() => showConfirmDialog('reactivate', merchant.id, merchant.name)}
                              className="text-green-600 hover:text-green-800"
                              title="Reactivate"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => showConfirmDialog('deactivate', merchant.id, merchant.name)}
                              className="text-red-600 hover:text-red-800"
                              title="Deactivate"
                            >
                              <XCircle className="h-4 w-4" />
                            </button>
                          </>
                        )}
                        
                        {/* 审核失败商家 - 重新审核 */}
                        {merchant.status === 'inactive' && (
                          <button 
                            onClick={() => showConfirmDialog('reactivate', merchant.id, merchant.name)}
                            className="text-green-600 hover:text-green-800"
                            title="Re-approve"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                        )}
                        <button 
                          onClick={() => handleViewMerchant(merchant)}
                          className="text-sky-600 hover:text-sky-800"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
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

        {/* Merchant Detail Modal */}
        {showDetailModal && selectedMerchant && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Merchant Details - {selectedMerchant.name}
                  </h3>
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircle className="h-6 w-6" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <h4 className="text-md font-semibold text-gray-900 border-b pb-2">Basic Information</h4>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Business Name</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedMerchant.name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Business Type</label>
                      <p className="mt-1 text-sm text-gray-900 capitalize">{selectedMerchant.businessType}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Contact Person</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedMerchant.contactPerson}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedMerchant.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Phone</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedMerchant.phone}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Status</label>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColors[selectedMerchant.status]}`}>
                        {statusLabels[selectedMerchant.status]}
                      </span>
                    </div>
                  </div>

                  {/* Address Information */}
                  <div className="space-y-4">
                    <h4 className="text-md font-semibold text-gray-900 border-b pb-2">Address Information</h4>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Street</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedMerchant.address}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Full Address</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedMerchant.address}</p>
                    </div>
                  </div>

                  {/* Business Information */}
                  <div className="space-y-4">
                    <h4 className="text-md font-semibold text-gray-900 border-b pb-2">Business Information</h4>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Business License</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedMerchant.businessLicense || 'Not provided'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Tax ID</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedMerchant.taxId || 'Not provided'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Commission Rate</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedMerchant.commissionRate}%</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Registration Date</label>
                      <p className="mt-1 text-sm text-gray-900">{new Date(selectedMerchant.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>

                  {/* Bank Account Information */}
                  <div className="space-y-4">
                    <h4 className="text-md font-semibold text-gray-900 border-b pb-2">Bank Account Information</h4>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Account Name</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedMerchant.payoutAccount.accountName || 'Not provided'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Account Number</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedMerchant.payoutAccount.accountId || 'Not provided'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Account Type</label>
                      <p className="mt-1 text-sm text-gray-900 capitalize">{selectedMerchant.payoutAccount.type}</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 flex justify-end space-x-3">
                  {/* 待审核商家 - 通过/拒绝 */}
                  {selectedMerchant.status === 'pending' && (
                    <>
                      <button
                        onClick={() => showConfirmDialog('approve', selectedMerchant.id, selectedMerchant.name)}
                        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve
                      </button>
                      <button
                        onClick={() => showConfirmDialog('reject', selectedMerchant.id, selectedMerchant.name)}
                        className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 flex items-center"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject
                      </button>
                    </>
                  )}
                  
                  {/* 已通过商家 - 暂停/停用 */}
                  {selectedMerchant.status === 'active' && (
                    <>
                      <button
                        onClick={() => showConfirmDialog('suspend', selectedMerchant.id, selectedMerchant.name)}
                        className="bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700 flex items-center"
                      >
                        <Clock className="h-4 w-4 mr-2" />
                        Suspend
                      </button>
                      <button
                        onClick={() => showConfirmDialog('deactivate', selectedMerchant.id, selectedMerchant.name)}
                        className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 flex items-center"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Deactivate
                      </button>
                    </>
                  )}
                  
                  {/* 已暂停商家 - 恢复/停用 */}
                  {selectedMerchant.status === 'suspended' && (
                    <>
                      <button
                        onClick={() => showConfirmDialog('reactivate', selectedMerchant.id, selectedMerchant.name)}
                        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Reactivate
                      </button>
                      <button
                        onClick={() => showConfirmDialog('deactivate', selectedMerchant.id, selectedMerchant.name)}
                        className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 flex items-center"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Deactivate
                      </button>
                    </>
                  )}
                  
                  {/* 审核失败商家 - 重新审核 */}
                  {selectedMerchant.status === 'inactive' && (
                    <button
                      onClick={() => showConfirmDialog('reactivate', selectedMerchant.id, selectedMerchant.name)}
                      className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Re-approve
                    </button>
                  )}
                  
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Confirmation Modal */}
        {showConfirmModal && confirmAction && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
                  {confirmAction.type === 'approve' || confirmAction.type === 'reactivate' ? (
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  ) : confirmAction.type === 'suspend' ? (
                    <Clock className="h-6 w-6 text-yellow-600" />
                  ) : (
                    <XCircle className="h-6 w-6 text-red-600" />
                  )}
                </div>
                
                <div className="text-center">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {confirmAction.type === 'approve' && 'Approve Merchant'}
                    {confirmAction.type === 'reject' && 'Reject Merchant'}
                    {confirmAction.type === 'suspend' && 'Suspend Merchant'}
                    {confirmAction.type === 'reactivate' && (getMerchantStatus(confirmAction.merchantId) === 'inactive' ? 'Re-approve Merchant' : 'Reactivate Merchant')}
                    {confirmAction.type === 'deactivate' && 'Deactivate Merchant'}
                  </h3>
                  
                  <p className="text-sm text-gray-500 mb-4">
                    {confirmAction.type === 'approve' && `Are you sure you want to approve "${confirmAction.merchantName}"? This will allow them to login and start selling.`}
                    {confirmAction.type === 'reject' && `Are you sure you want to reject "${confirmAction.merchantName}"? This will deny their application.`}
                    {confirmAction.type === 'suspend' && `Are you sure you want to suspend "${confirmAction.merchantName}"? This will temporarily disable their account.`}
                    {confirmAction.type === 'reactivate' && getMerchantStatus(confirmAction.merchantId) === 'inactive' 
                      ? `Are you sure you want to re-approve "${confirmAction.merchantName}"? This will reactivate their application.`
                      : `Are you sure you want to reactivate "${confirmAction.merchantName}"? This will restore their access.`
                    }
                    {confirmAction.type === 'deactivate' && `Are you sure you want to deactivate "${confirmAction.merchantName}"? This will permanently disable their account.`}
                  </p>
                  
                  <div className="flex justify-center space-x-3">
                    <button
                      onClick={handleCancelAction}
                      className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleConfirmAction}
                      className={`px-4 py-2 rounded-md text-white ${
                        confirmAction.type === 'approve' || confirmAction.type === 'reactivate'
                          ? 'bg-green-600 hover:bg-green-700'
                          : confirmAction.type === 'suspend'
                          ? 'bg-yellow-600 hover:bg-yellow-700'
                          : 'bg-red-600 hover:bg-red-700'
                      }`}
                    >
                      {confirmAction.type === 'approve' && 'Approve'}
                      {confirmAction.type === 'reject' && 'Reject'}
                      {confirmAction.type === 'suspend' && 'Suspend'}
                      {confirmAction.type === 'reactivate' && (getMerchantStatus(confirmAction.merchantId) === 'inactive' ? 'Re-approve' : 'Reactivate')}
                      {confirmAction.type === 'deactivate' && 'Deactivate'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
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
