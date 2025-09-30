import React, { useState, useEffect } from 'react'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useRouter } from 'next/router'
import { CreditCard, ArrowLeft, Plus, Edit, Trash2, Check } from 'lucide-react'
import Link from 'next/link'

interface PaymentMethod {
  _id: string
  type: 'credit_card' | 'debit_card' | 'paypal' | 'alipay' | 'wechat_pay'
  cardNumber: string
  expiryMonth: string
  expiryYear: string
  cardholderName: string
  isDefault: boolean
  isActive: boolean
  createdAt: string
}

const PaymentMethodsPage: React.FC = () => {
  const { t } = useTranslation('common')
  const router = useRouter()
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingPayment, setEditingPayment] = useState<PaymentMethod | null>(null)

  const [formData, setFormData] = useState({
    type: 'credit_card' as 'credit_card' | 'debit_card' | 'paypal' | 'alipay' | 'wechat_pay',
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cardholderName: '',
    isDefault: false
  })

  useEffect(() => {
    fetchPaymentMethods()
  }, [])

  const fetchPaymentMethods = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/auth/login')
        return
      }

      const response = await fetch('/api/user/payment-methods', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setPaymentMethods(data.paymentMethods || [])
      } else if (response.status === 401) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        router.push('/auth/login')
        return
      } else {
        throw new Error('Failed to fetch payment methods')
      }
    } catch (error) {
      console.error('Error fetching payment methods:', error)
      setError('Failed to load payment methods')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      const token = localStorage.getItem('token')
      const url = editingPayment ? `/api/user/payment-methods/${editingPayment._id}` : '/api/user/payment-methods'
      const method = editingPayment ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        await fetchPaymentMethods()
        setShowAddForm(false)
        setEditingPayment(null)
        setFormData({
          type: 'credit_card',
          cardNumber: '',
          expiryMonth: '',
          expiryYear: '',
          cardholderName: '',
          isDefault: false
        })
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to save payment method')
      }
    } catch (error) {
      console.error('Error saving payment method:', error)
      setError('Failed to save payment method')
    }
  }

  const handleEdit = (payment: PaymentMethod) => {
    setEditingPayment(payment)
    setFormData({
      type: payment.type,
      cardNumber: payment.cardNumber,
      expiryMonth: payment.expiryMonth,
      expiryYear: payment.expiryYear,
      cardholderName: payment.cardholderName,
      isDefault: payment.isDefault
    })
    setShowAddForm(true)
  }

  const handleDelete = async (paymentId: string) => {
    if (!confirm('Are you sure you want to delete this payment method?')) {
      return
    }

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/user/payment-methods/${paymentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        await fetchPaymentMethods()
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to delete payment method')
      }
    } catch (error) {
      console.error('Error deleting payment method:', error)
      setError('Failed to delete payment method')
    }
  }

  const handleCancel = () => {
    setShowAddForm(false)
    setEditingPayment(null)
    setFormData({
      type: 'credit_card',
      cardNumber: '',
      expiryMonth: '',
      expiryYear: '',
      cardholderName: '',
      isDefault: false
    })
    setError('')
  }

  const maskCardNumber = (cardNumber: string) => {
    if (cardNumber.length <= 4) return cardNumber
    return '**** **** **** ' + cardNumber.slice(-4)
  }

  const getPaymentMethodIcon = (type: string) => {
    switch (type) {
      case 'credit_card':
      case 'debit_card':
        return <CreditCard className="w-6 h-6" />
      case 'paypal':
        return <div className="w-6 h-6 bg-blue-600 rounded text-white flex items-center justify-center text-xs font-bold">P</div>
      case 'alipay':
        return <div className="w-6 h-6 bg-blue-500 rounded text-white flex items-center justify-center text-xs font-bold">A</div>
      case 'wechat_pay':
        return <div className="w-6 h-6 bg-green-500 rounded text-white flex items-center justify-center text-xs font-bold">W</div>
      default:
        return <CreditCard className="w-6 h-6" />
    }
  }

  const getPaymentMethodName = (type: string) => {
    switch (type) {
      case 'credit_card':
        return 'Credit Card'
      case 'debit_card':
        return 'Debit Card'
      case 'paypal':
        return 'PayPal'
      case 'alipay':
        return 'Alipay'
      case 'wechat_pay':
        return 'WeChat Pay'
      default:
        return type
    }
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/account"
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Account</span>
              </Link>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Payment Methods</h1>
            <div className="w-24"></div> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Add Payment Method Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-baby-600 text-white rounded-md hover:bg-baby-700"
          >
            <Plus className="w-5 h-5" />
            <span>Add Payment Method</span>
          </button>
        </div>

        {/* Add/Edit Payment Method Form */}
        {showAddForm && (
          <div className="mb-8 bg-white shadow-sm rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">
                {editingPayment ? 'Edit Payment Method' : 'Add New Payment Method'}
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="px-6 py-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                    Payment Type
                  </label>
                  <select
                    name="type"
                    id="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-baby-500 focus:border-baby-500 sm:text-sm"
                  >
                    <option value="credit_card">Credit Card</option>
                    <option value="debit_card">Debit Card</option>
                    <option value="paypal">PayPal</option>
                    <option value="alipay">Alipay</option>
                    <option value="wechat_pay">WeChat Pay</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="cardholderName" className="block text-sm font-medium text-gray-700">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    name="cardholderName"
                    id="cardholderName"
                    required
                    value={formData.cardholderName}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-baby-500 focus:border-baby-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">
                    Card Number
                  </label>
                  <input
                    type="text"
                    name="cardNumber"
                    id="cardNumber"
                    required
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    placeholder="1234 5678 9012 3456"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-baby-500 focus:border-baby-500 sm:text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="expiryMonth" className="block text-sm font-medium text-gray-700">
                      Expiry Month
                    </label>
                    <select
                      name="expiryMonth"
                      id="expiryMonth"
                      required
                      value={formData.expiryMonth}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-baby-500 focus:border-baby-500 sm:text-sm"
                    >
                      <option value="">Month</option>
                      {Array.from({ length: 12 }, (_, i) => (
                        <option key={i + 1} value={String(i + 1).padStart(2, '0')}>
                          {String(i + 1).padStart(2, '0')}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="expiryYear" className="block text-sm font-medium text-gray-700">
                      Expiry Year
                    </label>
                    <select
                      name="expiryYear"
                      id="expiryYear"
                      required
                      value={formData.expiryYear}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-baby-500 focus:border-baby-500 sm:text-sm"
                    >
                      <option value="">Year</option>
                      {Array.from({ length: 10 }, (_, i) => {
                        const year = new Date().getFullYear() + i
                        return (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        )
                      })}
                    </select>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="isDefault"
                      id="isDefault"
                      checked={formData.isDefault}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-baby-600 focus:ring-baby-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isDefault" className="ml-2 block text-sm text-gray-900">
                      Set as default payment method
                    </label>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-baby-600 border border-transparent rounded-md hover:bg-baby-700"
                >
                  {editingPayment ? 'Update Payment Method' : 'Add Payment Method'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Payment Methods List */}
        <div className="space-y-4">
          {paymentMethods.length === 0 ? (
            <div className="text-center py-12">
              <CreditCard className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No payment methods</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by adding a payment method.</p>
            </div>
          ) : (
            paymentMethods.map((payment) => (
              <div key={payment._id} className="bg-white shadow-sm rounded-lg p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      {getPaymentMethodIcon(payment.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-lg font-medium text-gray-900">
                          {getPaymentMethodName(payment.type)}
                        </h3>
                        {payment.isDefault && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <Check className="w-3 h-3 mr-1" />
                            Default
                          </span>
                        )}
                        {!payment.isActive && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Inactive
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">
                        {maskCardNumber(payment.cardNumber)}
                      </p>
                      <p className="text-sm text-gray-600">
                        {payment.cardholderName}
                      </p>
                      <p className="text-sm text-gray-500">
                        Expires {payment.expiryMonth}/{payment.expiryYear}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEdit(payment)}
                      className="p-2 text-gray-400 hover:text-gray-600"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(payment._id)}
                      className="p-2 text-gray-400 hover:text-red-600"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
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

export default PaymentMethodsPage
