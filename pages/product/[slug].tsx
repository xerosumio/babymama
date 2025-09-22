import React, { useState } from 'react'
import { GetStaticProps, GetStaticPaths } from 'next'
import { useRouter } from 'next/router'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import Image from 'next/image'
import Layout from '@/components/Layout/Layout'
import { Product } from '@/lib/types'
import { mockProductsWithReviews } from '@/lib/mockData'
import { useCart } from '@/contexts/CartContext'
import { Star, Heart, ShoppingCart, Minus, Plus, Truck, Shield, RotateCcw, Check } from 'lucide-react'

interface ProductPageProps {
  product: Product
  relatedProducts: Product[]
}

const ProductPage: React.FC<ProductPageProps> = ({ product, relatedProducts }) => {
  const router = useRouter()
  const { t } = useTranslation('common')
  const { addToCart } = useCart()
  const locale = router.locale as 'en' | 'zh-HK'
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0])
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [showAddedToCart, setShowAddedToCart] = useState(false)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-HK', {
      style: 'currency',
      currency: 'HKD',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const handleAddToCart = async () => {
    setIsAddingToCart(true)
    try {
      addToCart(product, quantity, selectedVariant)
      setShowAddedToCart(true)
      setTimeout(() => setShowAddedToCart(false), 3000)
    } catch (error) {
      console.error('Error adding to cart:', error)
    } finally {
      setIsAddingToCart(false)
    }
  }

  const handleBuyNow = async () => {
    // Add to cart first, then redirect to checkout
    try {
      addToCart(product, quantity, selectedVariant)
      router.push('/checkout')
    } catch (error) {
      console.error('Error adding to cart:', error)
    }
  }

  return (
    <Layout>
      <div className="bg-white">
        <div className="container py-4 sm:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-12">
            {/* Product Images */}
            <div className="space-y-3 sm:space-y-4">
              {/* Main Image */}
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <Image
                  src={product.images[selectedImage] || '/placeholder-product.jpg'}
                  alt={product.name[locale]}
                  width={600}
                  height={600}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Thumbnail Images */}
              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 ${
                        selectedImage === index ? 'border-baby-500' : 'border-transparent'
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`${product.name[locale]} ${index + 1}`}
                        width={150}
                        height={150}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-4 sm:space-y-6">
              {/* Brand & Title */}
              <div>
                <div className="text-xs sm:text-sm font-semibold text-baby-600 uppercase tracking-wide mb-2">
                  {product.merchant?.name}
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
                  {product.name[locale]}
                </h1>
                
                {/* Rating */}
                <div className="flex items-center space-x-2 mb-3 sm:mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 sm:w-5 sm:h-5 ${
                          i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs sm:text-sm text-gray-600">
                    {t('homepage.rating', { count: 124 })}
                  </span>
                </div>
              </div>

              {/* Price */}
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl sm:text-3xl font-bold text-baby-600">
                    {formatPrice(selectedVariant?.price || product.price)}
                  </span>
                  {product.compareAtPrice && product.compareAtPrice > product.price && (
                    <span className="text-lg sm:text-xl text-gray-500 line-through">
                      {formatPrice(product.compareAtPrice)}
                    </span>
                  )}
                </div>
                {product.compareAtPrice && product.compareAtPrice > product.price && (
                  <div className="text-xs sm:text-sm text-green-600 font-medium">
                    Save {formatPrice(product.compareAtPrice - product.price)} ({Math.round((1 - product.price / product.compareAtPrice) * 100)}% off)
                  </div>
                )}
              </div>

              {/* Variants */}
              {product.variants.length > 0 && (
                <div>
                  <h3 className="text-xs sm:text-sm font-medium text-gray-900 mb-2 sm:mb-3">Options</h3>
                  <div className="space-y-2">
                    {product.variants.map((variant) => (
                      <button
                        key={variant._id}
                        onClick={() => setSelectedVariant(variant)}
                        className={`w-full text-left p-2 sm:p-3 border rounded-lg ${
                          selectedVariant?._id === variant._id
                            ? 'border-baby-500 bg-baby-50'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-sm sm:text-base">{variant.name[locale]}</span>
                          <span className="text-baby-600 font-semibold text-sm sm:text-base">
                            {formatPrice(variant.price)}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div>
                <h3 className="text-xs sm:text-sm font-medium text-gray-900 mb-2 sm:mb-3">Quantity</h3>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-medium text-sm sm:text-base">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 sm:space-y-3">
                <button
                  onClick={handleAddToCart}
                  disabled={isAddingToCart}
                  className={`w-full py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors text-sm sm:text-base ${
                    showAddedToCart
                      ? 'bg-green-500 text-white'
                      : isAddingToCart
                      ? 'bg-gray-400 text-white cursor-not-allowed'
                      : 'bg-baby-500 text-white hover:bg-baby-600'
                  }`}
                >
                  {showAddedToCart ? (
                    <>
                      <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>Added to Cart!</span>
                    </>
                  ) : isAddingToCart ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white"></div>
                      <span>Adding...</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>{t('product.addToCart')}</span>
                    </>
                  )}
                </button>
                
                <button
                  onClick={handleBuyNow}
                  className="w-full bg-orange-500 text-white py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg hover:bg-orange-600 transition-colors font-medium text-sm sm:text-base"
                >
                  {t('product.buyNow')}
                </button>
                
                <button className="w-full border border-gray-300 text-gray-700 py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center justify-center space-x-2 text-sm sm:text-base">
                  <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Add to Wishlist</span>
                </button>
              </div>

              {/* Features */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 pt-4 sm:pt-6 border-t border-gray-200">
                <div className="flex items-center space-x-2">
                  <Truck className="w-4 h-4 sm:w-5 sm:h-5 text-baby-500" />
                  <span className="text-xs sm:text-sm text-gray-600">Free Shipping</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-baby-500" />
                  <span className="text-xs sm:text-sm text-gray-600">Secure Payment</span>
                </div>
                <div className="flex items-center space-x-2">
                  <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5 text-baby-500" />
                  <span className="text-xs sm:text-sm text-gray-600">Easy Returns</span>
                </div>
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="mt-8 sm:mt-16">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
              {/* Description */}
              <div className="lg:col-span-2">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
                  {t('product.description')}
                </h2>
                <div className="prose max-w-none">
                  <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                    {product.description[locale]}
                  </p>
                </div>
              </div>

              {/* Specifications */}
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                  {t('product.specifications')}
                </h3>
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600 text-sm sm:text-base">Weight</span>
                    <span className="font-medium text-sm sm:text-base">{product.weight} kg</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600 text-sm sm:text-base">Dimensions</span>
                    <span className="font-medium text-sm sm:text-base">
                      {product.dimensions.length} × {product.dimensions.width} × {product.dimensions.height} cm
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">SKU</span>
                    <span className="font-medium">{product.sku}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">Brand</span>
                    <span className="font-medium">{product.merchant?.name}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          {product.reviews && product.reviews.length > 0 && (
            <div className="mt-16">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900">
                  {t('product.reviews')}
                </h2>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < Math.floor(product.averageRating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">
                      {product.averageRating?.toFixed(1)} ({product.totalReviews} {t('homepage.rating', { count: product.totalReviews || 0 })})
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {product.reviews.map((review) => (
                  <div key={review._id} className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-baby-100 rounded-full flex items-center justify-center">
                          <span className="text-baby-600 font-semibold text-sm">
                            {review.user.firstName.charAt(0)}{review.user.lastName.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {review.user.firstName} {review.user.lastName}
                          </h4>
                          <div className="flex items-center space-x-2">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-gray-500">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                            {review.isVerified && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Verified Purchase
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <h5 className="font-medium text-gray-900 mb-2">{review.title}</h5>
                      <p className="text-gray-600 leading-relaxed">{review.comment}</p>
                    </div>

                    {review.images && review.images.length > 0 && (
                      <div className="flex space-x-2 mb-4">
                        {review.images.map((image, index) => (
                          <div key={index} className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                            <Image
                              src={image}
                              alt={`Review image ${index + 1}`}
                              width={64}
                              height={64}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <button className="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700">
                        <span>Helpful ({review.helpful})</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 text-center">
                <button className="bg-baby-500 text-white px-6 py-3 rounded-lg hover:bg-baby-600 transition-colors font-medium">
                  {t('product.writeReview')}
                </button>
              </div>
            </div>
          )}

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">
                {t('product.relatedProducts')}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((relatedProduct) => (
                  <div key={relatedProduct._id} className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow">
                    <div className="aspect-square bg-gray-100 rounded-t-lg overflow-hidden">
                      <Image
                        src={relatedProduct.images[0] || '/placeholder-product.jpg'}
                        alt={relatedProduct.name[locale]}
                        width={300}
                        height={300}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">
                        {relatedProduct.name[locale]}
                      </h3>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-baby-600">
                          {formatPrice(relatedProduct.price)}
                        </span>
                        <button className="text-baby-600 hover:text-baby-700">
                          <ShoppingCart className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  // Use mock data for development without database
  const paths = mockProductsWithReviews.map((product) => ({
    params: { slug: product.slug },
  }))

  return {
    paths,
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps = async ({ params, locale }) => {
  // Use mock data for development without database
  const product = mockProductsWithReviews.find(p => p.slug === params?.slug && p.isActive)

  if (!product) {
    return {
      notFound: true,
    }
  }

  // Get related products from the same category
  const relatedProducts = mockProductsWithReviews
    .filter(p => p.categoryId === product.categoryId && p._id !== product._id && p.isActive)
    .slice(0, 4)

  return {
    props: {
      product: JSON.parse(JSON.stringify(product)),
      relatedProducts: JSON.parse(JSON.stringify(relatedProducts)),
      ...(await serverSideTranslations(locale ?? 'en', ['common'])),
    },
  }
}

export default ProductPage
