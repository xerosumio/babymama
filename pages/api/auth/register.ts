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
    const { 
      name, 
      email, 
      password, 
      phone, 
      userType = 'user',
      businessName,
      businessType,
      address
    } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' })
    }

    // Check if user already exists
    let existingUser
    if (userType === 'merchant') {
      existingUser = await Merchant.findOne({ email })
    } else {
      existingUser = await User.findOne({ email })
    }

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email' })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    let user
    if (userType === 'merchant') {
      user = new Merchant({
        name,
        email,
        password: hashedPassword,
        phone,
        businessName,
        businessType,
        address,
        status: 'pending' // New merchants need approval
      })
    } else {
      user = new User({
        name,
        email,
        password: hashedPassword,
        phone
      })
    }

    await user.save()

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

    return res.status(201).json({
      message: 'Registration successful',
      token,
      user: userResponse,
      userType
    })
  } catch (error) {
    console.error('Registration error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
