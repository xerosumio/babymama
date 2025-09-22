import React from 'react'
import { useTranslation } from 'next-i18next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import ProductCard from './ProductCard'
import { Product } from '@/lib/types'

interface RecommendedProductsProps {
  products: Product[]
}

const RecommendedProducts: React.FC<RecommendedProductsProps> = ({ products }) => {
  const { t } = useTranslation('common')

  return (
    <section className="py-8 sm:py-12 bg-gray-50">
      <div className="container">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8">
          <div className="mb-4 sm:mb-0">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              {t('homepage.recommendedForYou')}
            </h2>
            <p className="text-sm sm:text-base text-gray-600">
              {t('homepage.recommendedSubtitle')}
            </p>
          </div>
          <Link
            href="/products?filter=recommended"
            className="flex items-center space-x-2 text-baby-600 hover:text-baby-700 font-medium text-sm sm:text-base"
          >
            <span>{t('homepage.featuredProducts.viewAll')}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {products.slice(0, 6).map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default RecommendedProducts
