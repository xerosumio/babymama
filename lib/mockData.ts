import { Product, Category, Merchant, Review } from '@/lib/types'

export const mockCategories: Category[] = [
  {
    _id: '1',
    name: { en: 'Feeding', 'zh-HK': '餵食' },
    slug: 'feeding',
    isActive: true,
    sortOrder: 1,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    _id: '2',
    name: { en: 'Diapers & Wipes', 'zh-HK': '尿布與濕巾' },
    slug: 'diapers-wipes',
    isActive: true,
    sortOrder: 2,
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-02'),
  },
  {
    _id: '3',
    name: { en: 'Baby Care', 'zh-HK': '嬰兒護理' },
    slug: 'baby-care',
    isActive: true,
    sortOrder: 3,
    createdAt: new Date('2024-01-03'),
    updatedAt: new Date('2024-01-03'),
  },
  {
    _id: '4',
    name: { en: 'Clothing', 'zh-HK': '服裝' },
    slug: 'clothing',
    isActive: true,
    sortOrder: 4,
    createdAt: new Date('2024-01-04'),
    updatedAt: new Date('2024-01-04'),
  },
  {
    _id: '5',
    name: { en: 'Toys', 'zh-HK': '玩具' },
    slug: 'toys',
    isActive: true,
    sortOrder: 5,
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-05'),
  },
  {
    _id: '6',
    name: { en: 'Gear & Travel', 'zh-HK': '用品與旅行' },
    slug: 'gear-travel',
    isActive: true,
    sortOrder: 6,
    createdAt: new Date('2024-01-06'),
    updatedAt: new Date('2024-01-06'),
  },
  {
    _id: '7',
    name: { en: 'Maternity', 'zh-HK': '孕婦用品' },
    slug: 'maternity',
    isActive: true,
    sortOrder: 7,
    createdAt: new Date('2024-01-07'),
    updatedAt: new Date('2024-01-07'),
  },
]

export const mockMerchants: Merchant[] = [
  {
    _id: '1',
    name: 'ORGANICBABY',
    slug: 'organicbaby',
    description: {
      en: 'Premium organic baby products for healthy development',
      'zh-HK': '優質有機嬰兒產品，促進健康發展'
    },
    email: 'info@organicbaby.com',
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
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    _id: '2',
    name: 'NUTRIBABY',
    slug: 'nutribaby',
    description: {
      en: 'Nutritional baby formula and supplements',
      'zh-HK': '營養嬰兒配方奶粉和補充品'
    },
    email: 'info@nutribaby.com',
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
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-02'),
  },
  {
    _id: '3',
    name: 'COMFYDIAPER',
    slug: 'comfydiaper',
    description: {
      en: 'Comfortable and absorbent diapers for all babies',
      'zh-HK': '舒適吸水的尿布，適合所有嬰兒'
    },
    email: 'info@comfydiaper.com',
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
    createdAt: new Date('2024-01-03'),
    updatedAt: new Date('2024-01-03'),
  },
]

export const mockProducts: Product[] = [
  {
    _id: '1',
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
    categoryId: '4',
    category: mockCategories[3],
    merchantId: '1',
    merchant: mockMerchants[0],
    images: [
      'https://images.unsplash.com/photo-1522771930-78848d9293e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    ],
    variants: [],
    tags: ['organic', 'cotton', 'baby', 'clothing'],
    isActive: true,
    isFeatured: true,
    isNew: true,
    weight: 0.5,
    dimensions: { length: 30, width: 25, height: 2 },
    reviews: [], // 将在后面添加reviews
    averageRating: 4.7,
    totalReviews: 3,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    _id: '1b',
    name: {
      en: 'Baby Sleepwear Set - 3 Pack',
      'zh-HK': '嬰兒睡衣套裝 - 3件裝'
    },
    description: {
      en: 'Comfortable sleepwear set perfect for bedtime. Made with soft, breathable fabric for a good night\'s sleep.',
      'zh-HK': '舒適的睡衣套裝，完美適合睡前穿著。採用柔軟透氣面料，讓寶寶安睡整夜。'
    },
    slug: 'baby-sleepwear-set-3-pack',
    sku: 'BSS-001',
    price: 199,
    compareAtPrice: 249,
    costPrice: 150,
    categoryId: '4',
    category: mockCategories[3],
    merchantId: '1',
    merchant: mockMerchants[0],
    images: [
      'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      'https://images.unsplash.com/photo-1522771930-78848d9293e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    ],
    variants: [],
    tags: ['sleepwear', 'baby', 'clothing', 'comfort'],
    isActive: true,
    isFeatured: false,
    isNew: false,
    weight: 0.3,
    dimensions: { length: 25, width: 20, height: 1 },
    reviews: [],
    averageRating: 4.5,
    totalReviews: 2,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10'),
  },
  {
    _id: '1c',
    name: {
      en: 'Baby Romper - Summer Collection',
      'zh-HK': '嬰兒連身衣 - 夏季系列'
    },
    description: {
      en: 'Lightweight romper perfect for summer days. Easy to wear and comfortable for active babies.',
      'zh-HK': '輕便連身衣，完美適合夏日穿著。易穿脫，為活潑的寶寶提供舒適體驗。'
    },
    slug: 'baby-romper-summer-collection',
    sku: 'BRC-001',
    price: 159,
    compareAtPrice: 199,
    costPrice: 120,
    categoryId: '4',
    category: mockCategories[3],
    merchantId: '1',
    merchant: mockMerchants[0],
    images: [
      'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      'https://images.unsplash.com/photo-1522771930-78848d9293e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    ],
    variants: [],
    tags: ['romper', 'summer', 'baby', 'clothing'],
    isActive: true,
    isFeatured: false,
    isNew: true,
    weight: 0.2,
    dimensions: { length: 28, width: 22, height: 1 },
    reviews: [],
    averageRating: 4.3,
    totalReviews: 1,
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
  },
  {
    _id: '1d',
    name: {
      en: 'Baby Winter Jacket - Warm & Cozy',
      'zh-HK': '嬰兒冬季外套 - 溫暖舒適'
    },
    description: {
      en: 'Warm winter jacket to keep your baby cozy during cold weather. Water-resistant and easy to clean.',
      'zh-HK': '保暖冬季外套，讓寶寶在寒冷天氣中保持溫暖。防水且易於清潔。'
    },
    slug: 'baby-winter-jacket-warm-cozy',
    sku: 'BWJ-001',
    price: 299,
    compareAtPrice: 359,
    costPrice: 220,
    categoryId: '4',
    category: mockCategories[3],
    merchantId: '1',
    merchant: mockMerchants[0],
    images: [
      'https://images.unsplash.com/photo-1522771930-78848d9293e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    ],
    variants: [],
    tags: ['jacket', 'winter', 'baby', 'clothing', 'warm'],
    isActive: true,
    isFeatured: true,
    isNew: false,
    weight: 0.4,
    dimensions: { length: 32, width: 26, height: 3 },
    reviews: [],
    averageRating: 4.8,
    totalReviews: 4,
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-05'),
  },
  {
    _id: '2',
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
    categoryId: '1',
    category: mockCategories[0],
    merchantId: '2',
    merchant: mockMerchants[1],
    images: [
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    ],
    variants: [],
    tags: ['formula', 'milk', 'nutrition', 'baby'],
    isActive: true,
    isFeatured: true,
    isNew: true,
    weight: 0.8,
    dimensions: { length: 15, width: 15, height: 25 },
    createdAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-01-16'),
  },
  {
    _id: '3',
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
    categoryId: '2',
    category: mockCategories[1],
    merchantId: '3',
    merchant: mockMerchants[2],
    images: [
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    ],
    variants: [],
    tags: ['diapers', 'absorbent', 'baby', 'hygiene'],
    isActive: true,
    isFeatured: true,
    isNew: true,
    weight: 2.5,
    dimensions: { length: 40, width: 30, height: 15 },
    createdAt: new Date('2024-01-17'),
    updatedAt: new Date('2024-01-17'),
  },
  {
    _id: '4',
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
    categoryId: '3',
    category: mockCategories[2],
    merchantId: '1',
    merchant: mockMerchants[0],
    images: [
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      'https://images.unsplash.com/photo-1583743814966-8936f37f0a2e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    ],
    variants: [],
    tags: ['blanket', 'soft', 'baby', 'comfort'],
    isActive: true,
    isFeatured: true,
    isNew: false,
    weight: 0.3,
    dimensions: { length: 80, width: 60, height: 2 },
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-18'),
  },
  {
    _id: '5',
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
    categoryId: '5',
    category: mockCategories[4],
    merchantId: '2',
    merchant: mockMerchants[1],
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
    createdAt: new Date('2024-01-19'),
    updatedAt: new Date('2024-01-19'),
  },
  {
    _id: '6',
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
    categoryId: '6',
    category: mockCategories[5],
    merchantId: '3',
    merchant: mockMerchants[2],
    images: [
      'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    ],
    variants: [],
    tags: ['stroller', 'travel', 'baby', 'gear'],
    isActive: true,
    isFeatured: true,
    isNew: false,
    weight: 8.5,
    dimensions: { length: 100, width: 50, height: 110 },
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
  },
  {
    _id: '7',
    name: {
      en: 'Baby Bottle Set - 4 Pack',
      'zh-HK': '嬰兒奶瓶套裝 - 4件裝'
    },
    description: {
      en: 'BPA-free baby bottles with anti-colic design. Perfect for feeding your little one comfortably.',
      'zh-HK': '不含BPA的嬰兒奶瓶，具有防脹氣設計。完美適合舒適地餵養您的小寶貝。'
    },
    slug: 'baby-bottle-set-4-pack',
    sku: 'BBS-001',
    price: 199,
    compareAtPrice: 249,
    costPrice: 150,
    categoryId: '1',
    category: mockCategories[0],
    merchantId: '1',
    merchant: mockMerchants[0],
    images: [
      'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    ],
    variants: [],
    tags: ['bottles', 'feeding', 'BPA-free', 'baby'],
    isActive: true,
    isFeatured: false,
    isNew: true,
    weight: 0.6,
    dimensions: { length: 20, width: 20, height: 15 },
    createdAt: new Date('2024-01-21'),
    updatedAt: new Date('2024-01-21'),
  },
  {
    _id: '8',
    name: {
      en: 'Baby Carrier - Ergonomic Design',
      'zh-HK': '嬰兒背帶 - 人體工學設計'
    },
    description: {
      en: 'Comfortable and ergonomic baby carrier for hands-free carrying. Perfect for parents on the go.',
      'zh-HK': '舒適且符合人體工學的嬰兒背帶，適合免手攜帶。非常適合忙碌的父母。'
    },
    slug: 'baby-carrier-ergonomic-design',
    sku: 'BCD-001',
    price: 399,
    compareAtPrice: 499,
    costPrice: 300,
    categoryId: '6',
    category: mockCategories[5],
    merchantId: '2',
    merchant: mockMerchants[1],
    images: [
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      'https://images.unsplash.com/photo-1583743814966-8936f37f0a2e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    ],
    variants: [],
    tags: ['carrier', 'ergonomic', 'hands-free', 'baby'],
    isActive: true,
    isFeatured: false,
    isNew: true,
    weight: 1.2,
    dimensions: { length: 40, width: 30, height: 5 },
    createdAt: new Date('2024-01-22'),
    updatedAt: new Date('2024-01-22'),
  },
  {
    _id: '9',
    name: {
      en: 'Baby Skincare Set - Natural',
      'zh-HK': '嬰兒護膚套裝 - 天然'
    },
    description: {
      en: 'Gentle baby skincare products made with natural ingredients. Perfect for sensitive baby skin.',
      'zh-HK': '採用天然成分製成的溫和嬰兒護膚產品。非常適合敏感的嬰兒肌膚。'
    },
    slug: 'baby-skincare-set-natural',
    sku: 'BSS-001',
    price: 149,
    compareAtPrice: 199,
    costPrice: 100,
    categoryId: '3',
    category: mockCategories[2],
    merchantId: '3',
    merchant: mockMerchants[2],
    images: [
      'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      'https://images.unsplash.com/photo-1583743814966-8936f37f0a2e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    ],
    variants: [],
    tags: ['skincare', 'natural', 'baby', 'sensitive'],
    isActive: true,
    isFeatured: false,
    isNew: true,
    weight: 0.4,
    dimensions: { length: 15, width: 15, height: 10 },
    createdAt: new Date('2024-01-23'),
    updatedAt: new Date('2024-01-23'),
  },
  {
    _id: '10',
    name: {
      en: 'Maternity Pillow - Comfort',
      'zh-HK': '孕婦枕 - 舒適'
    },
    description: {
      en: 'Comfortable maternity pillow designed to support your growing belly and improve sleep quality.',
      'zh-HK': '舒適的孕婦枕，旨在支撐您日益增長的腹部並改善睡眠質量。'
    },
    slug: 'maternity-pillow-comfort',
    sku: 'MPC-001',
    price: 299,
    compareAtPrice: 399,
    costPrice: 200,
    categoryId: '7',
    category: mockCategories[6],
    merchantId: '1',
    merchant: mockMerchants[0],
    images: [
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      'https://images.unsplash.com/photo-1583743814966-8936f37f0a2e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    ],
    variants: [],
    tags: ['maternity', 'pillow', 'comfort', 'sleep'],
    isActive: true,
    isFeatured: false,
    isNew: true,
    weight: 1.5,
    dimensions: { length: 150, width: 50, height: 20 },
    createdAt: new Date('2024-01-24'),
    updatedAt: new Date('2024-01-24'),
  },
  {
    _id: '11',
    name: {
      en: 'Baby High Chair - Adjustable',
      'zh-HK': '嬰兒高腳椅 - 可調節'
    },
    description: {
      en: 'Adjustable baby high chair with safety features. Perfect for mealtime with your little one.',
      'zh-HK': '具有安全功能的可調節嬰兒高腳椅。非常適合與您的小寶貝一起用餐。'
    },
    slug: 'baby-high-chair-adjustable',
    sku: 'BHC-001',
    price: 599,
    compareAtPrice: 799,
    costPrice: 450,
    categoryId: '1',
    category: mockCategories[0],
    merchantId: '2',
    merchant: mockMerchants[1],
    images: [
      'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      'https://images.unsplash.com/photo-1583743814966-8936f37f0a2e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    ],
    variants: [],
    tags: ['high-chair', 'adjustable', 'safety', 'feeding'],
    isActive: true,
    isFeatured: false,
    isNew: true,
    weight: 8.0,
    dimensions: { length: 60, width: 50, height: 100 },
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-01-25'),
  },
  {
    _id: '12',
    name: {
      en: 'Baby Monitor - Smart',
      'zh-HK': '嬰兒監視器 - 智能'
    },
    description: {
      en: 'Smart baby monitor with video and audio capabilities. Keep an eye on your little one from anywhere.',
      'zh-HK': '具有視頻和音頻功能的智能嬰兒監視器。隨時隨地關注您的小寶貝。'
    },
    slug: 'baby-monitor-smart',
    sku: 'BMS-001',
    price: 799,
    compareAtPrice: 999,
    costPrice: 600,
    categoryId: '3',
    category: mockCategories[2],
    merchantId: '3',
    merchant: mockMerchants[2],
    images: [
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      'https://images.unsplash.com/photo-1583743814966-8936f37f0a2e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    ],
    variants: [],
    tags: ['monitor', 'smart', 'video', 'audio'],
    isActive: true,
    isFeatured: false,
    isNew: true,
    weight: 0.8,
    dimensions: { length: 20, width: 15, height: 10 },
    createdAt: new Date('2024-01-26'),
    updatedAt: new Date('2024-01-26'),
  },
]

export const mockReviews: Review[] = [
  {
    _id: '1',
    userId: 'user1',
    user: {
      _id: 'user1',
      email: 'sarah@example.com',
      firstName: 'Sarah',
      lastName: 'M.',
      language: 'en',
      currency: 'HKD',
      addresses: [],
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
    productId: '1',
    product: {} as Product,
    orderId: 'order1',
    rating: 5,
    title: 'Amazing quality!',
    comment: 'Amazing quality baby products! The organic cotton bodysuits are so soft and comfortable. Fast delivery and excellent customer service.',
    images: [],
    isVerified: true,
    helpful: 12,
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
  },
  {
    _id: '2',
    userId: 'user2',
    user: {
      _id: 'user2',
      email: 'michael@example.com',
      firstName: 'Michael',
      lastName: 'L.',
      language: 'en',
      currency: 'HKD',
      addresses: [],
      createdAt: new Date('2024-01-02'),
      updatedAt: new Date('2024-01-02'),
    },
    productId: '1',
    product: {} as Product,
    orderId: 'order2',
    rating: 4,
    title: 'Great selection!',
    comment: 'Great selection of baby formula and feeding products. The convenience of online shopping with babymama is unbeatable!',
    images: [],
    isVerified: true,
    helpful: 8,
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-18'),
  },
  {
    _id: '3',
    userId: 'user3',
    user: {
      _id: 'user3',
      email: 'emily@example.com',
      firstName: 'Emily',
      lastName: 'C.',
      language: 'en',
      currency: 'HKD',
      addresses: [],
      createdAt: new Date('2024-01-03'),
      updatedAt: new Date('2024-01-03'),
    },
    productId: '1',
    product: {} as Product,
    orderId: 'order3',
    rating: 5,
    title: 'Perfect for my baby!',
    comment: 'The diapers are incredibly absorbent and gentle on my baby\'s skin. No leaks, no rashes - just great value for money.',
    images: [],
    isVerified: true,
    helpful: 15,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    _id: '4',
    userId: 'user4',
    user: {
      _id: 'user4',
      email: 'jessica@example.com',
      firstName: 'Jessica',
      lastName: 'W.',
      language: 'en',
      currency: 'HKD',
      addresses: [],
      createdAt: new Date('2024-01-04'),
      updatedAt: new Date('2024-01-04'),
    },
    productId: '1',
    product: {} as Product,
    orderId: 'order4',
    rating: 5,
    title: 'Love the educational toys!',
    comment: 'Love the educational toys! My 8-month-old is fascinated by the wooden toy set. Customer service was very helpful too.',
    images: [],
    isVerified: true,
    helpful: 6,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10'),
  },
  {
    _id: '5',
    userId: 'user5',
    user: {
      _id: 'user5',
      email: 'david@example.com',
      firstName: 'David',
      lastName: 'K.',
      language: 'en',
      currency: 'HKD',
      addresses: [],
      createdAt: new Date('2024-01-05'),
      updatedAt: new Date('2024-01-05'),
    },
    productId: '1',
    product: {} as Product,
    orderId: 'order5',
    rating: 4,
    title: 'Excellent baby carrier!',
    comment: 'Excellent baby carrier! Very comfortable and ergonomic design. Perfect for long walks with my little one.',
    images: [],
    isVerified: true,
    helpful: 9,
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-08'),
  },
  {
    _id: '6',
    userId: 'user6',
    user: {
      _id: 'user6',
      email: 'lisa@example.com',
      firstName: 'Lisa',
      lastName: 'T.',
      language: 'en',
      currency: 'HKD',
      addresses: [],
      createdAt: new Date('2024-01-06'),
      updatedAt: new Date('2024-01-06'),
    },
    productId: '1',
    product: {} as Product,
    orderId: 'order6',
    rating: 5,
    title: 'Amazing skincare set!',
    comment: 'The baby skincare set is amazing! All natural ingredients and beautiful packaging. Perfect for gifting too.',
    images: [],
    isVerified: true,
    helpful: 11,
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-05'),
  }
]

// 为产品添加reviews的函数
export const addReviewsToProducts = (products: Product[]): Product[] => {
  return products.map((product, index) => {
    if (index === 0) { // 为第一个产品添加reviews
      return {
        ...product,
        reviews: mockReviews.slice(0, 3),
        averageRating: 4.7,
        totalReviews: 3,
      }
    }
    return product
  })
}

// 更新mockProducts，添加reviews
export const mockProductsWithReviews = addReviewsToProducts(mockProducts)