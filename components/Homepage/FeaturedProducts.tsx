import React from 'react'
import { useTranslation } from 'next-i18next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import ProductCard from './ProductCard'
import { Product } from '@/lib/types'

interface FeaturedProductsProps {
  products: Product[]
}

const FeaturedProducts: React.FC<FeaturedProductsProps> = ({ products }) => {
  const { t } = useTranslation('common')

  return (
    <section className="py-16 bg-white">
      <div className="container">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {t('homepage.featuredProducts.title')}
            </h2>
            <p className="text-gray-600">
              {t('homepage.featuredProducts.subtitle')}
            </p>
          </div>
          <Link
            href="/products"
            className="flex items-center space-x-2 text-baby-600 hover:text-baby-700 font-medium"
          >
            <span>{t('homepage.featuredProducts.viewAll')}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturedProducts
