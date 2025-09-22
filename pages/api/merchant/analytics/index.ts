import { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '@/lib/mongodb'
import Order from '@/models/Order'
import Product from '@/models/Product'
import Review from '@/models/Review'
import { verifyMerchantToken } from '@/lib/auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect()

  try {
    switch (req.method) {
      case 'GET':
        return await getMerchantAnalytics(req, res)
      default:
        res.setHeader('Allow', ['GET'])
        return res.status(405).json({ error: 'Method not allowed' })
    }
  } catch (error) {
    console.error('API Error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

async function getMerchantAnalytics(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Verify merchant authentication
    const token = req.headers.authorization?.replace('Bearer ', '')
    if (!token) {
      return res.status(401).json({ error: 'No token provided' })
    }

    const decoded = verifyMerchantToken(token)
    if (!decoded) {
      return res.status(401).json({ error: 'Invalid token' })
    }

    const { period = '30d' } = req.query

    // Calculate date range
    const now = new Date()
    let startDate = new Date()
    
    switch (period) {
      case '7d':
        startDate.setDate(now.getDate() - 7)
        break
      case '30d':
        startDate.setDate(now.getDate() - 30)
        break
      case '90d':
        startDate.setDate(now.getDate() - 90)
        break
      case '1y':
        startDate.setFullYear(now.getFullYear() - 1)
        break
      default:
        startDate.setDate(now.getDate() - 30)
    }

    // Get merchant's products
    const products = await Product.find({ merchantId: decoded.merchantId })
    const productIds = products.map(p => p._id)

    // Get orders for this merchant
    const orders = await Order.find({
      'items.merchantId': decoded.merchantId,
      createdAt: { $gte: startDate }
    }).populate('userId', 'firstName lastName email')

    // Calculate revenue data
    const totalRevenue = orders.reduce((sum, order) => {
      const merchantItems = order.items.filter((item: any) => 
        item.merchantId.toString() === decoded.merchantId
      )
      return sum + merchantItems.reduce((itemSum: number, item: any) => itemSum + item.total, 0)
    }, 0)

    // Get previous period for comparison
    const previousStartDate = new Date(startDate)
    const previousEndDate = new Date(startDate)
    previousStartDate.setDate(previousStartDate.getDate() - (now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))

    const previousOrders = await Order.find({
      'items.merchantId': decoded.merchantId,
      createdAt: { $gte: previousStartDate, $lt: startDate }
    })

    const previousRevenue = previousOrders.reduce((sum, order) => {
      const merchantItems = order.items.filter((item: any) => 
        item.merchantId.toString() === decoded.merchantId
      )
      return sum + merchantItems.reduce((itemSum: number, item: any) => itemSum + item.total, 0)
    }, 0)

    const revenueChange = previousRevenue > 0 
      ? ((totalRevenue - previousRevenue) / previousRevenue) * 100 
      : 0

    // Generate daily revenue data
    const dailyRevenue = []
    for (let d = new Date(startDate); d <= now; d.setDate(d.getDate() + 1)) {
      const dayOrders = orders.filter(order => {
        const orderDate = new Date(order.createdAt)
        return orderDate.toDateString() === d.toDateString()
      })
      
      const dayRevenue = dayOrders.reduce((sum, order) => {
        const merchantItems = order.items.filter((item: any) => 
          item.merchantId.toString() === decoded.merchantId
        )
        return sum + merchantItems.reduce((itemSum: number, item: any) => itemSum + item.total, 0)
      }, 0)

      dailyRevenue.push({
        date: d.toISOString().split('T')[0],
        revenue: dayRevenue
      })
    }

    // Get product performance
    const productPerformance = await Promise.all(products.map(async (product) => {
      const productOrders = orders.filter(order => 
        order.items.some((item: any) => item.productId.toString() === product._id.toString())
      )
      
      const productRevenue = productOrders.reduce((sum, order) => {
        const productItems = order.items.filter((item: any) => 
          item.productId.toString() === product._id.toString() && 
          item.merchantId.toString() === decoded.merchantId
        )
        return sum + productItems.reduce((itemSum: number, item: any) => itemSum + item.total, 0)
      }, 0)

      const productReviews = await Review.find({ productId: product._id })
      const averageRating = productReviews.length > 0 
        ? productReviews.reduce((sum, review) => sum + review.rating, 0) / productReviews.length 
        : 0

      return {
        id: product._id,
        name: product.name.en,
        revenue: productRevenue,
        orders: productOrders.length,
        rating: Math.round(averageRating * 10) / 10,
        reviews: productReviews.length,
        status: product.status,
        isActive: product.isActive
      }
    }))

    // Sort by revenue
    productPerformance.sort((a, b) => b.revenue - a.revenue)

    // Get customer data
    const uniqueCustomers = new Set(orders.map(order => order.userId?._id?.toString()).filter(Boolean))
    const newCustomers = orders.filter(order => {
      const orderDate = new Date(order.createdAt)
      const customerFirstOrder = orders.find(o => 
        o.userId?._id?.toString() === order.userId?._id?.toString()
      )
      return customerFirstOrder && new Date(customerFirstOrder.createdAt).toDateString() === orderDate.toDateString()
    })

    // Get reviews for merchant's products
    const reviews = await Review.find({ productId: { $in: productIds } })
      .populate('userId', 'firstName lastName')
      .populate('productId', 'name')
      .sort({ createdAt: -1 })
      .limit(10)

    const averageRating = reviews.length > 0 
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
      : 0

    return res.status(200).json({
      period,
      revenue: {
        total: totalRevenue,
        change: revenueChange,
        changeType: revenueChange >= 0 ? 'up' : 'down',
        daily: dailyRevenue
      },
      orders: {
        total: orders.length,
        change: 0, // Could calculate previous period comparison
        changeType: 'up' as const,
        daily: dailyRevenue.map(day => ({
          date: day.date,
          value: orders.filter(order => {
            const orderDate = new Date(order.createdAt)
            return orderDate.toDateString() === new Date(day.date).toDateString()
          }).length
        }))
      },
      products: {
        total: products.length,
        active: products.filter(p => p.isActive).length,
        lowStock: products.filter(p => (p.variants?.[0]?.inventory || 0) <= 10).length,
        topSelling: productPerformance.slice(0, 10).map(p => ({
          name: p.name,
          sales: p.orders,
          revenue: p.revenue,
          views: 0 // Could add view tracking
        }))
      },
      customers: {
        total: uniqueCustomers.size,
        new: newCustomers.length,
        returning: uniqueCustomers.size - newCustomers.length
      },
      reviews: {
        total: reviews.length,
        average: Math.round(averageRating * 10) / 10,
        recent: reviews.map(review => ({
          id: review._id,
          rating: review.rating,
          comment: review.comment,
          customer: review.userId,
          product: review.productId,
          createdAt: review.createdAt
        }))
      }
    })
  } catch (error) {
    console.error('Get merchant analytics error:', error)
    return res.status(500).json({ error: 'Failed to fetch analytics data' })
  }
}
