import React from 'react'
import { GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useRouter } from 'next/router'
import Image from 'next/image'
import Layout from '@/components/Layout/Layout'
import { useCart } from '@/contexts/CartContext'
import { useTranslation } from 'next-i18next'
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

const CartPage: React.FC = () => {
  const { t } = useTranslation('common')
  const router = useRouter()
  const { state, updateQuantity, removeFromCart, clearCart } = useCart()
  const locale = router.locale as 'en' | 'zh-HK'

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-HK', {
      style: 'currency',
      currency: 'HKD',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const handleQuantityChange = (productId: string, variantId: string | undefined, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, variantId)
    } else {
      updateQuantity(productId, variantId, quantity)
    }
  }

  const handleCheckout = () => {
    router.push('/checkout')
  }

  const handleContinueShopping = () => {
    router.push('/products')
  }

  if (state.items.length === 0) {
    return (
      <Layout>
        <div className="bg-gray-50 min-h-screen">
          <div className="container py-8 sm:py-16">
            <div className="text-center">
              <ShoppingBag className="w-16 h-16 sm:w-24 sm:h-24 text-gray-400 mx-auto mb-4 sm:mb-6" />
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
                {t('cart.empty')}
              </h1>
              <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">
                Looks like you haven't added any items to your cart yet.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <button
                  onClick={handleContinueShopping}
                  className="btn btn-primary btn-lg"
                >
                  {t('cart.continueShopping')}
                </button>
                <Link href="/" className="btn btn-outline btn-lg">
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
        <div className="container py-4 sm:py-8">
          <div className="flex items-center mb-6 sm:mb-8">
            <button
              onClick={() => router.back()}
              className="flex items-center text-gray-600 hover:text-gray-900 mr-3 sm:mr-4"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
              <span className="text-sm sm:text-base">Back</span>
            </button>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {t('cart.title')}
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-4 sm:p-6">
                  <div className="space-y-4 sm:space-y-6">
                    {state.items.map((item) => (
                      <div key={item._id} className="flex items-center space-x-3 sm:space-x-4 py-3 sm:py-4 border-b border-gray-200 last:border-b-0">
                        {/* Product Image */}
                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={item.product.images[0] || '/placeholder-product.jpg'}
                            alt={item.product.name[locale]}
                            width={80}
                            height={80}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm sm:text-lg font-medium text-gray-900 truncate">
                            {item.product.name[locale]}
                          </h3>
                          {item.variant && (
                            <p className="text-xs sm:text-sm text-gray-600">
                              {item.variant.name[locale]}
                            </p>
                          )}
                          <p className="text-xs sm:text-sm text-gray-500">
                            {item.product.merchant?.name}
                          </p>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleQuantityChange(
                              item.productId, 
                              item.variantId, 
                              item.quantity - 1
                            )}
                            className="p-1 border border-gray-300 rounded hover:bg-gray-50"
                          >
                            <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
                          </button>
                          <span className="w-8 sm:w-12 text-center font-medium text-sm sm:text-base">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(
                              item.productId, 
                              item.variantId, 
                              item.quantity + 1
                            )}
                            className="p-1 border border-gray-300 rounded hover:bg-gray-50"
                          >
                            <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <p className="text-base sm:text-lg font-semibold text-gray-900">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                          <p className="text-xs sm:text-sm text-gray-500">
                            {formatPrice(item.price)} each
                          </p>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => removeFromCart(item.productId, item.variantId)}
                          className="p-1.5 sm:p-2 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 sticky top-8">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">
                  Order Summary
                </h2>

                <div className="space-y-3 sm:space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm sm:text-base text-gray-600">{t('cart.subtotal')}</span>
                    <span className="font-medium text-sm sm:text-base">{formatPrice(state.total)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm sm:text-base text-gray-600">{t('cart.shipping')}</span>
                    <span className="font-medium text-sm sm:text-base">
                      {state.total >= 500 ? 'Free' : formatPrice(50)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm sm:text-base text-gray-600">{t('cart.tax')}</span>
                    <span className="font-medium text-sm sm:text-base">{formatPrice(0)}</span>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-3 sm:pt-4">
                    <div className="flex justify-between">
                      <span className="text-base sm:text-lg font-semibold text-gray-900">{t('cart.total')}</span>
                      <span className="text-base sm:text-lg font-semibold text-gray-900">
                        {formatPrice(state.total + (state.total >= 500 ? 0 : 50))}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 sm:mt-6 space-y-2 sm:space-y-3">
                  <button
                    onClick={handleCheckout}
                    className="w-full bg-baby-500 text-white py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg hover:bg-baby-600 transition-colors font-medium text-sm sm:text-base"
                  >
                    {t('cart.checkout')}
                  </button>
                  
                  <button
                    onClick={handleContinueShopping}
                    className="w-full border border-gray-300 text-gray-700 py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm sm:text-base"
                  >
                    {t('cart.continueShopping')}
                  </button>
                </div>

                {state.total < 500 && (
                  <div className="mt-3 sm:mt-4 p-2.5 sm:p-3 bg-baby-50 rounded-lg">
                    <p className="text-xs sm:text-sm text-baby-700">
                      Add {formatPrice(500 - state.total)} more for free shipping!
                    </p>
                  </div>
                )}
              </div>
            </div>
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

export default CartPage

