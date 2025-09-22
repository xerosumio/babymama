import React, { useState, useEffect } from 'react'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useRouter } from 'next/router'
import { User, Package, MapPin, CreditCard, Star, Settings, LogOut, ArrowLeft, Home } from 'lucide-react'
import Link from 'next/link'

interface UserData {
  _id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  language: string
  currency: string
  addresses: any[]
  createdAt: string
  updatedAt: string
}

interface OrderStats {
  totalOrders: number
  pendingOrders: number
  completedOrders: number
  totalSpent: number
}

const AccountPage: React.FC = () => {
  const { t } = useTranslation('common')
  const router = useRouter()
  const [user, setUser] = useState<UserData | null>(null)
  const [orderStats, setOrderStats] = useState<OrderStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/auth/login')
        return
      }

      // Fetch user profile from database
      const profileResponse = await fetch('/api/user/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (profileResponse.ok) {
        const profileData = await profileResponse.json()
        setUser(profileData.user)
      } else if (profileResponse.status === 401) {
        // Token expired or invalid
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        router.push('/auth/login')
        return
      } else {
        throw new Error('Failed to fetch user profile')
      }

      // Fetch order statistics
      const ordersResponse = await fetch('/api/user/orders?limit=1', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (ordersResponse.ok) {
        const ordersData = await ordersResponse.json()
        // Calculate stats from orders
        const stats = calculateOrderStats(ordersData.orders)
        setOrderStats(stats)
      }

    } catch (error) {
      console.error('Error fetching user data:', error)
      setError('Failed to load user data')
    } finally {
      setIsLoading(false)
    }
  }

  const calculateOrderStats = (orders: any[]): OrderStats => {
    const totalOrders = orders.length
    const pendingOrders = orders.filter(order => ['pending', 'processing'].includes(order.status)).length
    const completedOrders = orders.filter(order => order.status === 'delivered').length
    const totalSpent = orders.reduce((sum, order) => sum + (order.total || 0), 0)

    return {
      totalOrders,
      pendingOrders,
      completedOrders,
      totalSpent
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    router.push('/')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-baby-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">{t('common.loading')}</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {t('common.error')}
          </h2>
          <p className="text-gray-600 mb-8">{error}</p>
          <button
            onClick={fetchUserData}
            className="px-4 py-2 bg-baby-600 text-white rounded-md hover:bg-baby-700"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {t('auth.welcomeBack')}
            </h2>
            <p className="text-gray-600 mb-8">
              Please sign in to access your account
            </p>
            <div className="space-y-4">
              <Link
                href="/auth/login"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-baby-600 hover:bg-baby-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-baby-500"
              >
                {t('auth.signIn')}
              </Link>
              <Link
                href="/"
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-baby-500"
              >
                {t('common.home')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Home Link */}
      <div className="absolute top-4 left-4">
        <Link
          href="/"
          className="flex items-center space-x-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-white rounded-md transition-colors"
        >
          <Home className="w-4 h-4" />
          <span>{t('common.home')}</span>
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-8 h-8 text-blue-600" />
            </div>
            <div className="flex-1 w-full">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                {user.firstName} {user.lastName}
              </h1>
              <p className="text-sm sm:text-base text-gray-600 break-all">{user.email}</p>
              <p className="text-xs sm:text-sm text-gray-500">
                {t('account.memberSince')} {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="text-left sm:text-right w-full sm:w-auto">
              <p className="text-xs sm:text-sm text-gray-500">{t('auth.phone')}</p>
              <p className="text-sm sm:text-base font-medium">{user.phone || t('common.notProvided')}</p>
            </div>
          </div>
        </div>

        {/* Statistics */}
        {orderStats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
              <div className="flex items-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Package className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                </div>
                <div className="ml-3 sm:ml-4">
                  <p className="text-xs sm:text-sm text-gray-500">{t('account.totalOrders')}</p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-900">{orderStats.totalOrders}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
              <div className="flex items-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Package className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600" />
                </div>
                <div className="ml-3 sm:ml-4">
                  <p className="text-xs sm:text-sm text-gray-500">{t('account.pendingOrders')}</p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-900">{orderStats.pendingOrders}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
              <div className="flex items-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Package className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                </div>
                <div className="ml-3 sm:ml-4">
                  <p className="text-xs sm:text-sm text-gray-500">{t('account.completedOrders')}</p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-900">{orderStats.completedOrders}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
              <div className="flex items-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                </div>
                <div className="ml-3 sm:ml-4">
                  <p className="text-xs sm:text-sm text-gray-500">{t('account.totalSpent')}</p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-900">HK${orderStats.totalSpent.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Account Menu */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Profile */}
          <Link
            href="/account/profile"
            className="bg-white rounded-lg shadow-sm p-4 sm:p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                  {t('account.profile')}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600">
                  {t('account.managePersonalInfo')}
                </p>
              </div>
            </div>
          </Link>

          {/* Orders */}
          <Link
            href="/account/orders"
            className="bg-white rounded-lg shadow-sm p-4 sm:p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Package className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                  {t('account.orders')}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600">
                  {t('account.viewOrderHistory')}
                </p>
              </div>
            </div>
          </Link>

          {/* Addresses */}
          <Link
            href="/account/addresses"
            className="bg-white rounded-lg shadow-sm p-4 sm:p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                  {t('account.addresses')}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600">
                  {t('account.manageAddresses')}
                </p>
              </div>
            </div>
          </Link>

          {/* Reviews */}
          <Link
            href="/account/reviews"
            className="bg-white rounded-lg shadow-sm p-4 sm:p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Star className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                  {t('account.reviews')}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600">
                  {t('account.yourProductReviews')}
                </p>
              </div>
            </div>
          </Link>

          {/* Payment Methods */}
          <Link
            href="/account/payment-methods"
            className="bg-white rounded-lg shadow-sm p-4 sm:p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                  {t('account.paymentMethods')}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600">
                  {t('account.managePaymentMethods')}
                </p>
              </div>
            </div>
          </Link>

          {/* Settings */}
          <Link
            href="/account/settings"
            className="bg-white rounded-lg shadow-sm p-4 sm:p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Settings className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                  {t('account.settings')}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600">
                  {t('account.accountPreferences')}
                </p>
              </div>
            </div>
          </Link>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="bg-white rounded-lg shadow-sm p-4 sm:p-6 hover:shadow-md transition-shadow text-left"
          >
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <LogOut className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                  {t('account.signOut')}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600">
                  {t('account.signOutDescription')}
                </p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}

export async function getServerSideProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common']))
    }
  }
}

export default AccountPage
