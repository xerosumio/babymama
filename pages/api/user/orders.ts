import { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '@/lib/mongodb'
import Order from '@/models/Order'
import Product from '@/models/Product'
import jwt from 'jsonwebtoken'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect()

  if (req.method !== 'GET') {
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

    // Get query parameters
    const { status, page = 1, limit = 10 } = req.query

    // Build query
    let query: any = { userId }
    if (status && status !== 'all') {
      query.status = status
    }

    // Calculate pagination
    const skip = (Number(page) - 1) * Number(limit)

    // Get orders with pagination
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .populate('items.productId', 'name price image')
      .populate('items.merchantId', 'name email')

    // Get total count for pagination
    const total = await Order.countDocuments(query)

    return res.status(200).json({
      success: true,
      orders,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    })
  } catch (error) {
    console.error('User orders fetch error:', error)
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ error: 'Invalid token' })
    }
    return res.status(500).json({ error: 'Internal server error' })
  }
}
