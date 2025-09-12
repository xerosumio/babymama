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
          <div className="container py-16">
            <div className="text-center">
              <ShoppingBag className="w-24 h-24 text-gray-400 mx-auto mb-6" />
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {t('cart.empty')}
              </h1>
              <p className="text-gray-600 mb-8">
                Looks like you haven't added any items to your cart yet.
              </p>
              <div className="space-x-4">
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
        <div className="container py-8">
          <div className="flex items-center mb-8">
            <button
              onClick={() => router.back()}
              className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </button>
            <h1 className="text-3xl font-bold text-gray-900">
              {t('cart.title')}
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6">
                  <div className="space-y-6">
                    {state.items.map((item) => (
                      <div key={item._id} className="flex items-center space-x-4 py-4 border-b border-gray-200 last:border-b-0">
                        {/* Product Image */}
                        <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
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
                          <h3 className="text-lg font-medium text-gray-900 truncate">
                            {item.product.name[locale]}
                          </h3>
                          {item.variant && (
                            <p className="text-sm text-gray-600">
                              {item.variant.name[locale]}
                            </p>
                          )}
                          <p className="text-sm text-gray-500">
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
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-12 text-center font-medium">
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
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <p className="text-lg font-semibold text-gray-900">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatPrice(item.price)} each
                          </p>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => removeFromCart(item.productId, item.variantId)}
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Order Summary
                </h2>

                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('cart.subtotal')}</span>
                    <span className="font-medium">{formatPrice(state.total)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('cart.shipping')}</span>
                    <span className="font-medium">
                      {state.total >= 500 ? 'Free' : formatPrice(50)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('cart.tax')}</span>
                    <span className="font-medium">{formatPrice(0)}</span>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between">
                      <span className="text-lg font-semibold text-gray-900">{t('cart.total')}</span>
                      <span className="text-lg font-semibold text-gray-900">
                        {formatPrice(state.total + (state.total >= 500 ? 0 : 50))}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <button
                    onClick={handleCheckout}
                    className="w-full bg-baby-500 text-white py-3 px-6 rounded-lg hover:bg-baby-600 transition-colors font-medium"
                  >
                    {t('cart.checkout')}
                  </button>
                  
                  <button
                    onClick={handleContinueShopping}
                    className="w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    {t('cart.continueShopping')}
                  </button>
                </div>

                {state.total < 500 && (
                  <div className="mt-4 p-3 bg-baby-50 rounded-lg">
                    <p className="text-sm text-baby-700">
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

