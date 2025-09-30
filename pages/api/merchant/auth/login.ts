import { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '@/lib/mongodb'
import Merchant from '@/models/Merchant'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    await dbConnect()

    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    // Find merchant by email
    const merchant = await Merchant.findOne({ email })
    if (!merchant) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, merchant.password)
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        merchantId: merchant._id, 
        email: merchant.email, 
        userType: 'merchant',
        role: 'merchant'
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    // Remove password from response
    const merchantResponse = merchant.toObject()
    delete merchantResponse.password

    return res.status(200).json({
      message: 'Login successful',
      token,
      merchant: merchantResponse,
      userType: 'merchant'
    })
  } catch (error) {
    console.error('Merchant login error:', error)
    return res.status(500).json({ 
      error: 'Login failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}