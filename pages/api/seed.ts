import { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '@/lib/mongodb'
import Category from '@/models/Category'
import Merchant from '@/models/Merchant'
import Product from '@/models/Product'
import User from '@/models/User'
import Order from '@/models/Order'
import Review from '@/models/Review'
import bcrypt from 'bcryptjs'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    await dbConnect()

    // Clear existing data
    await Category.deleteMany({})
    await Merchant.deleteMany({})
    await Product.deleteMany({})
    await User.deleteMany({})
    await Order.deleteMany({})
    await Review.deleteMany({})

    console.log('🗑️ Cleared existing data')

    // Create categories
    const categories = await Category.insertMany([
      {
        name: { en: 'Feeding', 'zh-HK': '餵食' },
        slug: 'feeding',
        isActive: true,
        sortOrder: 1,
      },
      {
        name: { en: 'Diapers & Wipes', 'zh-HK': '尿布與濕巾' },
        slug: 'diapers-wipes',
        isActive: true,
        sortOrder: 2,
      },
      {
        name: { en: 'Baby Care', 'zh-HK': '嬰兒護理' },
        slug: 'baby-care',
        isActive: true,
        sortOrder: 3,
      },
      {
        name: { en: 'Clothing', 'zh-HK': '服裝' },
        slug: 'clothing',
        isActive: true,
        sortOrder: 4,
      },
      {
        name: { en: 'Toys', 'zh-HK': '玩具' },
        slug: 'toys',
        isActive: true,
        sortOrder: 5,
      },
      {
        name: { en: 'Gear & Travel', 'zh-HK': '用品與旅行' },
        slug: 'gear-travel',
        isActive: true,
        sortOrder: 6,
      },
      {
        name: { en: 'Maternity', 'zh-HK': '孕婦用品' },
        slug: 'maternity',
        isActive: true,
        sortOrder: 7,
      },
    ])

    // Create merchants with hashed passwords
    const hashedMerchantPassword = await bcrypt.hash('password123', 12)
    const merchantsData = [
      {
        name: 'ORGANICBABY',
        slug: 'organicbaby',
        description: {
          en: 'Premium organic baby products for healthy development',
          'zh-HK': '優質有機嬰兒產品，促進健康發展'
        },
        email: 'info@organicbaby.com',
        password: hashedMerchantPassword,
        phone: '+852 1234 5678',
        address: {
          street: '123 Baby Street',
          city: 'Hong Kong',
          state: 'Hong Kong',
          postalCode: '00000',
          country: 'Hong Kong',
        },
        isActive: true,
        commissionRate: 8,
        payoutAccount: {
          type: 'bank',
          accountId: '1234567890',
          accountName: 'ORGANICBABY Ltd',
        },
        shippingTemplates: [],
      },
      {
        name: 'NUTRIBABY',
        slug: 'nutribaby',
        description: {
          en: 'Nutritional baby formula and supplements',
          'zh-HK': '營養嬰兒配方奶粉和補充品'
        },
        email: 'info@nutribaby.com',
        password: hashedMerchantPassword,
        phone: '+852 2345 6789',
        address: {
          street: '456 Nutrition Ave',
          city: 'Hong Kong',
          state: 'Hong Kong',
          postalCode: '00000',
          country: 'Hong Kong',
        },
        isActive: true,
        commissionRate: 10,
        payoutAccount: {
          type: 'bank',
          accountId: '2345678901',
          accountName: 'NUTRIBABY Ltd',
        },
        shippingTemplates: [],
      },
      {
        name: 'COMFYDIAPER',
        slug: 'comfydiaper',
        description: {
          en: 'Comfortable and absorbent diapers for all babies',
          'zh-HK': '舒適吸水的尿布，適合所有嬰兒'
        },
        email: 'info@comfydiaper.com',
        password: hashedMerchantPassword,
        phone: '+852 3456 7890',
        address: {
          street: '789 Comfort Road',
          city: 'Hong Kong',
          state: 'Hong Kong',
          postalCode: '00000',
          country: 'Hong Kong',
        },
        isActive: true,
        commissionRate: 12,
        payoutAccount: {
          type: 'bank',
          accountId: '3456789012',
          accountName: 'COMFYDIAPER Ltd',
        },
        shippingTemplates: [],
        password: await bcrypt.hash('password123', 12),
      },
    ]

    const merchants = await Merchant.insertMany(merchantsData)
    console.log('✅ Merchants created:', merchants.length)

    // Create sample users
    const hashedPassword = await bcrypt.hash('password123', 12)
    const usersData = [
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: hashedPassword,
        phone: '+852 1234 5678',
        addresses: [{
          type: 'home',
          firstName: 'John',
          lastName: 'Doe',
          phone: '+852 1234 5678',
          address1: '123 Main Street, Central',
          city: 'Hong Kong',
          state: 'Hong Kong',
          postalCode: '00000',
          country: 'Hong Kong'
        }]
      },
      {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
        password: hashedPassword,
        phone: '+852 9876 5432',
        addresses: [{
          type: 'home',
          firstName: 'Jane',
          lastName: 'Smith',
          phone: '+852 9876 5432',
          address1: '456 Queen\'s Road, Wan Chai',
          city: 'Hong Kong',
          state: 'Hong Kong',
          postalCode: '00000',
          country: 'Hong Kong'
        }]
      }
    ]
    const users = await User.insertMany(usersData)
    console.log('✅ Users created:', users.length)

    // Create products
    const products = await Product.insertMany([
      {
        name: {
          en: 'Organic Cotton Baby Bodysuit - 5 Pack',
          'zh-HK': '有機棉嬰兒連體衣 - 5件裝'
        },
        description: {
          en: 'Soft, breathable organic cotton bodysuits perfect for your little one. Made with 100% organic cotton and gentle on sensitive skin.',
          'zh-HK': '柔軟透氣的有機棉連體衣，完美適合您的小寶貝。採用100%有機棉製成，對敏感肌膚溫和。'
        },
        slug: 'organic-cotton-baby-bodysuit-5-pack',
        sku: 'OCB-001',
        price: 299,
        compareAtPrice: 399,
        costPrice: 200,
        categoryId: categories[3]._id, // Clothing
        merchantId: merchants[0]._id, // ORGANICBABY
        images: [
          'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
          'https://images.unsplash.com/photo-1583743814966-8936f37f0a2e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
        ],
        variants: [],
        tags: ['organic', 'cotton', 'baby', 'clothing'],
        isActive: true,
        isFeatured: true,
        isNew: true,
        weight: 0.5,
        dimensions: { length: 30, width: 25, height: 2 },
      },
      {
        name: {
          en: 'Premium Baby Milk Formula Stage 1',
          'zh-HK': '優質嬰兒配方奶粉 第1階段'
        },
        description: {
          en: 'Nutritious formula designed for babies 0-6 months. Contains essential nutrients for healthy growth and development.',
          'zh-HK': '專為0-6個月嬰兒設計的營養配方奶粉。含有健康成長發育所需的必需營養素。'
        },
        slug: 'premium-baby-milk-formula-stage-1',
        sku: 'PBF-001',
        price: 359,
        compareAtPrice: 429,
        costPrice: 280,
        categoryId: categories[0]._id, // Feeding
        merchantId: merchants[1]._id, // NUTRIBABY
        images: [
          'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
          'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
        ],
        variants: [],
        tags: ['formula', 'milk', 'nutrition', 'baby'],
        isActive: true,
        isFeatured: true,
        isNew: true,
        weight: 0.8,
        dimensions: { length: 15, width: 15, height: 25 },
      },
      {
        name: {
          en: 'Ultra Absorbent Diapers - 120 Count',
          'zh-HK': '超強吸水尿布 - 120片裝'
        },
        description: {
          en: 'Super absorbent diapers that keep your baby dry and comfortable all day long. Hypoallergenic and gentle on skin.',
          'zh-HK': '超強吸水尿布，讓您的寶寶整天保持乾爽舒適。低致敏性，對肌膚溫和。'
        },
        slug: 'ultra-absorbent-diapers-120-count',
        sku: 'UAD-001',
        price: 289,
        compareAtPrice: 349,
        costPrice: 220,
        categoryId: categories[1]._id, // Diapers & Wipes
        merchantId: merchants[2]._id, // COMFYDIAPER
        images: [
          'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
          'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
        ],
        variants: [],
        tags: ['diapers', 'absorbent', 'baby', 'hygiene'],
        isActive: true,
        isFeatured: true,
        isNew: true,
        weight: 2.5,
        dimensions: { length: 40, width: 30, height: 15 },
      },
      {
        name: {
          en: 'Soft Baby Blanket - Cloud Pattern',
          'zh-HK': '柔軟嬰兒毯 - 雲朵圖案'
        },
        description: {
          en: 'Ultra-soft baby blanket with adorable cloud pattern. Perfect for naptime, playtime, or as a stroller cover.',
          'zh-HK': '超柔軟嬰兒毯，配有可愛的雲朵圖案。非常適合午睡、遊戲時間或作為嬰兒車遮蓋。'
        },
        slug: 'soft-baby-blanket-cloud-pattern',
        sku: 'SBB-001',
        price: 199,
        compareAtPrice: 249,
        costPrice: 150,
        categoryId: categories[2]._id, // Baby Care
        merchantId: merchants[0]._id, // ORGANICBABY
        images: [
          'https://images.unsplash.com/photo-1583743814966-8936f37f0a2e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
          'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
        ],
        variants: [],
        tags: ['blanket', 'soft', 'baby', 'comfort'],
        isActive: true,
        isFeatured: true,
        isNew: false,
        weight: 0.3,
        dimensions: { length: 80, width: 60, height: 2 },
      },
      {
        name: {
          en: 'Educational Baby Toys Set',
          'zh-HK': '教育嬰兒玩具套裝'
        },
        description: {
          en: 'Colorful educational toys designed to stimulate your baby\'s senses and encourage learning through play.',
          'zh-HK': '色彩豐富的教育玩具，旨在刺激寶寶的感官，鼓勵通過遊戲學習。'
        },
        slug: 'educational-baby-toys-set',
        sku: 'EBT-001',
        price: 159,
        compareAtPrice: 199,
        costPrice: 120,
        categoryId: categories[4]._id, // Toys
        merchantId: merchants[1]._id, // NUTRIBABY
        images: [
          'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
          'https://images.unsplash.com/photo-1583743814966-8936f37f0a2e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
        ],
        variants: [],
        tags: ['toys', 'educational', 'baby', 'learning'],
        isActive: true,
        isFeatured: true,
        isNew: false,
        weight: 0.8,
        dimensions: { length: 25, width: 25, height: 15 },
      },
      {
        name: {
          en: 'Premium Baby Stroller',
          'zh-HK': '優質嬰兒推車'
        },
        description: {
          en: 'Lightweight and durable stroller perfect for daily walks and travel. Easy to fold and includes multiple safety features.',
          'zh-HK': '輕便耐用的推車，非常適合日常散步和旅行。易於折疊，包含多項安全功能。'
        },
        slug: 'premium-baby-stroller',
        sku: 'PBS-001',
        price: 899,
        compareAtPrice: 1099,
        costPrice: 700,
        categoryId: categories[5]._id, // Gear & Travel
        merchantId: merchants[2]._id, // COMFYDIAPER
        images: [
          'https://images.unsplash.com/photo-1583743814966-8936f37f0a2e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
          'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
        ],
        variants: [],
        tags: ['stroller', 'travel', 'baby', 'gear'],
        isActive: true,
        isFeatured: true,
        isNew: false,
        weight: 8.5,
        dimensions: { length: 100, width: 50, height: 110 },
      },
    ])

    // Create sample orders
    const ordersData = [
      {
        orderNumber: 'ORD-001',
        userId: users[0]._id,
        items: [
          {
            productId: products[0]._id,
            merchantId: products[0].merchantId,
            quantity: 2,
            price: products[0].price,
            total: products[0].price * 2
          },
          {
            productId: products[1]._id,
            merchantId: products[1].merchantId,
            quantity: 1,
            price: products[1].price,
            total: products[1].price
          }
        ],
        shippingAddress: users[0].addresses[0]._id,
        billingAddress: users[0].addresses[0]._id,
        paymentMethod: 'credit_card',
        status: 'processing',
        total: products[0].price * 2 + products[1].price,
        subtotal: products[0].price * 2 + products[1].price,
        shippingCost: 0,
        tax: 0,
        shippingMethod: 'standard'
      },
      {
        orderNumber: 'ORD-002',
        userId: users[1]._id,
        items: [
          {
            productId: products[2]._id,
            merchantId: products[2].merchantId,
            quantity: 1,
            price: products[2].price,
            total: products[2].price
          }
        ],
        shippingAddress: users[1].addresses[0]._id,
        billingAddress: users[1].addresses[0]._id,
        paymentMethod: 'paypal',
        status: 'shipped',
        total: products[2].price,
        subtotal: products[2].price,
        shippingCost: 0,
        tax: 0,
        shippingMethod: 'express',
        trackingNumber: 'TRK123456789'
      }
    ]
    const orders = await Order.insertMany(ordersData)
    console.log('✅ Orders created:', orders.length)

    // Create sample reviews
    const reviewsData = [
      {
        productId: products[0]._id,
        userId: users[0]._id,
        orderId: orders[0]._id,
        rating: 5,
        title: 'Excellent quality!',
        comment: 'The organic cotton is so soft and comfortable for my baby. Highly recommended!',
        isVerified: true
      },
      {
        productId: products[1]._id,
        userId: users[1]._id,
        orderId: orders[1]._id,
        rating: 4,
        title: 'Great formula',
        comment: 'My baby loves this formula. Good quality and reasonable price.',
        isVerified: true
      },
      {
        productId: products[2]._id,
        userId: users[0]._id,
        orderId: orders[0]._id,
        rating: 5,
        title: 'Super absorbent',
        comment: 'These diapers are amazing! No leaks and very comfortable for my little one.',
        isVerified: true
      }
    ]
    const reviews = await Review.insertMany(reviewsData)
    console.log('✅ Reviews created:', reviews.length)

    res.status(200).json({
      message: 'Database seeded successfully',
      data: {
        categories: categories.length,
        merchants: merchants.length,
        users: users.length,
        products: products.length,
        orders: orders.length,
        reviews: reviews.length,
      },
    })
  } catch (error) {
    console.error('Error seeding database:', error)
    res.status(500).json({ message: 'Error seeding database', error: error instanceof Error ? error.message : 'Unknown error' })
  }
}
