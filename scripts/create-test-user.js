const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

// 连接数据库
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/babymama')
    console.log('MongoDB connected')
  } catch (error) {
    console.error('MongoDB connection error:', error)
    process.exit(1)
  }
}

// 用户模型
const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, default: '' },
  role: { type: String, default: 'user' },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
})

const User = mongoose.models.User || mongoose.model('User', UserSchema)

// 创建测试用户
const createTestUser = async () => {
  try {
    await connectDB()
    
    // 检查用户是否已存在
    const existingUser = await User.findOne({ email: 'kelly@test.com' })
    if (existingUser) {
      console.log('Test user already exists')
      return
    }
    
    // 创建测试用户
    const hashedPassword = await bcrypt.hash('password123', 12)
    const user = new User({
      firstName: 'Kelly',
      lastName: 'Test',
      email: 'kelly@test.com',
      password: hashedPassword,
      phone: '+852-1234-5678',
      role: 'user',
      isActive: true
    })
    
    await user.save()
    console.log('Test user created successfully:', user.email)
    
  } catch (error) {
    console.error('Error creating test user:', error)
  } finally {
    mongoose.connection.close()
  }
}

createTestUser()
