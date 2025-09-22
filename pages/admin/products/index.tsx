import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useAdmin } from '@/contexts/AdminContext'
import AdminLayout from '@/components/Admin/Layout/AdminLayout'
import {
  Package,
  Search,
  Filter,
  MoreVertical,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Edit,
  Trash2,
  Star,
  StarOff,
  AlertCircle,
  CheckCircle2,
  XCircle2,
  Clock3,
  FileText,
  User
} from 'lucide-react'

interface Product {
  _id: string
  name: {
    en: string
    'zh-HK': string
  }
  description: {
    en: string
    'zh-HK': string
  }
  price: number
  images: string[]
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'active' | 'inactive'
  isActive: boolean
  isFeatured: boolean
  isNew: boolean
  reviewNotes?: string
  reviewedAt?: string
  reviewedBy?: {
    firstName: string
    lastName: string
    email: string
  }
  categoryId: {
    name: {
      en: string
      'zh-HK': string
    }
    slug: string
  }
  merchantId: {
    name: string
    email: string
    status: string
  }
  createdAt: string
  updatedAt: string
}

interface ProductStats {
  pending: number
  approved: number
  rejected: number
  active: number
  inactive: number
  draft: number
}

export default function AdminProducts() {
  const router = useRouter()
  const { isAdmin, isLoading } = useAdmin()
  const [products, setProducts] = useState<Product[]>([])
  const [stats, setStats] = useState<ProductStats>({
    pending: 0,
    approved: 0,
    rejected: 0,
    active: 0,
    inactive: 0,
    draft: 0
  })
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [merchantFilter, setMerchantFilter] = useState('')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [confirmAction, setConfirmAction] = useState<{
    type: 'approve' | 'reject' | 'activate' | 'deactivate' | 'feature' | 'unfeature' | 'delete'
    productId: string
    productName: string
  } | null>(null)
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null)

  const statusLabels = {
    draft: 'Draft',
    pending: 'Pending Review',
    approved: 'Approved',
    rejected: 'Rejected',
    active: 'Active',
    inactive: 'Inactive'
  }

  const statusColors = {
    draft: 'bg-gray-100 text-gray-800',
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    active: 'bg-blue-100 text-blue-800',
    inactive: 'bg-gray-100 text-gray-800'
  }

  const statsData = [
    {
      title: 'Pending Review',
      value: stats.pending,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    },
    {
      title: 'Approved',
      value: stats.approved,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Active',
      value: stats.active,
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Rejected',
      value: stats.rejected,
      icon: XCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    }
  ]

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem('adminToken')
        const params = new URLSearchParams()
        
        if (searchTerm) params.append('search', searchTerm)
        if (statusFilter) params.append('status', statusFilter)
        if (merchantFilter) params.append('merchantId', merchantFilter)

        const response = await fetch(`/api/admin/products?${params.toString()}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        
        if (response.ok) {
          const data = await response.json()
          setProducts(data.products)
          setStats(data.stats)
        } else {
          console.error('Failed to fetch products')
        }
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setLoading(false)
      }
    }

    if (isAdmin) {
      fetchProducts()
    }
  }, [isAdmin, searchTerm, statusFilter, merchantFilter])

  const handleStatusChange = async (productId: string, newStatus: string, additionalData: any = {}) => {
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          status: newStatus,
          ...additionalData
        })
      })

      if (response.ok) {
        const updatedProduct = await response.json()
        setProducts(products.map(product =>
          product._id === productId ? updatedProduct : product
        ))
        setNotification({ type: 'success', message: 'Product status updated successfully' })
        setShowConfirmModal(false)
        setShowDetailModal(false)
        setConfirmAction(null)
      } else {
        setNotification({ type: 'error', message: 'Failed to update product status' })
      }
    } catch (error) {
      console.error('Error updating product status:', error)
      setNotification({ type: 'error', message: 'Failed to update product status' })
    }
  }

  const showConfirmDialog = (type: string, productId: string, productName: string) => {
    setConfirmAction({ type: type as any, productId, productName })
    setShowConfirmModal(true)
  }

  const handleConfirmAction = async () => {
    if (!confirmAction) return

    let newStatus: string
    let additionalData: any = {}

    switch (confirmAction.type) {
      case 'approve':
        newStatus = 'approved'
        additionalData.isActive = true
        break
      case 'reject':
        newStatus = 'rejected'
        additionalData.isActive = false
        break
      case 'activate':
        newStatus = 'active'
        additionalData.isActive = true
        break
      case 'deactivate':
        newStatus = 'inactive'
        additionalData.isActive = false
        break
      case 'feature':
        additionalData.isFeatured = true
        newStatus = confirmAction.productId // 保持当前状态
        break
      case 'unfeature':
        additionalData.isFeatured = false
        newStatus = confirmAction.productId // 保持当前状态
        break
      case 'delete':
        // 处理删除逻辑
        try {
          const token = localStorage.getItem('adminToken')
          const response = await fetch(`/api/admin/products/${confirmAction.productId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
          })
          
          if (response.ok) {
            setProducts(products.filter(p => p._id !== confirmAction.productId))
            setNotification({ type: 'success', message: 'Product deleted successfully' })
          } else {
            setNotification({ type: 'error', message: 'Failed to delete product' })
          }
        } catch (error) {
          setNotification({ type: 'error', message: 'Failed to delete product' })
        }
        setShowConfirmModal(false)
        setShowDetailModal(false)
        setConfirmAction(null)
        return
      default:
        return
    }

    await handleStatusChange(confirmAction.productId, newStatus, additionalData)
  }

  const handleCancelAction = () => {
    setShowConfirmModal(false)
    setConfirmAction(null)
  }

  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product)
    setShowDetailModal(true)
  }

  // 客户端重定向逻辑
  useEffect(() => {
    if (!isLoading && !isAdmin) {
      router.push('/admin/auth/login')
    }
  }, [isLoading, isAdmin, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-sky-600"></div>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-sky-600"></div>
      </div>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Notification */}
        {notification && (
          <div className={`fixed top-4 right-4 z-50 p-4 rounded-md shadow-lg ${
            notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {notification.message}
            <button
              onClick={() => setNotification(null)}
              className="ml-4 text-lg font-bold"
            >
              ×
            </button>
          </div>
        )}

        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Products</h1>
            <p className="text-gray-600">Manage product approvals and listings</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsData.map((stat, index) => {
            const IconComponent = stat.icon
            return (
              <div key={index} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <IconComponent className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="sm:col-span-1 lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-md focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                />
              </div>
            </div>
            <div className="sm:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full py-3 text-base sm:text-sm border border-gray-300 rounded-md focus:ring-sky-500 focus:border-sky-500"
              >
                <option value="">All Status</option>
                <option value="pending">Pending Review</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="draft">Draft</option>
              </select>
            </div>
            <div className="sm:col-span-2 lg:col-span-1 flex items-end">
              <button
                onClick={() => {
                  setSearchTerm('')
                  setStatusFilter('')
                  setMerchantFilter('')
                }}
                className="w-full bg-gray-500 text-white px-4 sm:px-6 py-3 rounded-md hover:bg-gray-600 flex items-center justify-center"
              >
                <Filter className="h-4 w-4 mr-2" />
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Merchant</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600 mx-auto"></div>
                    </td>
                  </tr>
                ) : products.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                      No products found
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12">
                            {product.images && product.images.length > 0 ? (
                              <img
                                className="h-12 w-12 rounded-lg object-cover"
                                src={product.images[0]}
                                alt={product.name.en}
                              />
                            ) : (
                              <div className="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center">
                                <Package className="h-6 w-6 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{product.name.en}</div>
                            <div className="text-sm text-gray-500">{product.name['zh-HK']}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{product.merchantId ? product.merchantId.name : 'Unknown Merchant'}</div>
                        <div className="text-sm text-gray-500">{product.merchantId ? product.merchantId.email : 'No Email'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {product.categoryId ? product.categoryId.name.en : 'No Category'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${product.price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColors[product.status]}`}>
                          {statusLabels[product.status]}
                        </span>
                        {product.isFeatured && (
                          <span className="ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                            Featured
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(product.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          {/* 根据状态显示不同操作 */}
                          {product.status === 'pending' && (
                            <>
                              <button
                                onClick={() => showConfirmDialog('approve', product._id, product.name.en)}
                                className="text-green-600 hover:text-green-800"
                                title="Approve"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => showConfirmDialog('reject', product._id, product.name.en)}
                                className="text-red-600 hover:text-red-800"
                                title="Reject"
                              >
                                <XCircle className="h-4 w-4" />
                              </button>
                            </>
                          )}
                          
                          {product.status === 'approved' && (
                            <button
                              onClick={() => showConfirmDialog('activate', product._id, product.name.en)}
                              className="text-blue-600 hover:text-blue-800"
                              title="Activate"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </button>
                          )}
                          
                          {product.status === 'active' && (
                            <>
                              <button
                                onClick={() => showConfirmDialog('deactivate', product._id, product.name.en)}
                                className="text-yellow-600 hover:text-yellow-800"
                                title="Deactivate"
                              >
                                <Clock className="h-4 w-4" />
                              </button>
                              {!product.isFeatured ? (
                                <button
                                  onClick={() => showConfirmDialog('feature', product._id, product.name.en)}
                                  className="text-purple-600 hover:text-purple-800"
                                  title="Feature"
                                >
                                  <Star className="h-4 w-4" />
                                </button>
                              ) : (
                                <button
                                  onClick={() => showConfirmDialog('unfeature', product._id, product.name.en)}
                                  className="text-gray-600 hover:text-gray-800"
                                  title="Unfeature"
                                >
                                  <StarOff className="h-4 w-4" />
                                </button>
                              )}
                            </>
                          )}
                          
                          <button
                            onClick={() => handleViewProduct(product)}
                            className="text-sky-600 hover:text-sky-800"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          
                          <button
                            onClick={() => showConfirmDialog('delete', product._id, product.name.en)}
                            className="text-red-600 hover:text-red-800"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Product Detail Modal */}
        {showDetailModal && selectedProduct && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Product Details</h3>
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircle className="h-6 w-6" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Product Name (EN)</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedProduct.name.en}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Product Name (ZH)</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedProduct.name['zh-HK']}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Price</label>
                      <p className="mt-1 text-sm text-gray-900">${selectedProduct.price.toFixed(2)}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Status</label>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColors[selectedProduct.status]}`}>
                        {statusLabels[selectedProduct.status]}
                      </span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Merchant</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedProduct.merchantId ? selectedProduct.merchantId.name : 'Unknown Merchant'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Category</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedProduct.categoryId ? selectedProduct.categoryId.name.en : 'No Category'}</p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Description (EN)</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedProduct.description.en}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Description (ZH)</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedProduct.description['zh-HK']}</p>
                  </div>
                  
                  {selectedProduct.reviewNotes && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Review Notes</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedProduct.reviewNotes}</p>
                    </div>
                  )}
                  
                  {selectedProduct.reviewedBy && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Reviewed By</label>
                      <p className="mt-1 text-sm text-gray-900">
                        {selectedProduct.reviewedBy.firstName} {selectedProduct.reviewedBy.lastName}
                      </p>
                    </div>
                  )}
                  
                  {selectedProduct.reviewedAt && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Reviewed At</label>
                      <p className="mt-1 text-sm text-gray-900">
                        {new Date(selectedProduct.reviewedAt).toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="mt-6 flex justify-end space-x-3">
                  {selectedProduct.status === 'pending' && (
                    <>
                      <button
                        onClick={() => showConfirmDialog('approve', selectedProduct._id, selectedProduct.name.en)}
                        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve
                      </button>
                      <button
                        onClick={() => showConfirmDialog('reject', selectedProduct._id, selectedProduct.name.en)}
                        className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 flex items-center"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject
                      </button>
                    </>
                  )}
                  
                  {selectedProduct.status === 'approved' && (
                    <button
                      onClick={() => showConfirmDialog('activate', selectedProduct._id, selectedProduct.name.en)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Activate
                    </button>
                  )}
                  
                  {selectedProduct.status === 'active' && (
                    <>
                      <button
                        onClick={() => showConfirmDialog('deactivate', selectedProduct._id, selectedProduct.name.en)}
                        className="bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700 flex items-center"
                      >
                        <Clock className="h-4 w-4 mr-2" />
                        Deactivate
                      </button>
                      {!selectedProduct.isFeatured ? (
                        <button
                          onClick={() => showConfirmDialog('feature', selectedProduct._id, selectedProduct.name.en)}
                          className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 flex items-center"
                        >
                          <Star className="h-4 w-4 mr-2" />
                          Feature
                        </button>
                      ) : (
                        <button
                          onClick={() => showConfirmDialog('unfeature', selectedProduct._id, selectedProduct.name.en)}
                          className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 flex items-center"
                        >
                          <StarOff className="h-4 w-4 mr-2" />
                          Unfeature
                        </button>
                      )}
                    </>
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
              <div className="mt-3 text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                  {confirmAction.type === 'approve' || confirmAction.type === 'activate' ? (
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  ) : confirmAction.type === 'reject' || confirmAction.type === 'deactivate' || confirmAction.type === 'delete' ? (
                    <XCircle className="h-6 w-6 text-red-600" />
                  ) : (
                    <AlertCircle className="h-6 w-6 text-yellow-600" />
                  )}
                </div>
                
                <div className="text-center">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {confirmAction.type === 'approve' && 'Approve Product'}
                    {confirmAction.type === 'reject' && 'Reject Product'}
                    {confirmAction.type === 'activate' && 'Activate Product'}
                    {confirmAction.type === 'deactivate' && 'Deactivate Product'}
                    {confirmAction.type === 'feature' && 'Feature Product'}
                    {confirmAction.type === 'unfeature' && 'Unfeature Product'}
                    {confirmAction.type === 'delete' && 'Delete Product'}
                  </h3>
                  
                  <p className="text-sm text-gray-500 mb-4">
                    {confirmAction.type === 'approve' && `Are you sure you want to approve "${confirmAction.productName}"? This will make it available for activation.`}
                    {confirmAction.type === 'reject' && `Are you sure you want to reject "${confirmAction.productName}"? This will deny the product listing.`}
                    {confirmAction.type === 'activate' && `Are you sure you want to activate "${confirmAction.productName}"? This will make it visible to customers.`}
                    {confirmAction.type === 'deactivate' && `Are you sure you want to deactivate "${confirmAction.productName}"? This will hide it from customers.`}
                    {confirmAction.type === 'feature' && `Are you sure you want to feature "${confirmAction.productName}"? This will highlight it on the homepage.`}
                    {confirmAction.type === 'unfeature' && `Are you sure you want to unfeature "${confirmAction.productName}"? This will remove it from featured products.`}
                    {confirmAction.type === 'delete' && `Are you sure you want to delete "${confirmAction.productName}"? This action cannot be undone.`}
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
                      className={`px-4 py-2 rounded-md text-white font-medium ${
                        confirmAction.type === 'approve' || confirmAction.type === 'activate' || confirmAction.type === 'feature'
                          ? 'bg-green-600 hover:bg-green-700'
                          : confirmAction.type === 'reject' || confirmAction.type === 'deactivate' || confirmAction.type === 'unfeature' || confirmAction.type === 'delete'
                          ? 'bg-red-600 hover:bg-red-700'
                          : 'bg-yellow-600 hover:bg-yellow-700'
                      }`}
                    >
                      {confirmAction.type === 'approve' && 'Approve'}
                      {confirmAction.type === 'reject' && 'Reject'}
                      {confirmAction.type === 'activate' && 'Activate'}
                      {confirmAction.type === 'deactivate' && 'Deactivate'}
                      {confirmAction.type === 'feature' && 'Feature'}
                      {confirmAction.type === 'unfeature' && 'Unfeature'}
                      {confirmAction.type === 'delete' && 'Delete'}
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
