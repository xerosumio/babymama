import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useMerchant } from '@/contexts/MerchantContext'
import MerchantLayout from '@/components/Merchant/Layout/MerchantLayout'
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  MoreVertical,
  Package,
  AlertTriangle
} from 'lucide-react'

interface Product {
  _id: string
  name: string
  price: number
  comparePrice?: number
  category: string
  subCategory?: string
  images: string[]
  inventory: {
    quantity: number
    lowStockThreshold: number
  }
  status: 'draft' | 'active' | 'inactive' | 'out_of_stock'
  featured: boolean
  createdAt: string
  updatedAt: string
}

const mockProducts: Product[] = [
  {
    _id: '1',
    name: 'Premium Baby Stroller',
    price: 299.99,
    comparePrice: 399.99,
    category: 'gear-travel',
    subCategory: 'strollers',
    images: ['https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=400'],
    inventory: {
      quantity: 15,
      lowStockThreshold: 10
    },
    status: 'active',
    featured: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-15'
  },
  {
    _id: '2',
    name: 'Organic Baby Formula',
    price: 89.99,
    category: 'feeding',
    subCategory: 'formula',
    images: ['https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400'],
    inventory: {
      quantity: 5,
      lowStockThreshold: 10
    },
    status: 'active',
    featured: false,
    createdAt: '2024-01-02',
    updatedAt: '2024-01-14'
  },
  {
    _id: '3',
    name: 'Baby Bottle Set - 4 Pack',
    price: 49.99,
    category: 'feeding',
    subCategory: 'bottles',
    images: ['https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=400'],
    inventory: {
      quantity: 0,
      lowStockThreshold: 5
    },
    status: 'out_of_stock',
    featured: false,
    createdAt: '2024-01-03',
    updatedAt: '2024-01-13'
  },
  {
    _id: '4',
    name: 'Soft Baby Blanket',
    price: 39.99,
    category: 'clothing',
    subCategory: 'accessories',
    images: ['https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=400'],
    inventory: {
      quantity: 25,
      lowStockThreshold: 10
    },
    status: 'draft',
    featured: false,
    createdAt: '2024-01-04',
    updatedAt: '2024-01-12'
  }
]

export default function MerchantProducts() {
  const router = useRouter()
  const { merchant, isAuthenticated, isLoading } = useMerchant()
  const [products, setProducts] = useState<Product[]>(mockProducts)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showLowStock, setShowLowStock] = useState(false)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/merchant/auth/login')
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
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

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || product.status === statusFilter
    const matchesLowStock = !showLowStock || product.inventory.quantity <= product.inventory.lowStockThreshold
    return matchesSearch && matchesStatus && matchesLowStock
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'draft':
        return 'bg-gray-100 text-gray-800'
      case 'inactive':
        return 'bg-yellow-100 text-yellow-800'
      case 'out_of_stock':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Eye className="h-4 w-4" />
      case 'draft':
        return <EyeOff className="h-4 w-4" />
      case 'inactive':
        return <EyeOff className="h-4 w-4" />
      case 'out_of_stock':
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <Package className="h-4 w-4" />
    }
  }

  const handleDeleteProduct = (productId: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(p => p._id !== productId))
    }
  }

  const handleToggleStatus = (productId: string) => {
    setProducts(products.map(product => {
      if (product._id === productId) {
        const newStatus = product.status === 'active' ? 'inactive' : 'active'
        return { ...product, status: newStatus }
      }
      return product
    }))
  }

  return (
    <MerchantLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="sm:flex sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Products</h1>
            <p className="mt-2 text-sm text-gray-700">
              Manage your product inventory and listings
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Link
              href="/merchant/products/new"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700">
                Search
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Search products..."
                />
              </div>
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                id="status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="inactive">Inactive</option>
                <option value="out_of_stock">Out of Stock</option>
              </select>
            </div>

            <div className="flex items-end">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={showLowStock}
                  onChange={(e) => setShowLowStock(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Low Stock Only</span>
              </label>
            </div>

            <div className="flex items-end">
              <button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </button>
            </div>
          </div>
        </div>

        {/* Products table */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {filteredProducts.map((product) => (
              <li key={product._id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-16 w-16">
                        <img
                          className="h-16 w-16 rounded-lg object-cover"
                          src={product.images[0]}
                          alt={product.name}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="flex items-center">
                          <h3 className="text-lg font-medium text-gray-900">
                            {product.name}
                          </h3>
                          {product.featured && (
                            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              Featured
                            </span>
                          )}
                        </div>
                        <div className="mt-1 flex items-center text-sm text-gray-500">
                          <span className="font-medium text-gray-900">
                            HK${product.price}
                          </span>
                          {product.comparePrice && (
                            <span className="ml-2 line-through text-gray-400">
                              HK${product.comparePrice}
                            </span>
                          )}
                          <span className="mx-2">•</span>
                          <span className="capitalize">{product.category}</span>
                          {product.subCategory && (
                            <>
                              <span className="mx-1">/</span>
                              <span className="capitalize">{product.subCategory}</span>
                            </>
                          )}
                        </div>
                        <div className="mt-1 flex items-center text-sm">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>
                            {getStatusIcon(product.status)}
                            <span className="ml-1 capitalize">{product.status.replace('_', ' ')}</span>
                          </span>
                          <span className="ml-4 text-gray-500">
                            Stock: {product.inventory.quantity}
                          </span>
                          {product.inventory.quantity <= product.inventory.lowStockThreshold && (
                            <span className="ml-2 text-red-600 text-xs font-medium">
                              Low Stock
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleToggleStatus(product._id)}
                        className="text-gray-400 hover:text-gray-600"
                        title={product.status === 'active' ? 'Deactivate' : 'Activate'}
                      >
                        {product.status === 'active' ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                      <Link
                        href={`/merchant/products/${product._id}/edit`}
                        className="text-gray-400 hover:text-gray-600"
                        title="Edit"
                      >
                        <Edit className="h-5 w-5" />
                      </Link>
                      <button
                        onClick={() => handleDeleteProduct(product._id)}
                        className="text-gray-400 hover:text-red-600"
                        title="Delete"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                      <button className="text-gray-400 hover:text-gray-600">
                        <MoreVertical className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <Package className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No products found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || statusFilter !== 'all' || showLowStock
                  ? 'Try adjusting your filters'
                  : 'Get started by creating a new product'
                }
              </p>
              <div className="mt-6">
                <Link
                  href="/merchant/products/new"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Pagination */}
        {filteredProducts.length > 0 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <a
                href="#"
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Previous
              </a>
              <a
                href="#"
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Next
              </a>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredProducts.length}</span> of{' '}
                  <span className="font-medium">{filteredProducts.length}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <a
                    href="#"
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    Previous
                  </a>
                  <a
                    href="#"
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    Next
                  </a>
                </nav>
              </div>
            </div>
          </div>
        )}
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

