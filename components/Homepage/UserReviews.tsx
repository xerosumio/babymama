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
    <section className="py-8 sm:py-12">
      <div className="container">
        <div className="text-left mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            {t('homepage.userReviews')}
          </h2>
          <p className="text-sm sm:text-base text-gray-600">
            {t('homepage.userReviewsSubtitle')}
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {reviews.map((review) => (
            <div
              key={review._id}
              className="bg-white rounded-lg shadow-md p-4 sm:p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center mb-3 sm:mb-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-baby-100 rounded-full flex items-center justify-center mr-2 sm:mr-3">
                  <span className="text-baby-600 font-semibold text-xs sm:text-sm">
                    {review.user.firstName.charAt(0)}{review.user.lastName.charAt(0)}
                  </span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm sm:text-base">
                    {review.user.firstName} {review.user.lastName}
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-500">
                    {formatDate(new Date(review.createdAt))}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center mb-2 sm:mb-3">
                {renderStars(review.rating)}
              </div>
              
              <h5 className="font-medium text-gray-900 mb-2 text-sm sm:text-base">{review.title}</h5>
              <p className="text-gray-700 text-xs sm:text-sm leading-relaxed">
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
