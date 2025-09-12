import { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'
import bcrypt from 'bcryptjs'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    await dbConnect()

    // Delete existing test user
    await User.deleteOne({ email: 'test@example.com' })

    // Create new test user
    const hashedPassword = await bcrypt.hash('password123', 12)
    const user = new User({
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      password: hashedPassword,
      phone: '+852 9999 9999',
      addresses: [{
        type: 'home',
        firstName: 'Test',
        lastName: 'User',
        phone: '+852 9999 9999',
        address1: '123 Test Street',
        city: 'Hong Kong',
        state: 'Hong Kong',
        postalCode: '00000',
        country: 'Hong Kong'
      }]
    })

    await user.save()

    // Fetch the user again to check if password was saved
    const savedUser = await User.findOne({ email: 'test@example.com' }).select('+password')

    return res.status(200).json({
      message: 'Test user created successfully',
      user: {
        email: user.email,
        hasPassword: !!user.password,
        passwordLength: user.password?.length || 0
      },
      savedUser: {
        email: savedUser?.email,
        hasPassword: !!savedUser?.password,
        passwordLength: savedUser?.password?.length || 0
      }
    })
  } catch (error) {
    console.error('Create test user error:', error)
    return res.status(500).json({ 
      error: 'Failed to create test user',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
