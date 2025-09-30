import { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '@/lib/mongodb'
import Product from '@/models/Product'
import Order from '@/models/Order'
import Review from '@/models/Review'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    await dbConnect()

    const { merchantId } = req.query

    if (!merchantId) {
      return res.status(400).json({ error: 'Merchant ID is required' })
    }

    // Get merchant's products
    const products = await Product.find({ merchantId })
    const totalProducts = products.length
    const activeProducts = products.filter(p => p.isActive).length

    // Get merchant's orders
    const orders = await Order.find({ 'items.merchantId': merchantId })
    const totalOrders = orders.length
    const pendingOrders = orders.filter(o => o.status === 'pending').length
    const processingOrders = orders.filter(o => o.status === 'processing').length

    // Calculate total sales
    const totalSales = orders.reduce((sum, order) => {
      const merchantItems = order.items.filter((item: any) => 
        item.merchantId.toString() === merchantId
      )
      return sum + merchantItems.reduce((itemSum: number, item: any) => itemSum + item.total, 0)
    }, 0)

    // Get recent orders
    const recentOrders = await Order.find({ 'items.merchantId': merchantId })
      .populate('userId', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .limit(5)

    // Get product reviews
    const productIds = products.map(p => p._id)
    const reviews = await Review.find({ productId: { $in: productIds } })
      .populate('userId', 'firstName lastName')
      .populate('productId', 'name')
      .sort({ createdAt: -1 })
      .limit(5)

    // Calculate average rating
    const averageRating = reviews.length > 0 
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
      : 0

    return res.status(200).json({
      stats: {
        totalProducts,
        activeProducts,
        totalOrders,
        pendingOrders,
        processingOrders,
        totalSales,
        averageRating: Math.round(averageRating * 10) / 10,
        totalReviews: reviews.length
      },
      recentOrders: recentOrders.map(order => ({
        orderNumber: order.orderNumber,
        customer: order.userId,
        status: order.status,
        total: order.total,
        createdAt: order.createdAt
      })),
      recentReviews: reviews.map(review => ({
        id: review._id,
        rating: review.rating,
        comment: review.comment,
        customer: review.userId,
        product: review.productId,
        createdAt: review.createdAt
      }))
    })
  } catch (error) {
    console.error('Merchant dashboard error:', error)
    return res.status(500).json({ 
      error: 'Failed to fetch dashboard data',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
