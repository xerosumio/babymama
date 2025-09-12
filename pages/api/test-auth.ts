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

    const { email, password } = req.body

    console.log('Testing auth with:', { email, password: password ? 'provided' : 'missing' })

    // Find user
    const user = await User.findOne({ email }).select('+password')
    console.log('User found:', user ? 'yes' : 'no')

    if (!user) {
      return res.status(401).json({ error: 'User not found' })
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password)
    console.log('Password valid:', isPasswordValid)

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid password' })
    }

    // Remove password from response
    const userResponse = user.toObject()
    delete userResponse.password

    return res.status(200).json({
      message: 'Authentication successful',
      user: userResponse
    })
  } catch (error) {
    console.error('Auth test error:', error)
    return res.status(500).json({ 
      error: 'Authentication failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
