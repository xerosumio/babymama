import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useTranslation } from 'next-i18next'
import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useAdmin } from '@/contexts/AdminContext'
import { ArrowLeft, Eye, EyeOff, Shield, Lock, Store, Globe } from 'lucide-react'

export default function AdminLogin() {
  const { t } = useTranslation('common')
  const router = useRouter()
  const { login, isAuthenticated, isLoading, error, clearError } = useAdmin()
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  })
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/admin/dashboard')
    }
  }, [isAuthenticated, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()
    await login(formData.username, formData.password)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-sky-500 rounded-full flex items-center justify-center">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <h1 className="ml-2 text-lg font-bold text-gray-900">Admin Portal</h1>
            </div>
            <div className="flex space-x-2">
              <Link
                href="/merchant"
                className="flex items-center text-gray-600 hover:text-sky-600 px-2 py-1 rounded text-sm font-medium"
              >
                <Store className="h-4 w-4 mr-1" />
                Merchant
              </Link>
              <Link
                href="/"
                className="flex items-center text-gray-600 hover:text-sky-600 px-2 py-1 rounded text-sm font-medium"
              >
                <Globe className="h-4 w-4 mr-1" />
                Customer
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Spacer for fixed header */}
      <div className="h-16"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-sky-500 rounded-xl flex items-center justify-center shadow-lg">
            <Shield className="h-8 w-8 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          Admin Login
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Sign in to the admin portal
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-sky-50 border border-sky-200 text-sky-600 px-4 py-3 rounded-md">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Shield className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                  placeholder="Enter your username"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-sky-600 focus:ring-sky-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-sky-600 hover:text-sky-500">
                  Forgot your password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-500 hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Access other portals</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <Link
                href="/admin"
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Admin Portal
              </Link>
              <Link
                href="/merchant"
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
              >
                <Store className="h-4 w-4 mr-2" />
                Merchant Portal
              </Link>
            </div>
          </div>

          {/* Test Accounts */}
          <div className="mt-6 bg-sky-50 border border-sky-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-sky-800 mb-2">测试账号 (Test Accounts)</h3>
            <div className="space-y-2 text-xs text-sky-700">
              <div className="flex justify-between">
                <span>管理员账号:</span>
                <span className="font-mono">admin@test.com</span>
              </div>
              <div className="flex justify-between">
                <span>密码:</span>
                <span className="font-mono">admin123</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setFormData({
                  username: 'admin@test.com',
                  password: 'admin123',
                })
              }}
              className="mt-3 w-full bg-sky-500 text-white text-xs py-2 px-3 rounded hover:bg-sky-600 transition-colors"
            >
              一键填充测试账号
            </button>
          </div>

          <div className="mt-6">
            <div className="flex justify-center space-x-4">
              <Link
                href="/admin"
                className="flex items-center text-sm text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Admin Portal
              </Link>
              <span className="text-gray-300">|</span>
              <Link
                href="/"
                className="flex items-center text-sm text-gray-600 hover:text-gray-900"
              >
                <Globe className="h-4 w-4 mr-2" />
                Customer Site
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'en', ['common'])),
    },
  }
}
