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

async function testCategoryFlow() {
  try {
    // 连接数据库
    await mongoose.connect('mongodb://127.0.0.1:27017/babymama')
    console.log('✅ Connected to MongoDB')

    console.log('\n🔍 Testing Category Flow Across Three Portals...\n')

    // 1. 测试Admin Portal - 获取所有分类
    console.log('1️⃣ Admin Portal - Fetching all categories:')
    const allCategories = await Category.find({}).sort({ sortOrder: 1, name: 1 })
    console.log(`   Found ${allCategories.length} categories in database`)
    
    // 显示分类结构
    const rootCategories = allCategories.filter(cat => !cat.parentId)
    const subCategories = allCategories.filter(cat => cat.parentId)
    
    console.log(`   📁 Root categories: ${rootCategories.length}`)
    rootCategories.forEach(cat => {
      const children = subCategories.filter(sub => sub.parentId.toString() === cat._id.toString())
      console.log(`      - ${cat.name.en} (${cat.name['zh-HK']}) - ${children.length} subcategories`)
    })

    // 2. 测试Public API - 获取活跃分类
    console.log('\n2️⃣ Public API - Fetching active categories:')
    const activeCategories = await Category.find({ isActive: true }).sort({ sortOrder: 1, name: 1 })
    console.log(`   Found ${activeCategories.length} active categories`)
    
    // 模拟用户端分类下拉菜单
    const userCategories = rootCategories.map(cat => {
      const children = subCategories.filter(sub => sub.parentId.toString() === cat._id.toString())
      return {
        id: cat._id,
        name: cat.name,
        slug: cat.slug,
        subCategories: children.map(sub => ({
          id: sub._id,
          name: sub.name,
          slug: sub.slug
        }))
      }
    })

    console.log('   📋 User Portal Category Structure:')
    userCategories.forEach(cat => {
      console.log(`      📁 ${cat.name.en} (${cat.name['zh-HK']})`)
      cat.subCategories.forEach(sub => {
        console.log(`         └── ${sub.name.en} (${sub.name['zh-HK']})`)
      })
    })

    // 3. 测试Merchant Portal - 分类选择
    console.log('\n3️⃣ Merchant Portal - Category selection for products:')
    console.log('   🛍️ Available categories for product creation:')
    
    // 模拟商家选择分类的过程
    const selectedMainCategory = rootCategories[0] // 选择第一个主分类
    const availableSubCategories = subCategories.filter(sub => 
      sub.parentId.toString() === selectedMainCategory._id.toString()
    )
    
    console.log(`   Selected main category: ${selectedMainCategory.name.en}`)
    console.log(`   Available subcategories:`)
    availableSubCategories.forEach(sub => {
      console.log(`      - ${sub.name.en} (${sub.name['zh-HK']})`)
    })

    // 4. 验证分类数据一致性
    console.log('\n4️⃣ Data Consistency Check:')
    
    // 检查分类名称是否与用户端一致
    const expectedCategories = [
      { en: 'Feeding', 'zh-HK': '餵食' },
      { en: 'Diapers & Wipes', 'zh-HK': '尿布與濕巾' },
      { en: 'Baby Care', 'zh-HK': '嬰兒護理' },
      { en: 'Clothing', 'zh-HK': '服裝' },
      { en: 'Toys', 'zh-HK': '玩具' },
      { en: 'Gear & Travel', 'zh-HK': '用品與旅行' },
      { en: 'Maternity', 'zh-HK': '孕婦用品' }
    ]

    let consistencyCheck = true
    expectedCategories.forEach(expected => {
      const found = rootCategories.find(cat => 
        cat.name.en === expected.en && cat.name['zh-HK'] === expected['zh-HK']
      )
      if (found) {
        console.log(`   ✅ ${expected.en} - Consistent`)
      } else {
        console.log(`   ❌ ${expected.en} - Missing or inconsistent`)
        consistencyCheck = false
      }
    })

    // 5. 测试分类层级结构
    console.log('\n5️⃣ Category Hierarchy Test:')
    const hierarchyValid = rootCategories.every(root => {
      const children = subCategories.filter(sub => sub.parentId.toString() === root._id.toString())
      return children.length > 0
    })

    if (hierarchyValid) {
      console.log('   ✅ All root categories have subcategories')
    } else {
      console.log('   ❌ Some root categories are missing subcategories')
    }

    // 6. 总结
    console.log('\n📊 Summary:')
    console.log(`   Total categories in database: ${allCategories.length}`)
    console.log(`   Root categories: ${rootCategories.length}`)
    console.log(`   Subcategories: ${subCategories.length}`)
    console.log(`   Active categories: ${activeCategories.length}`)
    console.log(`   Data consistency: ${consistencyCheck ? '✅ PASS' : '❌ FAIL'}`)
    console.log(`   Hierarchy structure: ${hierarchyValid ? '✅ PASS' : '❌ FAIL'}`)

    if (consistencyCheck && hierarchyValid) {
      console.log('\n🎉 Category flow test PASSED! All three portals can access consistent category data.')
    } else {
      console.log('\n❌ Category flow test FAILED! Please check the issues above.')
    }

  } catch (error) {
    console.error('❌ Error testing category flow:', error)
  } finally {
    await mongoose.disconnect()
    console.log('\n🔌 Disconnected from MongoDB')
  }
}

// 运行测试
testCategoryFlow()


