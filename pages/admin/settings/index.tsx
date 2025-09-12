import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useAdmin } from '@/contexts/AdminContext'
import AdminLayout from '@/components/Admin/Layout/AdminLayout'
import {
  Settings,
  Save,
  RefreshCw,
  Shield,
  Mail,
  CreditCard,
  Truck,
  Globe,
  Database,
  Bell,
  Lock,
  Users,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react'

interface SettingsData {
  general: {
    siteName: string
    siteDescription: string
    adminEmail: string
    supportEmail: string
    customerServicePhone: string
    timezone: string
    currency: string
    language: string
  }
  email: {
    smtpServer: string
    smtpPort: number
    smtpUsername: string
    smtpPassword: string
    fromEmail: string
    fromName: string
    enableNotifications: boolean
  }
  payment: {
    enableCreditCard: boolean
    enablePayPal: boolean
    enableAlipayHK: boolean
    enableWeChatPay: boolean
    enablePayMe: boolean
    enableOctopus: boolean
    platformFee: number
    minimumPayout: number
  }
  shipping: {
    standardShippingFee: number
    expressShippingFee: number
    freeShippingThreshold: number
    standardDeliveryDays: number
    expressDeliveryDays: number
    supportedCarriers: string[]
  }
  security: {
    enableTwoFactor: boolean
    sessionTimeout: number
    maxLoginAttempts: number
    enableAuditLog: boolean
    requireStrongPasswords: boolean
  }
  notifications: {
    emailNotifications: boolean
    smsNotifications: boolean
    pushNotifications: boolean
    orderAlerts: boolean
    merchantAlerts: boolean
    systemAlerts: boolean
  }
}

const defaultSettings: SettingsData = {
  general: {
    siteName: 'BabyMama Platform',
    siteDescription: 'Professional mother & baby e-commerce platform',
    adminEmail: 'admin@babymama.com',
    supportEmail: 'support@babymama.com',
    customerServicePhone: '+852 1234 5678',
    timezone: 'Asia/Hong_Kong',
    currency: 'HKD',
    language: 'en'
  },
  email: {
    smtpServer: 'smtp.gmail.com',
    smtpPort: 587,
    smtpUsername: 'noreply@babymama.com',
    smtpPassword: '',
    fromEmail: 'noreply@babymama.com',
    fromName: 'BabyMama Platform',
    enableNotifications: true
  },
  payment: {
    enableCreditCard: true,
    enablePayPal: true,
    enableAlipayHK: true,
    enableWeChatPay: true,
    enablePayMe: true,
    enableOctopus: true,
    platformFee: 5.0,
    minimumPayout: 100
  },
  shipping: {
    standardShippingFee: 30,
    expressShippingFee: 60,
    freeShippingThreshold: 500,
    standardDeliveryDays: 3,
    expressDeliveryDays: 1,
    supportedCarriers: ['SF Express', 'Hongkong Post', 'Lalamove']
  },
  security: {
    enableTwoFactor: false,
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    enableAuditLog: true,
    requireStrongPasswords: true
  },
  notifications: {
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    orderAlerts: true,
    merchantAlerts: true,
    systemAlerts: true
  }
}

export default function SettingsPage() {
  const router = useRouter()
  const { adminUser, isAuthenticated, isLoading } = useAdmin()
  const [settings, setSettings] = useState<SettingsData>(defaultSettings)
  const [activeTab, setActiveTab] = useState('general')
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle')

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/admin/auth/login')
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !adminUser) {
    return null
  }

  const handleSave = async () => {
    setIsSaving(true)
    setSaveStatus('saving')
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setSaveStatus('success')
      setTimeout(() => setSaveStatus('idle'), 2000)
    } catch (error) {
      setSaveStatus('error')
      setTimeout(() => setSaveStatus('idle'), 2000)
    } finally {
      setIsSaving(false)
    }
  }

  const updateSettings = (section: keyof SettingsData, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }))
  }

  const tabs = [
    { id: 'general', name: 'General', icon: Settings },
    { id: 'email', name: 'Email', icon: Mail },
    { id: 'payment', name: 'Payment', icon: CreditCard },
    { id: 'shipping', name: 'Shipping', icon: Truck },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'notifications', name: 'Notifications', icon: Bell }
  ]

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600">Manage platform configuration and preferences</p>
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
              className="bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700 disabled:opacity-50 flex items-center gap-2"
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
                        ? 'bg-sky-100 text-sky-700'
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
              {/* General Settings */}
              {activeTab === 'general' && (
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-6">General Settings</h3>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Site Name
                        </label>
                        <input
                          type="text"
                          value={settings.general.siteName}
                          onChange={(e) => updateSettings('general', 'siteName', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Admin Email
                        </label>
                        <input
                          type="email"
                          value={settings.general.adminEmail}
                          onChange={(e) => updateSettings('general', 'adminEmail', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Site Description
                      </label>
                      <textarea
                        value={settings.general.siteDescription}
                        onChange={(e) => updateSettings('general', 'siteDescription', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Support Email
                        </label>
                        <input
                          type="email"
                          value={settings.general.supportEmail}
                          onChange={(e) => updateSettings('general', 'supportEmail', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Customer Service Phone
                        </label>
                        <input
                          type="tel"
                          value={settings.general.customerServicePhone}
                          onChange={(e) => updateSettings('general', 'customerServicePhone', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Timezone
                        </label>
                        <select
                          value={settings.general.timezone}
                          onChange={(e) => updateSettings('general', 'timezone', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                        >
                          <option value="Asia/Hong_Kong">Asia/Hong_Kong</option>
                          <option value="UTC">UTC</option>
                          <option value="America/New_York">America/New_York</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Currency
                        </label>
                        <select
                          value={settings.general.currency}
                          onChange={(e) => updateSettings('general', 'currency', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                        >
                          <option value="HKD">HKD</option>
                          <option value="USD">USD</option>
                          <option value="EUR">EUR</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Language
                        </label>
                        <select
                          value={settings.general.language}
                          onChange={(e) => updateSettings('general', 'language', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                        >
                          <option value="en">English</option>
                          <option value="zh-HK">繁體中文</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Email Settings */}
              {activeTab === 'email' && (
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-6">Email Settings</h3>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          SMTP Server
                        </label>
                        <input
                          type="text"
                          value={settings.email.smtpServer}
                          onChange={(e) => updateSettings('email', 'smtpServer', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          SMTP Port
                        </label>
                        <input
                          type="number"
                          value={settings.email.smtpPort}
                          onChange={(e) => updateSettings('email', 'smtpPort', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          SMTP Username
                        </label>
                        <input
                          type="text"
                          value={settings.email.smtpUsername}
                          onChange={(e) => updateSettings('email', 'smtpUsername', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          SMTP Password
                        </label>
                        <input
                          type="password"
                          value={settings.email.smtpPassword}
                          onChange={(e) => updateSettings('email', 'smtpPassword', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          From Email
                        </label>
                        <input
                          type="email"
                          value={settings.email.fromEmail}
                          onChange={(e) => updateSettings('email', 'fromEmail', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          From Name
                        </label>
                        <input
                          type="text"
                          value={settings.email.fromName}
                          onChange={(e) => updateSettings('email', 'fromName', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                        />
                      </div>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.email.enableNotifications}
                        onChange={(e) => updateSettings('email', 'enableNotifications', e.target.checked)}
                        className="h-4 w-4 text-sky-600 focus:ring-sky-500 border-gray-300 rounded"
                      />
                      <label className="ml-2 block text-sm text-gray-900">
                        Enable email notifications
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Payment Settings */}
              {activeTab === 'payment' && (
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-6">Payment Settings</h3>
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-md font-medium text-gray-900 mb-4">Payment Methods</h4>
                      <div className="space-y-3">
                        {[
                          { key: 'enableCreditCard', label: 'Credit Card' },
                          { key: 'enablePayPal', label: 'PayPal' },
                          { key: 'enableAlipayHK', label: 'AlipayHK' },
                          { key: 'enableWeChatPay', label: 'WeChat Pay HK' },
                          { key: 'enablePayMe', label: 'PayMe' },
                          { key: 'enableOctopus', label: 'Octopus' }
                        ].map((method) => (
                          <div key={method.key} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={settings.payment[method.key as keyof typeof settings.payment] as boolean}
                              onChange={(e) => updateSettings('payment', method.key, e.target.checked)}
                              className="h-4 w-4 text-sky-600 focus:ring-sky-500 border-gray-300 rounded"
                            />
                            <label className="ml-2 block text-sm text-gray-900">
                              {method.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Platform Fee (%)
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          value={settings.payment.platformFee}
                          onChange={(e) => updateSettings('payment', 'platformFee', parseFloat(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Minimum Payout (HK$)
                        </label>
                        <input
                          type="number"
                          value={settings.payment.minimumPayout}
                          onChange={(e) => updateSettings('payment', 'minimumPayout', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Shipping Settings */}
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Standard Delivery (days)
                        </label>
                        <input
                          type="number"
                          value={settings.shipping.standardDeliveryDays}
                          onChange={(e) => updateSettings('shipping', 'standardDeliveryDays', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Express Delivery (days)
                      </label>
                      <input
                        type="number"
                        value={settings.shipping.expressDeliveryDays}
                        onChange={(e) => updateSettings('shipping', 'expressDeliveryDays', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Security Settings */}
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
                          className="h-4 w-4 text-sky-600 focus:ring-sky-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 block text-sm text-gray-900">
                          Enable Two-Factor Authentication
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.security.enableAuditLog}
                          onChange={(e) => updateSettings('security', 'enableAuditLog', e.target.checked)}
                          className="h-4 w-4 text-sky-600 focus:ring-sky-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 block text-sm text-gray-900">
                          Enable Audit Logging
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.security.requireStrongPasswords}
                          onChange={(e) => updateSettings('security', 'requireStrongPasswords', e.target.checked)}
                          className="h-4 w-4 text-sky-600 focus:ring-sky-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 block text-sm text-gray-900">
                          Require Strong Passwords
                        </label>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Session Timeout (minutes)
                        </label>
                        <input
                          type="number"
                          value={settings.security.sessionTimeout}
                          onChange={(e) => updateSettings('security', 'sessionTimeout', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Max Login Attempts
                        </label>
                        <input
                          type="number"
                          value={settings.security.maxLoginAttempts}
                          onChange={(e) => updateSettings('security', 'maxLoginAttempts', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications Settings */}
              {activeTab === 'notifications' && (
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-6">Notification Settings</h3>
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-md font-medium text-gray-900 mb-4">Notification Channels</h4>
                      <div className="space-y-3">
                        {[
                          { key: 'emailNotifications', label: 'Email Notifications' },
                          { key: 'smsNotifications', label: 'SMS Notifications' },
                          { key: 'pushNotifications', label: 'Push Notifications' }
                        ].map((channel) => (
                          <div key={channel.key} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={settings.notifications[channel.key as keyof typeof settings.notifications] as boolean}
                              onChange={(e) => updateSettings('notifications', channel.key, e.target.checked)}
                              className="h-4 w-4 text-sky-600 focus:ring-sky-500 border-gray-300 rounded"
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
                          { key: 'orderAlerts', label: 'Order Alerts' },
                          { key: 'merchantAlerts', label: 'Merchant Alerts' },
                          { key: 'systemAlerts', label: 'System Alerts' }
                        ].map((alert) => (
                          <div key={alert.key} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={settings.notifications[alert.key as keyof typeof settings.notifications] as boolean}
                              onChange={(e) => updateSettings('notifications', alert.key, e.target.checked)}
                              className="h-4 w-4 text-sky-600 focus:ring-sky-500 border-gray-300 rounded"
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
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'en', ['common'])),
    },
  }
}
