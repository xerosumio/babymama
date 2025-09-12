import React from 'react'
import { GetStaticPaths, GetStaticProps } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useRouter } from 'next/router'
import Layout from '@/components/Layout/Layout'
import ProductCard from '@/components/Homepage/ProductCard'
import { mockProducts } from '@/lib/mockData'
import { Product } from '@/lib/types'

interface CategoryPageProps {
  products: Product[]
  categoryName: string
}

const CategoryPage: React.FC<CategoryPageProps> = ({ products, categoryName }) => {
  const { t } = useTranslation('common')
  const router = useRouter()

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <button onClick={() => router.push('/')} className="hover:text-baby-600">
            {t('common.home')}
          </button>
          <span>/</span>
          <span className="text-gray-900">{categoryName}</span>
        </nav>

        {/* Category Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{categoryName}</h1>
          <p className="text-gray-600">
            {products.length} {products.length === 1 ? 'product' : 'products'} found
          </p>
        </div>

        {/* Products Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600 mb-4">We couldn't find any products in this category.</p>
            <button
              onClick={() => router.push('/')}
              className="bg-baby-600 text-white px-6 py-2 rounded-md hover:bg-baby-700 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </Layout>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const categories = [
    'feeding',
    'diapers-wipes', 
    'baby-care',
    'clothing',
    'toys',
    'gear-travel',
    'maternity',
    'feeding/bottles',
    'feeding/formula',
    'feeding/high-chairs',
    'feeding/bibs',
    'feeding/breastfeeding',
    'diapers-wipes/diapers',
    'diapers-wipes/wipes',
    'diapers-wipes/changing',
    'diapers-wipes/potty-training',
    'baby-care/skincare',
    'baby-care/bath',
    'baby-care/health',
    'baby-care/monitors',
    'clothing/bodysuits',
    'clothing/sleepwear',
    'clothing/outerwear',
    'clothing/accessories',
    'toys/educational',
    'toys/soft-toys',
    'toys/activity',
    'toys/outdoor',
    'gear-travel/strollers',
    'gear-travel/car-seats',
    'gear-travel/carriers',
    'gear-travel/travel',
    'maternity/clothing',
    'maternity/pillows',
    'maternity/health',
    'maternity/nursing'
  ]

  const paths = categories.map((slug) => ({
    params: { slug }
  }))

  return {
    paths,
    fallback: false
  }
}

export const getStaticProps: GetStaticProps = async ({ params, locale }) => {
  const slug = params?.slug as string
  
  // Map category slugs to category names
  const categoryNames: { [key: string]: string } = {
    'feeding': 'Feeding',
    'diapers-wipes': 'Diapers & Wipes',
    'baby-care': 'Baby Care',
    'clothing': 'Clothing',
    'toys': 'Toys',
    'gear-travel': 'Gear & Travel',
    'maternity': 'Maternity',
    'feeding/bottles': 'Bottles & Nipples',
    'feeding/formula': 'Baby Formula',
    'feeding/high-chairs': 'High Chairs',
    'feeding/bibs': 'Bibs & Burp Cloths',
    'feeding/breastfeeding': 'Breastfeeding',
    'diapers-wipes/diapers': 'Diapers',
    'diapers-wipes/wipes': 'Baby Wipes',
    'diapers-wipes/changing': 'Changing Mats',
    'diapers-wipes/potty-training': 'Potty Training',
    'baby-care/skincare': 'Skincare',
    'baby-care/bath': 'Bath & Grooming',
    'baby-care/health': 'Health & Safety',
    'baby-care/monitors': 'Baby Monitors',
    'clothing/bodysuits': 'Bodysuits & Onesies',
    'clothing/sleepwear': 'Sleepwear',
    'clothing/outerwear': 'Outerwear',
    'clothing/accessories': 'Clothing Accessories',
    'toys/educational': 'Educational Toys',
    'toys/soft-toys': 'Soft Toys',
    'toys/activity': 'Activity Centers',
    'toys/outdoor': 'Outdoor Toys',
    'gear-travel/strollers': 'Strollers',
    'gear-travel/car-seats': 'Car Seats',
    'gear-travel/carriers': 'Baby Carriers',
    'gear-travel/travel': 'Travel Accessories',
    'maternity/clothing': 'Maternity Clothing',
    'maternity/pillows': 'Maternity Pillows',
    'maternity/health': 'Prenatal Health',
    'maternity/nursing': 'Nursing Bras'
  }

  // Filter products based on category
  const filteredProducts = mockProducts.filter(product => {
    const categorySlug = product.category.slug
    // Handle both main categories and subcategories
    if (slug.includes('/')) {
      // This is a subcategory, filter by main category
      const mainCategory = slug.split('/')[0]
      return categorySlug === mainCategory
    } else {
      // This is a main category
      return categorySlug === slug
    }
  })

  return {
    props: {
      products: JSON.parse(JSON.stringify(filteredProducts)),
      categoryName: categoryNames[slug] || slug,
      ...(await serverSideTranslations(locale ?? 'en', ['common']))
    }
  }
}

export default CategoryPage
