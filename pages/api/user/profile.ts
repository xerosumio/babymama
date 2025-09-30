import { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'
import jwt from 'jsonwebtoken'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect()

  if (req.method !== 'GET' && req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' })
    }

    const token = authHeader.substring(7) // Remove 'Bearer ' prefix

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any
    const userId = decoded.userId

    if (req.method === 'GET') {
      // Find user by ID
      const user = await User.findById(userId).select('-password')
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' })
      }

      return res.status(200).json({
        success: true,
        user: user
      })
    } else if (req.method === 'PUT') {
      // Update user profile
      const { firstName, lastName, phone, language, currency } = req.body
      
      const updateData: any = {}
      if (firstName !== undefined) updateData.firstName = firstName
      if (lastName !== undefined) updateData.lastName = lastName
      if (phone !== undefined) updateData.phone = phone
      if (language !== undefined) updateData.language = language
      if (currency !== undefined) updateData.currency = currency

      const user = await User.findByIdAndUpdate(
        userId,
        updateData,
        { new: true, runValidators: true }
      ).select('-password')

      if (!user) {
        return res.status(404).json({ error: 'User not found' })
      }

      return res.status(200).json({
        success: true,
        user: user
      })
    }
  } catch (error) {
    console.error('Profile fetch error:', error)
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ error: 'Invalid token' })
    }
    return res.status(500).json({ error: 'Internal server error' })
  }
}


