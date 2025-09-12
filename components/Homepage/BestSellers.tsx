import React from 'react'
import { useTranslation } from 'next-i18next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import ProductCard from './ProductCard'
import { Product } from '@/lib/types'

interface BestSellersProps {
  products: Product[]
}

const BestSellers: React.FC<BestSellersProps> = ({ products }) => {
  const { t } = useTranslation('common')

  return (
    <section className="py-12">
      <div className="container">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {t('homepage.bestSellers')}
            </h2>
            <p className="text-gray-600">
              {t('homepage.bestSellersSubtitle')}
            </p>
          </div>
          <Link
            href="/products?filter=bestsellers"
            className="flex items-center space-x-2 text-baby-600 hover:text-baby-700 font-medium"
          >
            <span>{t('homepage.featuredProducts.viewAll')}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.slice(0, 6).map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default BestSellers
