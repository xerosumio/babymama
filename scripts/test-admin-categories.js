const { exec } = require('child_process')
const { promisify } = require('util')
const execAsync = promisify(exec)

async function testAdminCategories() {
  try {
    console.log('🔍 Testing Admin Category Management...\n')

    // 1. 测试公共API
    console.log('1️⃣ Testing Public Categories API:')
    try {
      const { stdout } = await execAsync('curl -s http://localhost:3001/api/categories')
      const publicData = JSON.parse(stdout)
      console.log(`   ✅ Public API returned ${publicData.length} categories`)
      
      // 显示主分类
      const rootCategories = publicData.filter(cat => !cat.parentId)
      console.log(`   📁 Root categories: ${rootCategories.length}`)
      rootCategories.forEach(cat => {
        console.log(`      - ${cat.name.en} (${cat.name['zh-HK']})`)
      })
    } catch (error) {
      console.log(`   ❌ Public API failed: ${error.message}`)
    }

    // 2. 测试Admin API (需要认证)
    console.log('\n2️⃣ Testing Admin Categories API:')
    try {
      const { stdout } = await execAsync('curl -s http://localhost:3001/api/admin/categories')
      const adminData = JSON.parse(stdout)
      console.log(`   ✅ Admin API returned ${adminData.length} categories`)
    } catch (error) {
      console.log(`   ⚠️ Admin API requires authentication: ${error.message}`)
    }

    // 3. 模拟Category Management页面的数据加载
    console.log('\n3️⃣ Simulating Category Management Page:')
    try {
      const { stdout } = await execAsync('curl -s http://localhost:3001/api/categories')
      const categories = JSON.parse(stdout)
      
      // 构建分类树结构
      const categoryMap = new Map()
      const rootCategories = []

      categories.forEach(category => {
        categoryMap.set(category._id, { ...category, children: [] })
      })

      categories.forEach(category => {
        if (category.parentId) {
          const parent = categoryMap.get(category.parentId._id)
          if (parent) {
            parent.children.push(categoryMap.get(category._id))
          }
        } else {
          rootCategories.push(categoryMap.get(category._id))
        }
      })

      console.log(`   📊 Built category tree with ${rootCategories.length} root categories`)
      rootCategories.forEach(cat => {
        console.log(`   📁 ${cat.name.en} (${cat.name['zh-HK']}) - ${cat.children.length} subcategories`)
        cat.children.forEach(sub => {
          console.log(`      └── ${sub.name.en} (${sub.name['zh-HK']})`)
        })
      })

      console.log('\n✅ Category Management should now display all categories correctly!')
    } catch (error) {
      console.log(`   ❌ Failed to load categories: ${error.message}`)
    }

  } catch (error) {
    console.error('❌ Error testing admin categories:', error)
  }
}

// 运行测试
testAdminCategories()
