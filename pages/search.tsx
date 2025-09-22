import React, { useState, useEffect } from 'react'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Layout from '@/components/Layout/Layout'
import ProductCard from '@/components/Homepage/ProductCard'
import { Product } from '@/lib/types'
import { mockProducts } from '@/lib/mockData'
import { Search, Filter, SortAsc } from 'lucide-react'

interface SearchPageProps {
  products: Product[]
  query: string
  totalResults: number
  currentPage: number
  totalPages: number
}

const SearchPage: React.FC<SearchPageProps> = ({ 
  products, 
  query, 
  totalResults, 
  currentPage, 
  totalPages 
}) => {
  const router = useRouter()
  const [sortBy, setSortBy] = useState('relevance')

  const handleSortChange = (value: string) => {
    setSortBy(value)
    router.push({
      pathname: '/search',
      query: { ...router.query, sort: value, page: '1' }
    })
  }

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen">
        <div className="container py-4 sm:py-8 px-3 sm:px-4">
          {/* Results Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                {query ? `Search results for "${query}"` : 'Search Results'}
              </h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1">
                {totalResults} {totalResults === 1 ? 'result' : 'results'} found
              </p>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-4 mt-4 sm:mt-0">
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="input w-32 sm:w-40 text-xs sm:text-sm"
              >
                <option value="relevance">Most Relevant</option>
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name A-Z</option>
              </select>
            </div>
          </div>

          {/* Results */}
          {products.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-6 sm:mt-8">
                  <div className="flex space-x-1 sm:space-x-2">
                    <button
                      onClick={() => router.push({ 
                        pathname: '/search', 
                        query: { ...router.query, page: currentPage - 1 } 
                      })}
                      disabled={currentPage === 1}
                      className="btn btn-outline btn-xs sm:btn-sm disabled:opacity-50 text-xs sm:text-sm"
                    >
                      Previous
                    </button>
                    
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => router.push({ 
                          pathname: '/search', 
                          query: { ...router.query, page: i + 1 } 
                        })}
                        className={`btn btn-xs sm:btn-sm text-xs sm:text-sm ${
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
                        pathname: '/search', 
                        query: { ...router.query, page: currentPage + 1 } 
                      })}
                      disabled={currentPage === totalPages}
                      className="btn btn-outline btn-xs sm:btn-sm disabled:opacity-50 text-xs sm:text-sm"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8 sm:py-12">
              <Search className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                No products found
              </h3>
              <p className="text-sm sm:text-base text-gray-600 mb-6">
                Try adjusting your search terms or browse our categories
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <button
                  onClick={() => router.push('/products')}
                  className="btn btn-primary text-sm sm:text-base"
                >
                  Browse All Products
                </button>
                <button
                  onClick={() => router.push('/')}
                  className="btn btn-outline text-sm sm:text-base"
                >
                  Back to Home
                </button>
              </div>
            </div>
          )}
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
    q = '', 
    page = '1', 
    sort = 'relevance' 
  } = query

  const searchQuery = q as string
  const pageNum = parseInt(page as string, 10)
  const limit = 12
  const skip = (pageNum - 1) * limit

  // Use mock data for development without database
  if (!searchQuery.trim()) {
    return {
      props: {
        products: [],
        query: searchQuery,
        totalResults: 0,
        currentPage: 1,
        totalPages: 0,
        ...(await serverSideTranslations(locale ?? 'en', ['common'])),
      },
    }
  }

  // Filter products based on search query
  let filteredProducts = mockProducts.filter(product => {
    const searchTerm = searchQuery.toLowerCase()
    return product.isActive && (
      product.name.en.toLowerCase().includes(searchTerm) ||
      product.name['zh-HK'].toLowerCase().includes(searchTerm) ||
      product.description.en.toLowerCase().includes(searchTerm) ||
      product.description['zh-HK'].toLowerCase().includes(searchTerm) ||
      product.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    )
  })

  // Apply sorting
  switch (sort) {
    case 'newest':
      filteredProducts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      break
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
      query: searchQuery,
      totalResults: totalCount,
      currentPage: pageNum,
      totalPages,
      ...(await serverSideTranslations(locale ?? 'en', ['common'])),
    },
  }
}

export default SearchPage
