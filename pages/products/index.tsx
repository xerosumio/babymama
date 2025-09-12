import React, { useState } from 'react'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Layout from '@/components/Layout/Layout'
import ProductCard from '@/components/Homepage/ProductCard'
import { Product } from '@/lib/types'
import { mockProducts, mockCategories } from '@/lib/mockData'
import { Filter, SortAsc, Grid, List } from 'lucide-react'

interface ProductsPageProps {
  products: Product[]
  categories: any[]
  totalPages: number
  currentPage: number
}

const ProductsPage: React.FC<ProductsPageProps> = ({ 
  products, 
  categories, 
  totalPages, 
  currentPage 
}) => {
  const router = useRouter()
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState('newest')
  const [priceRange, setPriceRange] = useState({ min: '', max: '' })
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])

  const handleSortChange = (value: string) => {
    setSortBy(value)
    const query = { ...router.query, sort: value, page: '1' }
    router.push({ pathname: router.pathname, query })
  }

  const handleCategoryToggle = (categoryId: string) => {
    const newCategories = selectedCategories.includes(categoryId)
      ? selectedCategories.filter(id => id !== categoryId)
      : [...selectedCategories, categoryId]
    
    setSelectedCategories(newCategories)
    const query = { 
      ...router.query, 
      categories: newCategories.join(','), 
      page: '1' 
    }
    router.push({ pathname: router.pathname, query })
  }

  const handlePriceFilter = () => {
    const query = { 
      ...router.query, 
      minPrice: priceRange.min,
      maxPrice: priceRange.max,
      page: '1' 
    }
    router.push({ pathname: router.pathname, query })
  }

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen">
        <div className="container py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters */}
            <div className="lg:w-1/4">
              <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                
                {/* Categories */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Categories</h4>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <label key={category._id} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(category._id)}
                          onChange={() => handleCategoryToggle(category._id)}
                          className="rounded border-gray-300 text-baby-600 focus:ring-baby-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          {category.name[router.locale as 'en' | 'zh-HK']}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Price Range</h4>
                  <div className="space-y-3">
                    <div className="flex space-x-2">
                      <input
                        type="number"
                        placeholder="Min"
                        value={priceRange.min}
                        onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                        className="input w-full"
                      />
                      <input
                        type="number"
                        placeholder="Max"
                        value={priceRange.max}
                        onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                        className="input w-full"
                      />
                    </div>
                    <button
                      onClick={handlePriceFilter}
                      className="btn btn-primary btn-sm w-full"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:w-3/4">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">All Products</h1>
                  <p className="text-gray-600 mt-1">
                    {products.length} products found
                  </p>
                </div>
                
                <div className="flex items-center space-x-4 mt-4 sm:mt-0">
                  {/* Sort */}
                  <select
                    value={sortBy}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="input w-40"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="name">Name A-Z</option>
                  </select>

                  {/* View Mode */}
                  <div className="flex border border-gray-300 rounded-md">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 ${viewMode === 'grid' ? 'bg-baby-500 text-white' : 'text-gray-600'}`}
                    >
                      <Grid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 ${viewMode === 'list' ? 'bg-baby-500 text-white' : 'text-gray-600'}`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Products Grid/List */}
              <div className={
                viewMode === 'grid' 
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
                  : 'space-y-4'
              }>
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-8">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => router.push({ 
                        pathname: router.pathname, 
                        query: { ...router.query, page: currentPage - 1 } 
                      })}
                      disabled={currentPage === 1}
                      className="btn btn-outline btn-sm disabled:opacity-50"
                    >
                      Previous
                    </button>
                    
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => router.push({ 
                          pathname: router.pathname, 
                          query: { ...router.query, page: i + 1 } 
                        })}
                        className={`btn btn-sm ${
                          currentPage === i + 1 
                            ? 'btn-primary' 
                            : 'btn-outline'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    
                    <button
                      onClick={() => router.push({ 
                        pathname: router.pathname, 
                        query: { ...router.query, page: currentPage + 1 } 
                      })}
                      disabled={currentPage === totalPages}
                      className="btn btn-outline btn-sm disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ 
  query, 
  locale 
}) => {
  const { 
    page = '1', 
    sort = 'newest', 
    categories = '', 
    minPrice = '', 
    maxPrice = '',
    search = ''
  } = query

  const pageNum = parseInt(page as string, 10)
  const limit = 12
  const skip = (pageNum - 1) * limit

  // Use mock data for development without database
  let filteredProducts = mockProducts.filter(product => product.isActive)
  
  // Apply filters
  if (categories) {
    const categoryIds = (categories as string).split(',')
    filteredProducts = filteredProducts.filter(product => 
      categoryIds.includes(product.categoryId)
    )
  }
  
  if (minPrice || maxPrice) {
    filteredProducts = filteredProducts.filter(product => {
      if (minPrice && product.price < parseInt(minPrice as string, 10)) return false
      if (maxPrice && product.price > parseInt(maxPrice as string, 10)) return false
      return true
    })
  }
  
  if (search) {
    const searchTerm = (search as string).toLowerCase()
    filteredProducts = filteredProducts.filter(product => 
      product.name.en.toLowerCase().includes(searchTerm) ||
      product.name['zh-HK'].toLowerCase().includes(searchTerm) ||
      product.description.en.toLowerCase().includes(searchTerm) ||
      product.description['zh-HK'].toLowerCase().includes(searchTerm)
    )
  }

  // Apply sorting
  switch (sort) {
    case 'oldest':
      filteredProducts.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
      break
    case 'price-low':
      filteredProducts.sort((a, b) => a.price - b.price)
      break
    case 'price-high':
      filteredProducts.sort((a, b) => b.price - a.price)
      break
    case 'name':
      filteredProducts.sort((a, b) => a.name.en.localeCompare(b.name.en))
      break
    default:
      filteredProducts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  // Apply pagination
  const totalCount = filteredProducts.length
  const totalPages = Math.ceil(totalCount / limit)
  const products = filteredProducts.slice(skip, skip + limit)

  return {
    props: {
      products: JSON.parse(JSON.stringify(products)),
      categories: JSON.parse(JSON.stringify(mockCategories)),
      totalPages,
      currentPage: pageNum,
      ...(await serverSideTranslations(locale ?? 'en', ['common'])),
    },
  }
}

export default ProductsPage
