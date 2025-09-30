import React from 'react'
import { GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useRouter } from 'next/router'
import Image from 'next/image'
import Layout from '@/components/Layout/Layout'
import { useWishlist } from '@/contexts/WishlistContext'
import { useCart } from '@/contexts/CartContext'
import { useTranslation } from 'next-i18next'
import { Heart, ShoppingCart, Trash2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

const WishlistPage: React.FC = () => {
  const { t } = useTranslation('common')
  const router = useRouter()
  const { state, removeFromWishlist } = useWishlist()
  const { addToCart } = useCart()
  const locale = router.locale as 'en' | 'zh-HK'

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-HK', {
      style: 'currency',
      currency: 'HKD',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const handleAddToCart = (product: any) => {
    addToCart(product, 1)
  }

  const handleContinueShopping = () => {
    router.push('/products')
  }

  if (state.items.length === 0) {
    return (
      <Layout>
      <div className="bg-gray-50 min-h-screen">
        <div className="container py-8 sm:py-16 px-3 sm:px-4">
          <div className="text-center">
            <Heart className="w-16 h-16 sm:w-24 sm:h-24 text-gray-400 mx-auto mb-4 sm:mb-6" />
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
              {t('wishlist.emptyTitle')}
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">
              {t('wishlist.emptyDescription')}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <button
                onClick={handleContinueShopping}
                className="btn btn-primary btn-lg text-sm sm:text-base"
              >
                {t('wishlist.startShopping')}
              </button>
              <Link href="/" className="btn btn-outline btn-lg text-sm sm:text-base">
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen">
        <div className="container py-4 sm:py-8 px-3 sm:px-4">
          <div className="flex items-center mb-6 sm:mb-8">
            <button
              onClick={() => router.back()}
              className="flex items-center text-gray-600 hover:text-gray-900 mr-3 sm:mr-4"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
              <span className="text-sm sm:text-base">Back</span>
            </button>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {t('wishlist.title')}
            </h1>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {state.items.map((product) => (
              <div key={product._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden group hover:shadow-md transition-shadow">
                <div className="relative">
                  <Link href={`/product/${product.slug}`}>
                    <Image
                      src={product.images[0]}
                      alt={product.name[locale]}
                      width={300}
                      height={300}
                      className="w-full h-48 sm:h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </Link>
                  
                  <button
                    onClick={() => removeFromWishlist(product._id)}
                    className="absolute top-2 sm:top-3 right-2 sm:right-3 p-1.5 sm:p-2 bg-white/80 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-500 hover:text-white"
                  >
                    <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                </div>

                <div className="p-3 sm:p-4">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    {product.merchant?.name || 'BRAND'}
                  </div>
                  
                  <Link href={`/product/${product.slug}`}>
                    <h3 className="font-medium text-gray-900 hover:text-baby-600 transition-colors line-clamp-2 mb-2 text-sm sm:text-base">
                      {product.name[locale]}
                    </h3>
                  </Link>

                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      {product.compareAtPrice && product.compareAtPrice > product.price && (
                        <span className="text-xs sm:text-sm text-gray-500 line-through">
                          {formatPrice(product.compareAtPrice)}
                        </span>
                      )}
                      <span className="text-base sm:text-lg font-bold text-baby-600">
                        {formatPrice(product.price)}
                      </span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="flex-1 flex items-center justify-center px-3 sm:px-4 py-2 bg-baby-600 text-white text-xs sm:text-sm font-medium rounded-md hover:bg-baby-700 transition-colors"
                    >
                      <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                      {t('wishlist.addToCart')}
                    </button>
                    
                    <button
                      onClick={() => removeFromWishlist(product._id)}
                      className="px-3 sm:px-4 py-2 border border-gray-300 text-gray-700 text-xs sm:text-sm font-medium rounded-md hover:bg-gray-50 transition-colors"
                    >
                      <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              {t('wishlist.continueShopping')}
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'en', ['common'])),
    },
  }
}

export default WishlistPage
