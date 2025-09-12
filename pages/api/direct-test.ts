import { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '@/lib/mongodb'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    await dbConnect()

    // Create a simple schema without types
    const UserSchema = new mongoose.Schema({
      email: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
    }, {
      timestamps: true,
    })

    const User = mongoose.models.TestUser || mongoose.model('TestUser', UserSchema)

    // Clear existing test user
    await User.deleteOne({ email: 'direct@test.com' })

    // Hash password
    const hashedPassword = await bcrypt.hash('test123', 12)
    console.log('Hashed password:', hashedPassword.substring(0, 20) + '...')

    // Create user
    const user = new User({
      email: 'direct@test.com',
      password: hashedPassword,
      firstName: 'Direct',
      lastName: 'Test'
    })

    console.log('User before save:', {
      email: user.email,
      password: user.password ? user.password.substring(0, 20) + '...' : 'NO PASSWORD'
    })

    await user.save()

    console.log('User after save:', {
      email: user.email,
      password: user.password ? user.password.substring(0, 20) + '...' : 'NO PASSWORD'
    })

    // Fetch user
    const fetchedUser = await User.findOne({ email: 'direct@test.com' })
    console.log('Fetched user:', {
      email: fetchedUser?.email,
      password: fetchedUser?.password ? fetchedUser.password.substring(0, 20) + '...' : 'NO PASSWORD'
    })

    return res.status(200).json({
      message: 'Direct test completed',
      beforeSave: {
        email: user.email,
        hasPassword: !!user.password,
        passwordPreview: user.password ? user.password.substring(0, 20) + '...' : 'NO PASSWORD'
      },
      afterSave: {
        email: user.email,
        hasPassword: !!user.password,
        passwordPreview: user.password ? user.password.substring(0, 20) + '...' : 'NO PASSWORD'
      },
      fetched: {
        email: fetchedUser?.email,
        hasPassword: !!fetchedUser?.password,
        passwordPreview: fetchedUser?.password ? fetchedUser.password.substring(0, 20) + '...' : 'NO PASSWORD'
      }
    })
  } catch (error) {
    console.error('Direct test error:', error)
    return res.status(500).json({ 
      error: 'Direct test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
