import React from 'react'
import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Layout from '@/components/Layout/Layout'
import HeroSection from '@/components/Homepage/HeroSection'
import FeaturedProducts from '@/components/Homepage/FeaturedProducts'
import RecommendedProducts from '@/components/Homepage/RecommendedProducts'
import BestSellers from '@/components/Homepage/BestSellers'
import NewArrivals from '@/components/Homepage/NewArrivals'
import UserReviews from '@/components/Homepage/UserReviews'
import Newsletter from '@/components/Homepage/Newsletter'
import TrustInfo from '@/components/Homepage/TrustInfo'
import PaymentMethods from '@/components/Homepage/PaymentMethods'
import { Product as IProduct } from '@/lib/types'
import { mockProducts, mockReviews } from '@/lib/mockData'

interface HomePageProps {
  featuredProducts: IProduct[]
  recommendedProducts: IProduct[]
  bestSellers: IProduct[]
  newArrivals: IProduct[]
  reviews: any[]
}

const HomePage: React.FC<HomePageProps> = ({ 
  featuredProducts, 
  recommendedProducts, 
  bestSellers, 
  newArrivals,
  reviews 
}) => {
  return (
    <Layout>
      <HeroSection />
      <FeaturedProducts products={featuredProducts} />
      <RecommendedProducts products={recommendedProducts} />
      <BestSellers products={bestSellers} />
      <NewArrivals products={newArrivals} />
      <UserReviews reviews={reviews} />
      <Newsletter />
      <TrustInfo />
      <PaymentMethods />
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  // Use mock data for development without database
  const featuredProducts = mockProducts.filter(product => product.isFeatured).slice(0, 6)
  const recommendedProducts = mockProducts.slice(0, 6) // 推荐产品
  const bestSellers = mockProducts.slice(6, 12) // 热销产品
  const newArrivals = mockProducts.filter(product => product.isNew).slice(0, 6) // 新品

  return {
    props: {
      featuredProducts: JSON.parse(JSON.stringify(featuredProducts)),
      recommendedProducts: JSON.parse(JSON.stringify(recommendedProducts)),
      bestSellers: JSON.parse(JSON.stringify(bestSellers)),
      newArrivals: JSON.parse(JSON.stringify(newArrivals)),
      reviews: JSON.parse(JSON.stringify(mockReviews)),
      ...(await serverSideTranslations(locale ?? 'en', ['common'])),
    },
  }
}

export default HomePage
