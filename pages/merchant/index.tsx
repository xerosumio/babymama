import React from 'react'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { GetStaticProps } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Store, Shield, Globe, ArrowRight, CheckCircle, Star, Zap, Users, BarChart3, Package, ShoppingBag } from 'lucide-react'

const MerchantHomePage: React.FC = () => {
  const { t } = useTranslation('common')
  const router = useRouter()

  const features = [
    {
      icon: BarChart3,
      title: 'Dashboard Analytics',
      description: 'Track your sales performance and business metrics in real-time'
    },
    {
      icon: Package,
      title: 'Product Management',
      description: 'Easily manage your product catalog, inventory, and pricing'
    },
    {
      icon: ShoppingBag,
      title: 'Order Management',
      description: 'Process orders, track shipments, and manage customer service'
    },
    {
      icon: Users,
      title: 'Customer Insights',
      description: 'Understand your customers and build lasting relationships'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-baby-500 rounded-full flex items-center justify-center">
                <Store className="h-6 w-6 text-white" />
              </div>
              <div className="ml-3">
                <h1 className="text-xl font-bold text-gray-900">Merchant Portal</h1>
                <p className="text-gray-500 text-sm">Your Business, Our Platform</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Link
                href="/admin"
                className="flex items-center px-3 py-2 text-gray-600 hover:text-baby-600 hover:bg-baby-50 rounded-md text-sm font-medium transition-colors"
              >
                <Shield className="h-4 w-4 mr-1" />
                Admin
              </Link>
              <Link
                href="/"
                className="flex items-center px-3 py-2 text-gray-600 hover:text-baby-600 hover:bg-baby-50 rounded-md text-sm font-medium transition-colors"
              >
                <Globe className="h-4 w-4 mr-1" />
                Customer
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <Link
                href="/merchant/auth/login"
                className="text-gray-600 hover:text-baby-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Sign In
              </Link>
              <Link
                href="/merchant/auth/register"
                className="bg-baby-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-baby-700 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Spacer for fixed header */}
      <div className="h-20"></div>

      {/* Hero Section */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Grow Your Baby Business
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Join thousands of merchants selling baby products on BabyMama. 
              Manage your store, track sales, and grow your business with our powerful merchant tools.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/merchant/auth/register"
                className="bg-orange-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-orange-700 transition-colors"
              >
                Start Selling Today
              </Link>
              <Link
                href="/merchant/auth/login"
                className="border border-gray-300 text-gray-700 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our comprehensive merchant platform provides all the tools you need to manage and grow your baby product business.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon
              return (
                <div key={index} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <IconComponent className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-orange-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-12">
              Join Our Growing Community
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">10,000+</div>
                <div className="text-orange-100">Active Merchants</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">$50M+</div>
                <div className="text-orange-100">Monthly Sales</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">99.9%</div>
                <div className="text-orange-100">Uptime</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of successful merchants and start selling your baby products today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/merchant/auth/register"
              className="bg-orange-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-orange-700 transition-colors"
            >
              Create Your Store
            </Link>
            <Link
              href="/merchant/auth/login"
              className="border border-gray-300 text-gray-700 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Access Your Account
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">BabyMama</h3>
              <p className="text-gray-400">
                The leading platform for baby product merchants to grow their business.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-4">For Merchants</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/merchant/auth/register" className="hover:text-white">Get Started</Link></li>
                <li><Link href="/merchant/auth/login" className="hover:text-white">Sign In</Link></li>
                <li><Link href="/merchant/dashboard" className="hover:text-white">Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Contact Us</a></li>
                <li><a href="#" className="hover:text-white">Documentation</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">About Us</a></li>
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 BabyMama. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'en', ['common']))
    }
  }
}

export default MerchantHomePage