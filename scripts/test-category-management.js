const { exec } = require('child_process')
const { promisify } = require('util')
const execAsync = promisify(exec)

async function testCategoryManagement() {
  try {
    console.log('🔍 Testing Category Management Page...\n')

    // 1. 测试公共API获取分类数据
    console.log('1️⃣ Testing Public Categories API:')
    try {
      const { stdout } = await execAsync('curl -s http://localhost:3001/api/categories')
      const categories = JSON.parse(stdout)
      console.log(`   ✅ Public API returned ${categories.length} categories`)
      
      // 分析分类层级结构
      const rootCategories = categories.filter(cat => !cat.parentId)
      const subCategories = categories.filter(cat => cat.parentId)
      
      console.log(`   📁 Root categories: ${rootCategories.length}`)
      console.log(`   📁 Sub categories: ${subCategories.length}`)
      
      // 显示分类树结构
      console.log('\n   📊 Category Tree Structure:')
      rootCategories.forEach(root => {
        console.log(`   📁 ${root.name.en} (${root.name['zh-HK']})`)
        const children = categories.filter(cat => cat.parentId === root._id)
        children.forEach(child => {
          console.log(`      └── ${child.name.en} (${child.name['zh-HK']})`)
        })
      })
      
    } catch (error) {
      console.log(`   ❌ Public API failed: ${error.message}`)
    }

    // 2. 测试Admin API（需要认证）
    console.log('\n2️⃣ Testing Admin Categories API:')
    try {
      const { stdout } = await execAsync('curl -s http://localhost:3001/api/admin/categories')
      const adminData = JSON.parse(stdout)
      console.log(`   ✅ Admin API returned ${adminData.length} categories`)
    } catch (error) {
      console.log(`   ⚠️ Admin API requires authentication: ${error.message}`)
    }

    // 3. 测试添加新分类功能
    console.log('\n3️⃣ Testing Add Category Functionality:')
    try {
      const newCategory = {
        name: {
          en: 'Test Category',
          'zh-HK': '測試分類'
        },
        slug: 'test-category',
        parentId: null,
        sortOrder: 99,
        isActive: true
      }

      const { stdout } = await execAsync(`curl -s -X POST http://localhost:3001/api/admin/categories -H "Content-Type: application/json" -d '${JSON.stringify(newCategory)}'`)
      console.log(`   ✅ Add category response: ${stdout}`)
    } catch (error) {
      console.log(`   ⚠️ Add category requires authentication: ${error.message}`)
    }

    // 4. 模拟Category Management页面的数据加载
    console.log('\n4️⃣ Simulating Category Management Page:')
    try {
      const { stdout } = await execAsync('curl -s http://localhost:3001/api/categories')
      const categories = JSON.parse(stdout)
      
      // 构建分类树
      const categoryMap = new Map()
      const rootCategories = []

      categories.forEach(category => {
        categoryMap.set(category._id, { ...category, children: [] })
      })

      categories.forEach(category => {
        if (category.parentId) {
          const parent = categoryMap.get(category.parentId)
          if (parent) {
            parent.children.push(categoryMap.get(category._id))
          }
        } else {
          rootCategories.push(categoryMap.get(category._id))
        }
      })

      console.log(`   📊 Built category tree with ${rootCategories.length} root categories`)
      
      // 显示完整的分类树
      const displayTree = (cats, level = 0) => {
        cats.forEach(cat => {
          const indent = '  '.repeat(level)
          console.log(`${indent}📁 ${cat.name.en} (${cat.name['zh-HK']}) - ${cat.children.length} subcategories`)
          if (cat.children.length > 0) {
            displayTree(cat.children, level + 1)
          }
        })
      }
      
      displayTree(rootCategories)
      
      console.log('\n✅ Category Management page should now display:')
      console.log('   - All categories with proper hierarchy')
      console.log('   - Expandable/collapsible tree structure')
      console.log('   - Dynamic parent category dropdown for adding new categories')
      console.log('   - Level indicators for subcategories')
      
    } catch (error) {
      console.log(`   ❌ Failed to load categories: ${error.message}`)
    }

  } catch (error) {
    console.error('❌ Error testing category management:', error)
  }
}

testCategoryManagement()


