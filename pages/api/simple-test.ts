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

    // Clear existing test user
    await User.deleteOne({ email: 'simple@test.com' })

    // Hash password
    const hashedPassword = await bcrypt.hash('test123', 12)
    console.log('Hashed password length:', hashedPassword.length)

    // Create user with minimal fields
    const user = new User({
      email: 'simple@test.com',
      password: hashedPassword,
      firstName: 'Simple',
      lastName: 'Test',
      phone: '+852 1111 1111',
      addresses: [{
        type: 'home',
        firstName: 'Simple',
        lastName: 'Test',
        phone: '+852 1111 1111',
        address1: 'Simple Street',
        city: 'Hong Kong',
        state: 'Hong Kong',
        postalCode: '00000',
        country: 'Hong Kong'
      }]
    })

    console.log('User before save:', {
      email: user.email,
      hasPassword: !!user.password,
      passwordLength: user.password?.length
    })

    await user.save()

    console.log('User after save:', {
      email: user.email,
      hasPassword: !!user.password,
      passwordLength: user.password?.length
    })

    // Fetch user with password
    const fetchedUser = await User.findOne({ email: 'simple@test.com' }).select('+password')
    console.log('Fetched user:', {
      email: fetchedUser?.email,
      hasPassword: !!fetchedUser?.password,
      passwordLength: fetchedUser?.password?.length
    })

    return res.status(200).json({
      message: 'Simple test completed',
      beforeSave: {
        email: user.email,
        hasPassword: !!user.password,
        passwordLength: user.password?.length
      },
      afterSave: {
        email: user.email,
        hasPassword: !!user.password,
        passwordLength: user.password?.length
      },
      fetched: {
        email: fetchedUser?.email,
        hasPassword: !!fetchedUser?.password,
        passwordLength: fetchedUser?.password?.length
      }
    })
  } catch (error) {
    console.error('Simple test error:', error)
    return res.status(500).json({ 
      error: 'Simple test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
