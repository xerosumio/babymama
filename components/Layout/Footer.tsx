import React from 'react'
import { useTranslation } from 'next-i18next'
import Link from 'next/link'
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react'

const Footer: React.FC = () => {
  const { t } = useTranslation('common')

  return (
    <footer className="bg-white text-gray-900">
      <div className="container">
        {/* Main Footer Content */}
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="col-span-1">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">babymama</h3>
            </div>

            {/* Information */}
            <div>
              <h4 className="text-lg font-semibold mb-4 text-gray-900">Information</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/about" className="text-gray-600 hover:text-baby-600 transition-colors">
                    About us
                  </Link>
                </li>
                <li>
                  <Link href="/sustainability" className="text-gray-600 hover:text-baby-600 transition-colors">
                    Sustainability
                  </Link>
                </li>
                <li>
                  <Link href="/whistleblowing" className="text-gray-600 hover:text-baby-600 transition-colors">
                    Whistleblowing
                  </Link>
                </li>
                <li>
                  <Link href="/career" className="text-gray-600 hover:text-baby-600 transition-colors">
                    Career
                  </Link>
                </li>
              </ul>
            </div>

            {/* Terms & Conditions */}
            <div>
              <h4 className="text-lg font-semibold mb-4 text-gray-900">Terms & conditions</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/integrity-policy" className="text-gray-600 hover:text-baby-600 transition-colors">
                    Integrity Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-gray-600 hover:text-baby-600 transition-colors">
                    Terms & conditions
                  </Link>
                </li>
                <li>
                  <Link href="/cookies" className="text-gray-600 hover:text-baby-600 transition-colors">
                    Cookies
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-gray-600 hover:text-baby-600 transition-colors">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>

            {/* Customer Care */}
            <div>
              <h4 className="text-lg font-semibold mb-4 text-gray-900">Customer Care</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/faq" className="text-gray-600 hover:text-baby-600 transition-colors">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="/delivery" className="text-gray-600 hover:text-baby-600 transition-colors">
                    Delivery
                  </Link>
                </li>
                <li>
                  <Link href="/returns" className="text-gray-600 hover:text-baby-600 transition-colors">
                    Make a return/claim
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-600 hover:text-baby-600 transition-colors">
                    Contact us
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Follow Us */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-center">
              <div className="mb-4 sm:mb-0">
                <h4 className="text-lg font-semibold mb-4 text-gray-900">Follow Us</h4>
                <div className="flex space-x-4">
                  <a href="#" className="text-gray-600 hover:text-baby-600 transition-colors">
                    <Facebook className="w-5 h-5" />
                  </a>
                  <a href="#" className="text-gray-600 hover:text-baby-600 transition-colors">
                    <Instagram className="w-5 h-5" />
                  </a>
                  <a href="#" className="text-gray-600 hover:text-baby-600 transition-colors">
                    <Twitter className="w-5 h-5" />
                  </a>
                  <a href="#" className="text-gray-600 hover:text-baby-600 transition-colors">
                    <Youtube className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-200 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500">
            <p>&copy; 2024 babymama. All rights reserved.</p>
            <div className="flex space-x-4 mt-2 sm:mt-0">
              <Link href="/privacy" className="hover:text-baby-600 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-baby-600 transition-colors">
                Terms of Service
              </Link>
              <Link href="/sitemap" className="hover:text-baby-600 transition-colors">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
