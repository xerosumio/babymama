import React, { useState, useEffect } from 'react'
import { useTranslation } from 'next-i18next'
import Link from 'next/link'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'

const HeroSection: React.FC = () => {
  const { t } = useTranslation('common')
  const [currentSlide, setCurrentSlide] = useState(0)

  // Banner data with three different images and content
  const banners = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      title: t('homepage.hero.title'),
      subtitle: t('homepage.hero.subtitle'),
      description: t('homepage.hero.description'),
      cta: t('homepage.hero.cta'),
      ctaLink: '/products?filter=new'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1522771930-78848d9293e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      title: 'Premium Baby Products',
      subtitle: 'QUALITY ASSURED',
      description: 'Discover our carefully curated collection of premium baby essentials for your little one\'s comfort and safety.',
      cta: 'Shop Now',
      ctaLink: '/products'
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      title: 'Free Shipping',
      subtitle: 'ON ORDERS OVER $299',
      description: 'Enjoy free shipping on all orders over $299. Fast and reliable delivery to your doorstep.',
      cta: 'Learn More',
      ctaLink: '/products?filter=featured'
    }
  ]

  // Auto-advance slides every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [banners.length])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length)
  }

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length)
  }

  return (
    <section className="relative bg-baby-50 min-h-[500px] sm:min-h-[600px] overflow-hidden">
      {/* Full-width banner carousel */}
      <div className="relative w-full h-[500px] sm:h-[600px]">
        {/* Slides */}
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            className={`absolute inset-0 transition-opacity duration-500 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
              {/* Left Column - Text Content */}
              <div className="flex items-center justify-center lg:justify-end p-4 sm:p-8 lg:p-16">
                <div className="max-w-lg space-y-4 sm:space-y-8">
                  <div className="space-y-2 sm:space-y-4">
                    <h2 className="text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wide">
                      {banner.subtitle}
                    </h2>
                    <h1 className="text-3xl sm:text-5xl lg:text-7xl font-bold text-gray-900 leading-tight">
                      {banner.title}
                    </h1>
                    <p className="text-sm sm:text-xl text-gray-600 leading-relaxed">
                      {banner.description}
                    </p>
                  </div>
                  
                  <Link 
                    href={banner.ctaLink}
                    className="inline-flex items-center space-x-2 sm:space-x-3 bg-baby-500 text-white px-6 sm:px-10 py-3 sm:py-5 rounded-lg hover:bg-baby-600 transition-colors font-semibold text-sm sm:text-lg"
                  >
                    <span>{banner.cta}</span>
                    <ArrowRight className="w-4 h-4 sm:w-6 sm:h-6" />
                  </Link>
                </div>
              </div>

              {/* Right Column - Image */}
              <div className="relative flex items-center justify-center p-4 sm:p-8 lg:p-16">
                <div className="relative w-full max-w-sm sm:max-w-md lg:max-w-lg">
                  <div className="relative rounded-lg overflow-hidden shadow-2xl">
                    <img
                      src={banner.image}
                      alt={banner.title}
                      className="w-full h-[300px] sm:h-[400px] lg:h-[500px] object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Navigation Arrows */}
        <button
          onClick={goToPrevious}
          className="absolute left-2 sm:left-6 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-2 sm:p-3 rounded-full shadow-lg transition-all duration-200 z-10"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6" />
        </button>
        
        <button
          onClick={goToNext}
          className="absolute right-2 sm:right-6 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-2 sm:p-3 rounded-full shadow-lg transition-all duration-200 z-10"
          aria-label="Next slide"
        >
          <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6" />
        </button>

        {/* Dots Indicator */}
        <div className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 sm:space-x-3">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full transition-all duration-200 ${
                index === currentSlide 
                  ? 'bg-white shadow-lg' 
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default HeroSection
