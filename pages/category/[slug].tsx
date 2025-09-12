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
  parentCategory?: string
  parentCategoryName?: string
}

const CategoryPage: React.FC<CategoryPageProps> = ({ products, categoryName, parentCategory, parentCategoryName }) => {
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
          {parentCategory && parentCategoryName ? (
            <>
              <button 
                onClick={() => router.push(`/category/${parentCategory}`)} 
                className="hover:text-baby-600"
              >
                {parentCategoryName}
              </button>
              <span>/</span>
              <span className="text-gray-900">{categoryName}</span>
            </>
          ) : (
            <span className="text-gray-900">{categoryName}</span>
          )}
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
    'feeding%2Fbottles',
    'feeding%2Fformula',
    'feeding%2Fhigh-chairs',
    'feeding%2Fbibs',
    'feeding%2Fbreastfeeding',
    'diapers-wipes%2Fdiapers',
    'diapers-wipes%2Fwipes',
    'diapers-wipes%2Fchanging',
    'diapers-wipes%2Fpotty-training',
    'baby-care%2Fskincare',
    'baby-care%2Fbath',
    'baby-care%2Fhealth',
    'baby-care%2Fmonitors',
    'clothing%2Fbodysuits',
    'clothing%2Fsleepwear',
    'clothing%2Fouterwear',
    'clothing%2Faccessories',
    'toys%2Feducational',
    'toys%2Fsoft-toys',
    'toys%2Factivity',
    'toys%2Foutdoor',
    'gear-travel%2Fstrollers',
    'gear-travel%2Fcar-seats',
    'gear-travel%2Fcarriers',
    'gear-travel%2Ftravel',
    'maternity%2Fclothing',
    'maternity%2Fpillows',
    'maternity%2Fhealth',
    'maternity%2Fnursing'
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
  const decodedSlug = decodeURIComponent(slug)
  
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

  // Determine if this is a subcategory and get parent info
  let parentCategory: string | undefined
  let parentCategoryName: string | undefined
  
  if (decodedSlug.includes('/')) {
    const parts = decodedSlug.split('/')
    parentCategory = parts[0]
    parentCategoryName = categoryNames[parentCategory]
  }

  // Filter products based on category
  const filteredProducts = mockProducts.filter(product => {
    const categorySlug = product.category.slug
    // Handle both main categories and subcategories
    if (decodedSlug.includes('/')) {
      // This is a subcategory, filter by main category
      const mainCategory = decodedSlug.split('/')[0]
      return categorySlug === mainCategory
    } else {
      // This is a main category
      return categorySlug === decodedSlug
    }
  })

  return {
    props: {
      products: JSON.parse(JSON.stringify(filteredProducts)),
      categoryName: categoryNames[decodedSlug] || decodedSlug,
      parentCategory: parentCategory || null,
      parentCategoryName: parentCategoryName || null,
      ...(await serverSideTranslations(locale ?? 'en', ['common']))
    }
  }
}

export default CategoryPage
