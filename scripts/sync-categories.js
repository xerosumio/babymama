const mongoose = require('mongoose')

// 定义Category Schema
const CategorySchema = new mongoose.Schema({
  name: {
    en: { type: String, required: true },
    'zh-HK': { type: String, required: true },
  },
  slug: { type: String, required: true, unique: true },
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  image: String,
  isActive: { type: Boolean, default: true },
  sortOrder: { type: Number, default: 0 },
}, {
  timestamps: true,
})

const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema)

// 用户端分类数据（从CategoryDropdown.tsx提取）
const userCategories = [
  {
    name: { en: 'Feeding', 'zh-HK': '餵食' },
    slug: 'feeding',
    subCategories: [
      { name: { en: 'Bottles & Nipples', 'zh-HK': '奶瓶與奶嘴' }, slug: 'bottles' },
      { name: { en: 'Baby Formula', 'zh-HK': '嬰兒配方奶粉' }, slug: 'formula' },
      { name: { en: 'High Chairs', 'zh-HK': '高腳椅' }, slug: 'high-chairs' },
      { name: { en: 'Bibs & Burp Cloths', 'zh-HK': '圍兜與拍嗝巾' }, slug: 'bibs' },
      { name: { en: 'Breastfeeding', 'zh-HK': '母乳餵養' }, slug: 'breastfeeding' }
    ]
  },
  {
    name: { en: 'Diapers & Wipes', 'zh-HK': '尿布與濕巾' },
    slug: 'diapers-wipes',
    subCategories: [
      { name: { en: 'Diapers', 'zh-HK': '尿布' }, slug: 'diapers' },
      { name: { en: 'Baby Wipes', 'zh-HK': '嬰兒濕巾' }, slug: 'wipes' },
      { name: { en: 'Changing Mats', 'zh-HK': '換尿布墊' }, slug: 'changing' },
      { name: { en: 'Potty Training', 'zh-HK': '如廁訓練' }, slug: 'potty-training' }
    ]
  },
  {
    name: { en: 'Baby Care', 'zh-HK': '嬰兒護理' },
    slug: 'baby-care',
    subCategories: [
      { name: { en: 'Skincare', 'zh-HK': '護膚用品' }, slug: 'skincare' },
      { name: { en: 'Bath & Grooming', 'zh-HK': '沐浴與護理' }, slug: 'bath' },
      { name: { en: 'Health & Safety', 'zh-HK': '健康與安全' }, slug: 'health' },
      { name: { en: 'Baby Monitors', 'zh-HK': '嬰兒監視器' }, slug: 'monitors' }
    ]
  },
  {
    name: { en: 'Clothing', 'zh-HK': '服裝' },
    slug: 'clothing',
    subCategories: [
      { name: { en: 'Bodysuits & Onesies', 'zh-HK': '連體衣' }, slug: 'bodysuits' },
      { name: { en: 'Sleepwear', 'zh-HK': '睡衣' }, slug: 'sleepwear' },
      { name: { en: 'Outerwear', 'zh-HK': '外套' }, slug: 'outerwear' },
      { name: { en: 'Clothing Accessories', 'zh-HK': '服裝配件' }, slug: 'accessories' }
    ]
  },
  {
    name: { en: 'Toys', 'zh-HK': '玩具' },
    slug: 'toys',
    subCategories: [
      { name: { en: 'Educational Toys', 'zh-HK': '教育玩具' }, slug: 'educational' },
      { name: { en: 'Soft Toys', 'zh-HK': '毛絨玩具' }, slug: 'soft-toys' },
      { name: { en: 'Activity Centers', 'zh-HK': '活動中心' }, slug: 'activity' },
      { name: { en: 'Outdoor Toys', 'zh-HK': '戶外玩具' }, slug: 'outdoor' }
    ]
  },
  {
    name: { en: 'Gear & Travel', 'zh-HK': '用品與旅行' },
    slug: 'gear-travel',
    subCategories: [
      { name: { en: 'Strollers', 'zh-HK': '嬰兒推車' }, slug: 'strollers' },
      { name: { en: 'Car Seats', 'zh-HK': '汽車安全座椅' }, slug: 'car-seats' },
      { name: { en: 'Baby Carriers', 'zh-HK': '嬰兒背帶' }, slug: 'carriers' },
      { name: { en: 'Travel Accessories', 'zh-HK': '旅行配件' }, slug: 'travel' }
    ]
  },
  {
    name: { en: 'Maternity', 'zh-HK': '孕婦用品' },
    slug: 'maternity',
    subCategories: [
      { name: { en: 'Maternity Clothing', 'zh-HK': '孕婦服裝' }, slug: 'clothing' },
      { name: { en: 'Maternity Pillows', 'zh-HK': '孕婦枕' }, slug: 'pillows' },
      { name: { en: 'Prenatal Health', 'zh-HK': '產前健康' }, slug: 'health' },
      { name: { en: 'Nursing Bras', 'zh-HK': '哺乳內衣' }, slug: 'nursing' }
    ]
  }
]

async function syncCategories() {
  try {
    // 连接数据库
    await mongoose.connect('mongodb://127.0.0.1:27017/babymama')
    console.log('✅ Connected to MongoDB')

    // 清空现有分类
    await Category.deleteMany({})
    console.log('🗑️ Cleared existing categories')

    let sortOrder = 1
    const createdCategories = []

    // 创建一级分类
    for (const categoryData of userCategories) {
      const category = new Category({
        name: categoryData.name,
        slug: categoryData.slug,
        parentId: null,
        isActive: true,
        sortOrder: sortOrder++,
        createdAt: new Date(),
        updatedAt: new Date()
      })

      const savedCategory = await category.save()
      createdCategories.push(savedCategory)
      console.log(`✅ Created category: ${categoryData.name.en}`)

      // 创建二级分类
      let subSortOrder = 1
      for (const subCategoryData of categoryData.subCategories) {
        const subCategory = new Category({
          name: subCategoryData.name,
          slug: `${categoryData.slug}/${subCategoryData.slug}`,
          parentId: savedCategory._id,
          isActive: true,
          sortOrder: subSortOrder++,
          createdAt: new Date(),
          updatedAt: new Date()
        })

        await subCategory.save()
        console.log(`  ✅ Created subcategory: ${subCategoryData.name.en}`)
      }
    }

    console.log(`\n🎉 Successfully synced ${createdCategories.length} main categories with their subcategories`)
    console.log('📊 Category structure:')
    
    // 显示分类结构
    for (const category of createdCategories) {
      const subCategories = await Category.find({ parentId: category._id })
      console.log(`\n📁 ${category.name.en} (${category.name['zh-HK']})`)
      subCategories.forEach(sub => {
        console.log(`  └── ${sub.name.en} (${sub.name['zh-HK']})`)
      })
    }

  } catch (error) {
    console.error('❌ Error syncing categories:', error)
  } finally {
    await mongoose.disconnect()
    console.log('\n🔌 Disconnected from MongoDB')
  }
}

// 运行脚本
syncCategories()
