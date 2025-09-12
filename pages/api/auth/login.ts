import { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'
import Merchant from '@/models/Merchant'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect()

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { email, password, userType = 'user' } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    let user
    if (userType === 'merchant') {
      user = await Merchant.findOne({ email }).select('+password')
    } else {
      user = await User.findOne({ email }).select('+password')
    }

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user._id, 
        email: user.email, 
        userType,
        role: user.role || (userType === 'merchant' ? 'merchant' : 'user')
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    )

    // Remove password from response
    const userResponse = user.toObject()
    delete userResponse.password

    return res.status(200).json({
      message: 'Login successful',
      token,
      user: userResponse,
      userType
    })
  } catch (error) {
    console.error('Login error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
