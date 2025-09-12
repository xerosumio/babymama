import React from 'react'
import { useTranslation } from 'next-i18next'
import { Star } from 'lucide-react'
import { Review } from '@/lib/types'

interface UserReviewsProps {
  reviews: Review[]
}

const UserReviews: React.FC<UserReviewsProps> = ({ reviews }) => {
  const { t } = useTranslation('common')

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

  const formatDate = (date: Date) => {
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return '1 day ago'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`
    return `${Math.ceil(diffDays / 30)} months ago`
  }

  return (
    <section className="py-12">
      <div className="container">
        <div className="text-left mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {t('homepage.userReviews')}
          </h2>
          <p className="text-gray-600">
            {t('homepage.userReviewsSubtitle')}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <div
              key={review._id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-baby-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-baby-600 font-semibold text-sm">
                    {review.user.firstName.charAt(0)}{review.user.lastName.charAt(0)}
                  </span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {review.user.firstName} {review.user.lastName}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {formatDate(new Date(review.createdAt))}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center mb-3">
                {renderStars(review.rating)}
              </div>
              
              <h5 className="font-medium text-gray-900 mb-2">{review.title}</h5>
              <p className="text-gray-700 text-sm leading-relaxed">
                {review.comment}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default UserReviews
