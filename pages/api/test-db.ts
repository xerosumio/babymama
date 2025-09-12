import { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '@/lib/mongodb'
import Product from '@/models/Product'
import Category from '@/models/Category'
import Merchant from '@/models/Merchant'
import User from '@/models/User'
import Order from '@/models/Order'
import Review from '@/models/Review'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    await dbConnect()

    // Test database connection by counting documents
    const counts = {
      products: await Product.countDocuments(),
      categories: await Category.countDocuments(),
      merchants: await Merchant.countDocuments(),
      users: await User.countDocuments(),
      orders: await Order.countDocuments(),
      reviews: await Review.countDocuments()
    }

    // Get a sample product with populated fields
    const sampleProduct = await Product.findOne()
      .populate('categoryId', 'name slug')
      .populate('merchantId', 'name email')

    res.status(200).json({
      message: 'Database connection successful',
      connection: 'MongoDB connected successfully',
      counts,
      sampleProduct: sampleProduct ? {
        name: sampleProduct.name,
        price: sampleProduct.price,
        category: sampleProduct.categoryId,
        merchant: sampleProduct.merchantId
      } : null
    })
  } catch (error) {
    console.error('Database test error:', error)
    res.status(500).json({ 
      error: 'Database connection failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
