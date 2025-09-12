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
        <div className="container py-8">
          {/* Results Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {query ? `Search results for "${query}"` : 'Search Results'}
              </h1>
              <p className="text-gray-600 mt-1">
                {totalResults} {totalResults === 1 ? 'result' : 'results'} found
              </p>
            </div>
            
            <div className="flex items-center space-x-4 mt-4 sm:mt-0">
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="input w-40"
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
                        pathname: '/search', 
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
                          pathname: '/search', 
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
                        pathname: '/search', 
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
            </>
          ) : (
            <div className="text-center py-12">
              <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No products found
              </h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search terms or browse our categories
              </p>
              <div className="space-x-4">
                <button
                  onClick={() => router.push('/products')}
                  className="btn btn-primary"
                >
                  Browse All Products
                </button>
                <button
                  onClick={() => router.push('/')}
                  className="btn btn-outline"
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
