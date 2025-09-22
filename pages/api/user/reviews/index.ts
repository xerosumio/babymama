import { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '@/lib/mongodb'
import Review from '@/models/Review'
import jwt from 'jsonwebtoken'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect()

  if (req.method !== 'GET' && req.method !== 'POST') {
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
      // Get user reviews
      const { page = 1, limit = 10 } = req.query

      const skip = (Number(page) - 1) * Number(limit)

      const reviews = await Review.find({ userId })
        .populate('productId', 'name images')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))

      const total = await Review.countDocuments({ userId })

      return res.status(200).json({
        success: true,
        reviews,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      })
    } else if (req.method === 'POST') {
      // Create new review
      const { productId, rating, title, comment } = req.body

      if (!productId || !rating || !title || !comment) {
        return res.status(400).json({ error: 'Missing required fields' })
      }

      if (rating < 1 || rating > 5) {
        return res.status(400).json({ error: 'Rating must be between 1 and 5' })
      }

      // Check if user already reviewed this product
      const existingReview = await Review.findOne({ userId, productId })
      if (existingReview) {
        return res.status(400).json({ error: 'You have already reviewed this product' })
      }

      const review = new Review({
        userId,
        productId,
        rating,
        title,
        comment,
        isVerified: true // Assume verified for now
      })

      await review.save()

      const populatedReview = await Review.findById(review._id)
        .populate('productId', 'name images')

      return res.status(201).json({
        success: true,
        review: populatedReview
      })
    }
  } catch (error) {
    console.error('Reviews API error:', error)
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ error: 'Invalid token' })
    }
    return res.status(500).json({ error: 'Internal server error' })
  }
}
