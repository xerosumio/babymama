import React, { useState, useEffect } from 'react'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useRouter } from 'next/router'
import { Star, ArrowLeft, Edit, Trash2 } from 'lucide-react'
import Link from 'next/link'

interface Review {
  _id: string
  productId: {
    _id: string
    name: {
      en: string
      'zh-HK': string
    }
    images: string[]
  }
  rating: number
  title: string
  comment: string
  isVerified: boolean
  createdAt: string
  updatedAt: string
}

const ReviewsPage: React.FC = () => {
  const { t } = useTranslation('common')
  const router = useRouter()
  const [reviews, setReviews] = useState<Review[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchReviews()
  }, [])

  const fetchReviews = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/auth/login')
        return
      }

      const response = await fetch('/api/user/reviews', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setReviews(data.reviews || [])
      } else if (response.status === 401) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        router.push('/auth/login')
        return
      } else {
        throw new Error('Failed to fetch reviews')
      }
    } catch (error) {
      console.error('Error fetching reviews:', error)
      setError('Failed to load reviews')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete this review?')) {
      return
    }

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/user/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        await fetchReviews()
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to delete review')
      }
    } catch (error) {
      console.error('Error deleting review:', error)
      setError('Failed to delete review')
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ))
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-baby-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">{t('common.loading')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/account"
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Account</span>
              </Link>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">My Reviews</h1>
            <div className="w-24"></div> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Reviews List */}
        <div className="space-y-6">
          {reviews.length === 0 ? (
            <div className="text-center py-12">
              <Star className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No reviews yet</h3>
              <p className="mt-1 text-sm text-gray-500">You haven't written any reviews yet.</p>
              <div className="mt-6">
                <Link
                  href="/products"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-baby-600 hover:bg-baby-700"
                >
                  Browse Products
                </Link>
              </div>
            </div>
          ) : (
            reviews.map((review) => (
              <div key={review._id} className="bg-white shadow-sm rounded-lg p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4">
                      {review.productId.images && review.productId.images.length > 0 && (
                        <img
                          className="w-16 h-16 rounded-lg object-cover"
                          src={review.productId.images[0]}
                          alt={review.productId.name.en}
                        />
                      )}
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900">
                          {review.productId.name.en}
                        </h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <div className="flex items-center">
                            {renderStars(review.rating)}
                          </div>
                          <span className="text-sm text-gray-500">
                            {review.rating}/5
                          </span>
                          {review.isVerified && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Verified Purchase
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-900">{review.title}</h4>
                      <p className="mt-1 text-sm text-gray-600">{review.comment}</p>
                    </div>
                    
                    <div className="mt-4 text-xs text-gray-500">
                      Reviewed on {new Date(review.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleDelete(review._id)}
                      className="p-2 text-gray-400 hover:text-red-600"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export async function getServerSideProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common']))
    }
  }
}

export default ReviewsPage
