import { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'
import Order from '@/models/Order'
import Review from '@/models/Review'
import jwt from 'jsonwebtoken'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect()

  if (req.method !== 'DELETE') {
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

    // Check if user exists
    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    // Delete user-related data
    try {
      // Delete user's orders
      await Order.deleteMany({ userId })
      
      // Delete user's reviews
      await Review.deleteMany({ userId })
      
      // Delete user account
      await User.findByIdAndDelete(userId)
      
      return res.status(200).json({
        success: true,
        message: 'Account deleted successfully'
      })
    } catch (deleteError) {
      console.error('Error deleting user data:', deleteError)
      return res.status(500).json({ error: 'Failed to delete account data' })
    }
  } catch (error) {
    console.error('Delete account API error:', error)
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ error: 'Invalid token' })
    }
    return res.status(500).json({ error: 'Internal server error' })
  }
}
