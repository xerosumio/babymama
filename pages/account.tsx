import React, { useState } from 'react'
import { GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import Layout from '@/components/Layout/Layout'
import { User, Package, MapPin, CreditCard, Star, Settings } from 'lucide-react'

const AccountPage: React.FC = () => {
  const { t } = useTranslation('common')
  const [activeTab, setActiveTab] = useState('profile')

  const tabs = [
    { id: 'profile', label: t('account.profile'), icon: User },
    { id: 'orders', label: t('account.orders'), icon: Package },
    { id: 'addresses', label: t('account.addresses'), icon: MapPin },
    { id: 'payment', label: t('account.paymentMethods'), icon: CreditCard },
    { id: 'reviews', label: t('account.reviews'), icon: Star },
    { id: 'settings', label: t('account.settings'), icon: Settings },
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Profile Information</h2>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    defaultValue="John"
                    className="input w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    defaultValue="Doe"
                    className="input w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    defaultValue="john.doe@example.com"
                    className="input w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    defaultValue="+852 1234 5678"
                    className="input w-full"
                  />
                </div>
              </div>
              <div className="mt-6">
                <button className="btn btn-primary">
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )

      case 'orders':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Order History</h2>
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 text-center text-gray-500">
                <Package className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p>No orders yet. Start shopping to see your orders here!</p>
                <button className="btn btn-primary mt-4">
                  Start Shopping
                </button>
              </div>
            </div>
          </div>
        )

      case 'addresses':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Addresses</h2>
              <button className="btn btn-primary">
                Add New Address
              </button>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="text-center text-gray-500">
                <MapPin className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p>No addresses saved yet.</p>
              </div>
            </div>
          </div>
        )

      case 'payment':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Payment Methods</h2>
              <button className="btn btn-primary">
                Add Payment Method
              </button>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="text-center text-gray-500">
                <CreditCard className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p>No payment methods saved yet.</p>
              </div>
            </div>
          </div>
        )

      case 'reviews':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">My Reviews</h2>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="text-center text-gray-500">
                <Star className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p>No reviews written yet.</p>
              </div>
            </div>
          </div>
        )

      case 'settings':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Language
                  </label>
                  <select className="input w-full max-w-xs">
                    <option value="en">English</option>
                    <option value="zh-HK">繁體中文</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Currency
                  </label>
                  <select className="input w-full max-w-xs">
                    <option value="HKD">Hong Kong Dollar (HKD)</option>
                    <option value="USD">US Dollar (USD)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Notifications
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" defaultChecked className="rounded border-gray-300 text-baby-600" />
                      <span className="ml-2 text-sm text-gray-700">Order updates</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" defaultChecked className="rounded border-gray-300 text-baby-600" />
                      <span className="ml-2 text-sm text-gray-700">Promotional emails</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-baby-600" />
                      <span className="ml-2 text-sm text-gray-700">Product recommendations</span>
                    </label>
                  </div>
                </div>
                <div className="pt-4">
                  <button className="btn btn-primary">
                    Save Settings
                  </button>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen">
        <div className="container py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h1 className="text-xl font-semibold text-gray-900 mb-6">My Account</h1>
                <nav className="space-y-2">
                  {tabs.map((tab) => {
                    const Icon = tab.icon
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                          activeTab === tab.id
                            ? 'bg-baby-50 text-baby-700 border border-baby-200'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span>{tab.label}</span>
                      </button>
                    )
                  })}
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {renderTabContent()}
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

export default AccountPage

