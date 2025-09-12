import React from 'react'
import { GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import Layout from '@/components/Layout/Layout'
import { CheckCircle, ShoppingBag, ArrowRight } from 'lucide-react'
import Link from 'next/link'

const OrderSuccessPage: React.FC = () => {
  const { t } = useTranslation('common')

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen">
        <div className="container py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-8">
              <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-6" />
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Order Placed Successfully!
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Thank you for your purchase. We'll send you a confirmation email shortly.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                What's Next?
              </h2>
              
              <div className="space-y-4 text-left">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-baby-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-baby-600 font-semibold text-sm">1</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Order Confirmation</h3>
                    <p className="text-gray-600 text-sm">
                      You'll receive an email confirmation with your order details and tracking information.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-baby-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-baby-600 font-semibold text-sm">2</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Processing</h3>
                    <p className="text-gray-600 text-sm">
                      Our team will prepare your order for shipment within 1-2 business days.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-baby-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-baby-600 font-semibold text-sm">3</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Shipping</h3>
                    <p className="text-gray-600 text-sm">
                      Your order will be shipped and you'll receive tracking information via email.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-baby-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-baby-600 font-semibold text-sm">4</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Delivery</h3>
                    <p className="text-gray-600 text-sm">
                      Your order will be delivered to your specified address within 3-5 business days.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center space-x-2 bg-baby-500 text-white px-6 py-3 rounded-lg hover:bg-baby-600 transition-colors font-medium"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>Continue Shopping</span>
                </Link>
                
                <Link
                  href="/orders"
                  className="inline-flex items-center justify-center space-x-2 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  <span>View Order History</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
              
              <p className="text-sm text-gray-500">
                Need help? Contact our customer service at{' '}
                <a href="tel:+85212345678" className="text-baby-600 hover:text-baby-700">
                  +852 1234 5678
                </a>
              </p>
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

export default OrderSuccessPage

