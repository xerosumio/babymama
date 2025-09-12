import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useMerchant } from '@/contexts/MerchantContext'
import MerchantLayout from '@/components/Merchant/Layout/MerchantLayout'
import {
  Settings,
  Save,
  RefreshCw,
  Building2,
  User,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Truck,
  Bell,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Camera,
  Upload
} from 'lucide-react'

interface StoreSettings {
  business: {
    businessName: string
    businessType: 'individual' | 'company'
    contactPerson: string
    email: string
    phone: string
    website?: string
    description: string
    logo?: string
  }
  address: {
    street: string
    city: string
    state: string
    postalCode: string
    country: string
  }
  bankAccount: {
    accountName: string
    accountNumber: string
    bankName: string
    bankCode: string
  }
  shipping: {
    standardShippingFee: number
    expressShippingFee: number
    freeShippingThreshold: number
    processingTime: number
    returnPolicy: string
    shippingZones: string[]
  }
  notifications: {
    emailNotifications: boolean
    smsNotifications: boolean
    orderAlerts: boolean
    lowStockAlerts: boolean
    reviewAlerts: boolean
    marketingEmails: boolean
  }
  security: {
    enableTwoFactor: boolean
    sessionTimeout: number
    requireStrongPasswords: boolean
    loginNotifications: boolean
  }
}

const defaultSettings: StoreSettings = {
  business: {
    businessName: 'Baby Care Store',
    businessType: 'company',
    contactPerson: 'John Doe',
    email: 'merchant@test.com',
    phone: '+852-1234-5678',
    website: 'https://babycarestore.com',
    description: 'Premium baby care products and essentials',
    logo: ''
  },
  address: {
    street: '123 Main Street',
    city: 'Hong Kong',
    state: 'Hong Kong',
    postalCode: '00000',
    country: 'Hong Kong'
  },
  bankAccount: {
    accountName: 'Baby Care Store Ltd',
    accountNumber: '1234567890',
    bankName: 'HSBC',
    bankCode: '004'
  },
  shipping: {
    standardShippingFee: 30,
    expressShippingFee: 60,
    freeShippingThreshold: 500,
    processingTime: 2,
    returnPolicy: '30-day return policy for unused items',
    shippingZones: ['Hong Kong', 'Macau']
  },
  notifications: {
    emailNotifications: true,
    smsNotifications: false,
    orderAlerts: true,
    lowStockAlerts: true,
    reviewAlerts: true,
    marketingEmails: false
  },
  security: {
    enableTwoFactor: false,
    sessionTimeout: 30,
    requireStrongPasswords: true,
    loginNotifications: true
  }
}

export default function SettingsPage() {
  const router = useRouter()
  const { merchant, isAuthenticated, isLoading, updateMerchant } = useMerchant()
  const [settings, setSettings] = useState<StoreSettings>(defaultSettings)
  const [activeTab, setActiveTab] = useState('business')
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle')

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/merchant/auth/login')
    }
  }, [isAuthenticated, isLoading, router])

  useEffect(() => {
    if (merchant) {
      setSettings(prev => ({
        ...prev,
        business: {
          businessName: merchant.businessName,
          businessType: merchant.businessType,
          contactPerson: merchant.contactPerson,
          email: merchant.email,
          phone: merchant.phone,
          website: '',
          description: '',
          logo: ''
        },
        address: merchant.address
      }))
    }
  }, [merchant])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !merchant) {
    return null
  }

  const handleSave = async () => {
    setIsSaving(true)
    setSaveStatus('saving')
    
    try {
      // Update merchant data
      await updateMerchant({
        businessName: settings.business.businessName,
        businessType: settings.business.businessType,
        contactPerson: settings.business.contactPerson,
        email: settings.business.email,
        phone: settings.business.phone,
        address: settings.address
      })
      
      setSaveStatus('success')
      setTimeout(() => setSaveStatus('idle'), 2000)
    } catch (error) {
      setSaveStatus('error')
      setTimeout(() => setSaveStatus('idle'), 2000)
    } finally {
      setIsSaving(false)
    }
  }

  const updateSettings = (section: keyof StoreSettings, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }))
  }

  const tabs = [
    { id: 'business', name: 'Business Info', icon: Building2 },
    { id: 'address', name: 'Address', icon: MapPin },
    { id: 'banking', name: 'Banking', icon: CreditCard },
    { id: 'shipping', name: 'Shipping', icon: Truck },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'security', name: 'Security', icon: Shield }
  ]

  return (
    <MerchantLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Store Settings</h1>
            <p className="text-gray-600">Manage your store information and preferences</p>
          </div>
          <div className="flex items-center gap-2">
            {saveStatus === 'success' && (
              <div className="flex items-center text-green-600">
                <CheckCircle className="h-4 w-4 mr-1" />
                <span className="text-sm">Saved successfully</span>
              </div>
            )}
            {saveStatus === 'error' && (
              <div className="flex items-center text-red-600">
                <XCircle className="h-4 w-4 mr-1" />
                <span className="text-sm">Save failed</span>
              </div>
            )}
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
            >
              {isSaving ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const IconComponent = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                      activeTab === tab.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <IconComponent className="h-4 w-4 mr-3" />
                    {tab.name}
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow">
              {/* Business Info */}
              {activeTab === 'business' && (
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-6">Business Information</h3>
                  <div className="space-y-6">
                    {/* Logo Upload */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Store Logo
                      </label>
                      <div className="flex items-center space-x-4">
                        <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                          {settings.business.logo ? (
                            <img src={settings.business.logo} alt="Logo" className="w-full h-full object-cover rounded-lg" />
                          ) : (
                            <Camera className="h-8 w-8 text-gray-400" />
                          )}
                        </div>
                        <div>
                          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
                            <Upload className="h-4 w-4" />
                            Upload Logo
                          </button>
                          <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 2MB</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Business Name
                        </label>
                        <input
                          type="text"
                          value={settings.business.businessName}
                          onChange={(e) => updateSettings('business', 'businessName', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Business Type
                        </label>
                        <select
                          value={settings.business.businessType}
                          onChange={(e) => updateSettings('business', 'businessType', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="individual">Individual</option>
                          <option value="company">Company</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Contact Person
                        </label>
                        <input
                          type="text"
                          value={settings.business.contactPerson}
                          onChange={(e) => updateSettings('business', 'contactPerson', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          value={settings.business.email}
                          onChange={(e) => updateSettings('business', 'email', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone
                        </label>
                        <input
                          type="tel"
                          value={settings.business.phone}
                          onChange={(e) => updateSettings('business', 'phone', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Website
                        </label>
                        <input
                          type="url"
                          value={settings.business.website}
                          onChange={(e) => updateSettings('business', 'website', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="https://yourwebsite.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Business Description
                      </label>
                      <textarea
                        value={settings.business.description}
                        onChange={(e) => updateSettings('business', 'description', e.target.value)}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Describe your business and what you offer..."
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Address */}
              {activeTab === 'address' && (
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-6">Business Address</h3>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Street Address
                      </label>
                      <input
                        type="text"
                        value={settings.address.street}
                        onChange={(e) => updateSettings('address', 'street', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          City
                        </label>
                        <input
                          type="text"
                          value={settings.address.city}
                          onChange={(e) => updateSettings('address', 'city', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          State/Province
                        </label>
                        <input
                          type="text"
                          value={settings.address.state}
                          onChange={(e) => updateSettings('address', 'state', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Postal Code
                        </label>
                        <input
                          type="text"
                          value={settings.address.postalCode}
                          onChange={(e) => updateSettings('address', 'postalCode', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Country
                        </label>
                        <input
                          type="text"
                          value={settings.address.country}
                          onChange={(e) => updateSettings('address', 'country', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Banking */}
              {activeTab === 'banking' && (
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-6">Banking Information</h3>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Account Name
                      </label>
                      <input
                        type="text"
                        value={settings.bankAccount.accountName}
                        onChange={(e) => updateSettings('bankAccount', 'accountName', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Account Number
                        </label>
                        <input
                          type="text"
                          value={settings.bankAccount.accountNumber}
                          onChange={(e) => updateSettings('bankAccount', 'accountNumber', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Bank Code
                        </label>
                        <input
                          type="text"
                          value={settings.bankAccount.bankCode}
                          onChange={(e) => updateSettings('bankAccount', 'bankCode', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bank Name
                      </label>
                      <input
                        type="text"
                        value={settings.bankAccount.bankName}
                        onChange={(e) => updateSettings('bankAccount', 'bankName', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                      <div className="flex">
                        <AlertTriangle className="h-5 w-5 text-yellow-400" />
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-yellow-800">
                            Security Notice
                          </h3>
                          <div className="mt-2 text-sm text-yellow-700">
                            <p>
                              Your banking information is encrypted and secure. 
                              We never store your full account details in plain text.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Shipping */}
              {activeTab === 'shipping' && (
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-6">Shipping Settings</h3>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Standard Shipping Fee (HK$)
                        </label>
                        <input
                          type="number"
                          value={settings.shipping.standardShippingFee}
                          onChange={(e) => updateSettings('shipping', 'standardShippingFee', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Express Shipping Fee (HK$)
                        </label>
                        <input
                          type="number"
                          value={settings.shipping.expressShippingFee}
                          onChange={(e) => updateSettings('shipping', 'expressShippingFee', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Free Shipping Threshold (HK$)
                        </label>
                        <input
                          type="number"
                          value={settings.shipping.freeShippingThreshold}
                          onChange={(e) => updateSettings('shipping', 'freeShippingThreshold', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Processing Time (days)
                        </label>
                        <input
                          type="number"
                          value={settings.shipping.processingTime}
                          onChange={(e) => updateSettings('shipping', 'processingTime', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Return Policy
                      </label>
                      <textarea
                        value={settings.shipping.returnPolicy}
                        onChange={(e) => updateSettings('shipping', 'returnPolicy', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications */}
              {activeTab === 'notifications' && (
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-6">Notification Preferences</h3>
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-md font-medium text-gray-900 mb-4">Notification Channels</h4>
                      <div className="space-y-3">
                        {[
                          { key: 'emailNotifications', label: 'Email Notifications' },
                          { key: 'smsNotifications', label: 'SMS Notifications' }
                        ].map((channel) => (
                          <div key={channel.key} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={settings.notifications[channel.key as keyof typeof settings.notifications] as boolean}
                              onChange={(e) => updateSettings('notifications', channel.key, e.target.checked)}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label className="ml-2 block text-sm text-gray-900">
                              {channel.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-md font-medium text-gray-900 mb-4">Alert Types</h4>
                      <div className="space-y-3">
                        {[
                          { key: 'orderAlerts', label: 'New Order Alerts' },
                          { key: 'lowStockAlerts', label: 'Low Stock Alerts' },
                          { key: 'reviewAlerts', label: 'New Review Alerts' },
                          { key: 'marketingEmails', label: 'Marketing Emails' }
                        ].map((alert) => (
                          <div key={alert.key} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={settings.notifications[alert.key as keyof typeof settings.notifications] as boolean}
                              onChange={(e) => updateSettings('notifications', alert.key, e.target.checked)}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label className="ml-2 block text-sm text-gray-900">
                              {alert.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Security */}
              {activeTab === 'security' && (
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-6">Security Settings</h3>
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.security.enableTwoFactor}
                          onChange={(e) => updateSettings('security', 'enableTwoFactor', e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 block text-sm text-gray-900">
                          Enable Two-Factor Authentication
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.security.requireStrongPasswords}
                          onChange={(e) => updateSettings('security', 'requireStrongPasswords', e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 block text-sm text-gray-900">
                          Require Strong Passwords
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.security.loginNotifications}
                          onChange={(e) => updateSettings('security', 'loginNotifications', e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 block text-sm text-gray-900">
                          Login Notifications
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Session Timeout (minutes)
                      </label>
                      <input
                        type="number"
                        value={settings.security.sessionTimeout}
                        onChange={(e) => updateSettings('security', 'sessionTimeout', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </MerchantLayout>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'en', ['common'])),
    },
  }
}
