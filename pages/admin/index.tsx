import React from 'react'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { GetStaticProps } from 'next'
import Link from 'next/link'
import { Shield, Store, Globe, Users, BarChart3, ShoppingCart, Settings, Building2, Activity, CheckCircle, Star, Zap } from 'lucide-react'

const AdminHomePage: React.FC = () => {
  const { t } = useTranslation('common')

  const features = [
    {
      icon: Building2,
      title: 'Merchant Management',
      description: 'Manage merchant accounts, approvals, and performance monitoring'
    },
    {
      icon: BarChart3,
      title: 'Analytics Dashboard',
      description: 'Comprehensive analytics and reporting across the entire platform'
    },
    {
      icon: ShoppingCart,
      title: 'Order Monitoring',
      description: 'Real-time order tracking and customer service management'
    },
    {
      icon: Settings,
      title: 'System Settings',
      description: 'Configure platform settings, fees, and operational parameters'
    }
  ]

  const stats = [
    { label: 'Total Merchants', value: '2,847', change: '+12%' },
    { label: 'Active Orders', value: '15,432', change: '+8%' },
    { label: 'Monthly Revenue', value: '$2.4M', change: '+15%' },
    { label: 'Customer Satisfaction', value: '98.5%', change: '+2%' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div className="ml-3">
                <h1 className="text-xl font-bold text-gray-900">Admin Portal</h1>
                <p className="text-gray-500 text-sm">Platform Administration & Control</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Link
                href="/merchant"
                className="flex items-center px-3 py-2 text-gray-600 hover:text-pink-600 hover:bg-pink-50 rounded-md text-sm font-medium transition-colors"
              >
                <Store className="h-4 w-4 mr-1" />
                Merchant
              </Link>
              <Link
                href="/"
                className="flex items-center px-3 py-2 text-gray-600 hover:text-pink-600 hover:bg-pink-50 rounded-md text-sm font-medium transition-colors"
              >
                <Globe className="h-4 w-4 mr-1" />
                Customer
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <Link
                href="/admin/auth/login"
                className="bg-pink-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-pink-700 transition-colors"
              >
                Admin Login
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
              Platform Administration
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Manage and monitor the entire BabyMama platform. 
              Oversee merchants, track performance, and ensure smooth operations.
            </p>
            <Link
              href="/admin/auth/login"
              className="bg-orange-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-orange-700 transition-colors inline-block"
            >
              Access Admin Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-orange-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Platform Overview
            </h2>
            <p className="text-orange-100 text-lg">
              Real-time metrics and performance indicators
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-orange-100 mb-1">{stat.label}</div>
                <div className="text-green-300 text-sm">↗ {stat.change} from last month</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Administrative Tools
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive tools to manage every aspect of the BabyMama platform.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon
              return (
                <div key={index} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                    <IconComponent className="h-6 w-6 text-red-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Secure & Reliable
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Our admin portal is built with enterprise-grade security and reliability. 
                Access is restricted to authorized personnel only, with comprehensive audit trails.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Multi-factor authentication
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Role-based access control
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Comprehensive audit logs
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  99.9% uptime guarantee
                </li>
              </ul>
            </div>
            <div className="bg-gray-100 rounded-lg p-8">
              <div className="text-center">
                <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-12 h-12 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure Access</h3>
                <p className="text-gray-600 mb-4">
                  Only authorized administrators can access this portal. 
                  All activities are logged and monitored.
                </p>
                <Link
                  href="/admin/auth/login"
                  className="bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors inline-block"
                >
                  Login to Admin Portal
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">BabyMama Admin</h3>
              <p className="text-gray-400">
                Platform administration and management tools for the BabyMama ecosystem.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-4">Quick Access</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/admin/auth/login" className="hover:text-white">Admin Login</Link></li>
                <li><Link href="/admin/dashboard" className="hover:text-white">Dashboard</Link></li>
                <li><Link href="/admin/merchants" className="hover:text-white">Merchants</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">Documentation</a></li>
                <li><a href="#" className="hover:text-white">System Status</a></li>
                <li><a href="#" className="hover:text-white">Emergency Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 BabyMama Admin Portal. All rights reserved.</p>
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

export default AdminHomePage