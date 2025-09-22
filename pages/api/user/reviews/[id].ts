import { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '@/lib/mongodb'
import Review from '@/models/Review'
import jwt from 'jsonwebtoken'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect()

  if (req.method !== 'PUT' && req.method !== 'DELETE') {
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

    const { id } = req.query
    if (!id) {
      return res.status(400).json({ error: 'Review ID is required' })
    }

    if (req.method === 'PUT') {
      // Update review
      const { rating, title, comment } = req.body

      if (!rating || !title || !comment) {
        return res.status(400).json({ error: 'Missing required fields' })
      }

      if (rating < 1 || rating > 5) {
        return res.status(400).json({ error: 'Rating must be between 1 and 5' })
      }

      const review = await Review.findOneAndUpdate(
        { _id: id, userId },
        { rating, title, comment, updatedAt: new Date() },
        { new: true }
      ).populate('productId', 'name images')

      if (!review) {
        return res.status(404).json({ error: 'Review not found' })
      }

      return res.status(200).json({
        success: true,
        review
      })
    } else if (req.method === 'DELETE') {
      // Delete review
      const review = await Review.findOneAndDelete({ _id: id, userId })

      if (!review) {
        return res.status(404).json({ error: 'Review not found' })
      }

      return res.status(200).json({
        success: true,
        message: 'Review deleted successfully'
      })
    }
  } catch (error) {
    console.error('Review API error:', error)
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ error: 'Invalid token' })
    }
    return res.status(500).json({ error: 'Internal server error' })
  }
}
