import React from 'react'
import { useTranslation } from 'next-i18next'
import Link from 'next/link'
import { Star, ShoppingCart, Heart } from 'lucide-react'
import { Product } from '@/lib/types'
import { useCart } from '@/contexts/CartContext'
import { useWishlist } from '@/contexts/WishlistContext'

interface ProductCardProps {
  product: Product
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { t } = useTranslation('common')
  const locale = useTranslation().i18n.language as 'en' | 'zh-HK'
  const { addToCart } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-HK', {
      style: 'currency',
      currency: 'HKD',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart(product, 1)
  }

  return (
    <div className="group bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden">
        <Link href={`/product/${product.slug}`}>
          <img
            src={product.images[0] || '/placeholder-product.jpg'}
            alt={product.name[locale]}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>
        
        {/* New Label */}
        {product.isNew && (
          <div className="absolute top-3 left-3">
            <span className="bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
              {t('homepage.newLabel')}
            </span>
          </div>
        )}

        {/* Wishlist Button */}
        <button 
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            if (isInWishlist(product._id)) {
              removeFromWishlist(product._id)
            } else {
              addToWishlist(product)
            }
          }}
          className={`absolute top-3 right-3 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 ${
            isInWishlist(product._id) 
              ? 'bg-red-500 text-white' 
              : 'bg-white/80 text-gray-600 hover:bg-white'
          }`}
        >
          <Heart className={`w-4 h-4 ${isInWishlist(product._id) ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Product Info */}
      <div className="p-4 space-y-3">
        {/* Brand */}
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          {product.merchant?.name || 'BRAND'}
        </div>

        {/* Product Name */}
        <Link href={`/product/${product.slug}`}>
          <h3 className="font-medium text-gray-900 hover:text-baby-600 transition-colors line-clamp-2">
            {product.name[locale]}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center space-x-1">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-500">
            {t('homepage.rating', { count: 124 })}
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center space-x-2">
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <span className="text-sm text-gray-500 line-through">
              {formatPrice(product.compareAtPrice)}
            </span>
          )}
          <span className="text-lg font-bold text-baby-600">
            {formatPrice(product.price)}
          </span>
        </div>

        {/* Add to Cart Button */}
        <button 
          onClick={handleAddToCart}
          className="w-full bg-baby-500 text-white py-2 px-4 rounded-lg hover:bg-baby-600 transition-colors font-medium flex items-center justify-center space-x-2"
        >
          <ShoppingCart className="w-4 h-4" />
          <span>{t('homepage.addToCart')}</span>
        </button>
      </div>
    </div>
  )
}

export default ProductCard
