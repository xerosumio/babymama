import React, { useState, useEffect } from 'react'
import { useTranslation } from 'next-i18next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Search, Heart, ShoppingCart, User, Menu, Globe, Store, Shield } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import { useWishlist } from '@/contexts/WishlistContext'
import CategoryDropdown from './CategoryDropdown'
import MobileCategoryMenu from './MobileCategoryMenu'
import NavigationWithDropdown from './NavigationWithDropdown'

const Header: React.FC = () => {
  const { t } = useTranslation('common')
  const router = useRouter()
  const { state } = useCart()
  const { state: wishlistState } = useWishlist()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isScrolled, setIsScrolled] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      setIsScrolled(scrollTop > 50) // 滚动超过50px时收起状态栏
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Check login status
  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem('token')
      const userData = localStorage.getItem('user')
      
      if (token && userData) {
        try {
          const parsedUser = JSON.parse(userData)
          setUser(parsedUser)
          setIsLoggedIn(true)
        } catch (error) {
          console.error('Error parsing user data:', error)
          // Clear invalid data
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          setIsLoggedIn(false)
          setUser(null)
        }
      } else {
        setIsLoggedIn(false)
        setUser(null)
      }
    }

    checkLoginStatus()

    // Listen for storage changes (login/logout from other tabs)
    window.addEventListener('storage', checkLoginStatus)
    return () => window.removeEventListener('storage', checkLoginStatus)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  const handleLanguageChange = (locale: string) => {
    router.push(router.asPath, router.asPath, { locale })
  }

  return (
    <>
      {/* Fixed Header - 状态栏和导航一起固定 */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm transition-all duration-300">
        {/* Top Status Bar - 滚动时隐藏 */}
        <div className={`bg-gray-50 text-gray-600 text-sm transition-all duration-300 overflow-hidden ${
          isScrolled ? 'max-h-0 py-0 opacity-0' : 'max-h-12 py-2 opacity-100'
        }`}>
          <div className="container flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <span>{t('header.freeShipping')}</span>
            </div>
            <div className="flex items-center space-x-4">
              <span>{t('header.customerService')}: +852 1234 5678</span>
            </div>
          </div>
        </div>

        {/* Main Navigation Bar */}
        <div className="bg-white">
          <div className="container py-4">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <Link href="/" className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-baby-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">👶</span>
                </div>
                <span className="text-2xl font-bold text-gray-900">BABYMAMA</span>
              </Link>

              {/* Search Bar */}
              <div className="flex-1 max-w-2xl mx-8">
                <form onSubmit={handleSearch} className="relative">
                  <input
                    type="text"
                    placeholder="What are you shopping for today?"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-baby-500 focus:border-transparent bg-white"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-200 text-gray-600 p-2 rounded-full hover:bg-gray-300 transition-colors"
                  >
                    <Search className="w-5 h-5" />
                  </button>
                </form>
              </div>

              {/* Right Side Icons */}
              <div className="flex items-center space-x-4">
                {/* Language/Region */}
                <div className="flex items-center space-x-2">
                  <Globe className="w-5 h-5 text-gray-700" />
                  <select
                    value={router.locale}
                    onChange={(e) => handleLanguageChange(e.target.value)}
                    className="bg-transparent border-none text-sm focus:outline-none text-gray-700"
                  >
                    <option value="en">🇺🇸 EN</option>
                    <option value="zh-HK">🇭🇰 繁中</option>
                  </select>
                </div>

                {/* Wishlist */}
                <Link href="/wishlist" className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <Heart className="w-6 h-6 text-gray-700" />
                  {wishlistState.itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {wishlistState.itemCount}
                    </span>
                  )}
                </Link>

                {/* Shopping Cart */}
                <Link href="/cart" className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <ShoppingCart className="w-6 h-6 text-gray-700" />
                  {state.itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {state.itemCount}
                    </span>
                  )}
                </Link>


                {/* Login/Account */}
                {isLoggedIn ? (
                  <Link href="/account" className="p-2 hover:bg-gray-100 rounded-full transition-colors group relative">
                    <User className="w-6 h-6 text-gray-700" />
                    {/* User dropdown tooltip */}
                    <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-800 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {user?.firstName} {user?.lastName}
                    </div>
                  </Link>
                ) : (
                  <Link href="/auth/login" className="p-2 hover:bg-gray-100 rounded-full transition-colors group relative">
                    <User className="w-6 h-6 text-gray-700" />
                    {/* Sign in tooltip */}
                    <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-800 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      Sign In
                    </div>
                  </Link>
                )}

                {/* Mobile Menu Button */}
                <button
                  onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
                  className="lg:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <Menu className="w-6 h-6 text-gray-700" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="bg-white border-b border-gray-200">
          <div className="container">
            <div className="flex items-center space-x-8 py-3">
              <CategoryDropdown />
              <NavigationWithDropdown />
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Category Menu */}
      <MobileCategoryMenu 
        isOpen={isCategoryMenuOpen} 
        onClose={() => setIsCategoryMenuOpen(false)} 
      />
    </>
  )
}

export default Header