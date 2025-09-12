import React, { useState } from 'react'
import { GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import Layout from '@/components/Layout/Layout'
import { useCart } from '@/contexts/CartContext'
import { CreditCard, Smartphone, Shield, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

const CheckoutPage: React.FC = () => {
  const { t } = useTranslation('common')
  const router = useRouter()
  const { state, clearCart } = useCart()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Hong Kong',
    paymentMethod: 'card',
    sameAsShipping: true
  })

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-HK', {
      style: 'currency',
      currency: 'HKD',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement actual checkout logic
    console.log('Checkout data:', formData)
    console.log('Cart items:', state.items)
    
    // Simulate successful order
    alert('Order placed successfully! (This is a demo)')
    clearCart()
    router.push('/orders/success')
  }

  const shippingCost = state.total >= 500 ? 0 : 50
  const total = state.total + shippingCost

  if (state.items.length === 0) {
    return (
      <Layout>
        <div className="bg-gray-50 min-h-screen">
          <div className="container py-16">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Your cart is empty
              </h1>
              <p className="text-gray-600 mb-8">
                Add some items to your cart before checking out.
              </p>
              <Link href="/products" className="btn btn-primary btn-lg">
                Continue Shopping
              </Link>
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
              {t('checkout.title')}
            </h1>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Checkout Form */}
              <div className="lg:col-span-2 space-y-8">
                {/* Step 1: Shipping Information */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    {t('checkout.shippingAddress')}
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="input w-full"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="input w-full"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        className="input w-full"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                        className="input w-full"
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Address *
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                        className="input w-full"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        className="input w-full"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Postal Code *
                      </label>
                      <input
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        required
                        className="input w-full"
                      />
                    </div>
                  </div>
                </div>

                {/* Step 2: Payment Method */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    {t('checkout.paymentMethod')}
                  </h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 p-4 border border-gray-300 rounded-lg">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="card"
                        checked={formData.paymentMethod === 'card'}
                        onChange={handleInputChange}
                        className="text-baby-600"
                      />
                      <CreditCard className="w-5 h-5 text-gray-600" />
                      <span className="font-medium">Credit/Debit Card</span>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-4 border border-gray-300 rounded-lg">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="alipay"
                        checked={formData.paymentMethod === 'alipay'}
                        onChange={handleInputChange}
                        className="text-baby-600"
                      />
                      <Smartphone className="w-5 h-5 text-gray-600" />
                      <span className="font-medium">AlipayHK</span>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-4 border border-gray-300 rounded-lg">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="payme"
                        checked={formData.paymentMethod === 'payme'}
                        onChange={handleInputChange}
                        className="text-baby-600"
                      />
                      <Smartphone className="w-5 h-5 text-gray-600" />
                      <span className="font-medium">PayMe</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    {t('checkout.orderSummary')}
                  </h2>

                  {/* Cart Items */}
                  <div className="space-y-4 mb-6">
                    {state.items.map((item) => (
                      <div key={item._id} className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={item.product.images[0] || '/placeholder-product.jpg'}
                            alt={item.product.name[router.locale as 'en' | 'zh-HK']}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {item.product.name[router.locale as 'en' | 'zh-HK']}
                          </p>
                          <p className="text-sm text-gray-500">
                            Qty: {item.quantity}
                          </p>
                        </div>
                        <p className="text-sm font-medium text-gray-900">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Order Totals */}
                  <div className="space-y-3 border-t border-gray-200 pt-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">{formatPrice(state.total)}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-medium">
                        {shippingCost === 0 ? 'Free' : formatPrice(shippingCost)}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax</span>
                      <span className="font-medium">{formatPrice(0)}</span>
                    </div>
                    
                    <div className="border-t border-gray-200 pt-3">
                      <div className="flex justify-between">
                        <span className="text-lg font-semibold text-gray-900">Total</span>
                        <span className="text-lg font-semibold text-gray-900">
                          {formatPrice(total)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Security Notice */}
                  <div className="mt-6 p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Shield className="w-5 h-5 text-green-600" />
                      <span className="text-sm text-green-700 font-medium">
                        Secure Payment
                      </span>
                    </div>
                    <p className="text-sm text-green-600 mt-1">
                      Your payment information is encrypted and secure.
                    </p>
                  </div>

                  {/* Place Order Button */}
                  <button
                    type="submit"
                    className="w-full bg-baby-500 text-white py-3 px-6 rounded-lg hover:bg-baby-600 transition-colors font-medium mt-6"
                  >
                    {t('checkout.placeOrder')}
                  </button>
                </div>
              </div>
            </div>
          </form>
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

export default CheckoutPage

