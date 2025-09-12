import { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '@/lib/mongodb'
import Product from '@/models/Product'
import Order from '@/models/Order'
import Review from '@/models/Review'
import User from '@/models/User'
import Merchant from '@/models/Merchant'
import Category from '@/models/Category'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    await dbConnect()

    // Get overall statistics
    const [
      totalUsers,
      totalMerchants,
      totalProducts,
      totalOrders,
      totalCategories,
      totalReviews
    ] = await Promise.all([
      User.countDocuments(),
      Merchant.countDocuments(),
      Product.countDocuments(),
      Order.countDocuments(),
      Category.countDocuments(),
      Review.countDocuments()
    ])

    // Get active merchants
    const activeMerchants = await Merchant.countDocuments({ isActive: true })

    // Get active products
    const activeProducts = await Product.countDocuments({ isActive: true })

    // Get orders by status
    const ordersByStatus = await Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ])

    // Get total sales
    const totalSales = await Order.aggregate([
      { $group: { _id: null, total: { $sum: '$total' } } }
    ])

    // Get recent orders
    const recentOrders = await Order.find()
      .populate('userId', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .limit(10)

    // Get recent merchants
    const recentMerchants = await Merchant.find()
      .sort({ createdAt: -1 })
      .limit(5)

    // Get top selling products
    const topProducts = await Product.aggregate([
      { $lookup: { from: 'orders', localField: '_id', foreignField: 'items.productId', as: 'orders' } },
      { $unwind: { path: '$orders', preserveNullAndEmptyArrays: true } },
      { $unwind: { path: '$orders.items', preserveNullAndEmptyArrays: true } },
      { $match: { 'orders.items.productId': { $exists: true } } },
      { $group: { _id: '$_id', name: { $first: '$name' }, totalSold: { $sum: '$orders.items.quantity' } } },
      { $sort: { totalSold: -1 } },
      { $limit: 5 }
    ])

    // Get sales by month (last 6 months)
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

    const salesByMonth = await Order.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          total: { $sum: '$total' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ])

    return res.status(200).json({
      stats: {
        totalUsers,
        totalMerchants,
        activeMerchants,
        totalProducts,
        activeProducts,
        totalOrders,
        totalCategories,
        totalReviews,
        totalSales: totalSales[0]?.total || 0
      },
      ordersByStatus: ordersByStatus.reduce((acc, item) => {
        acc[item._id] = item.count
        return acc
      }, {}),
      recentOrders: recentOrders.map(order => ({
        orderNumber: order.orderNumber,
        customer: order.userId,
        status: order.status,
        total: order.total,
        createdAt: order.createdAt
      })),
      recentMerchants: recentMerchants.map(merchant => ({
        id: merchant._id,
        name: merchant.name,
        email: merchant.email,
        isActive: merchant.isActive,
        createdAt: merchant.createdAt
      })),
      topProducts,
      salesByMonth
    })
  } catch (error) {
    console.error('Admin dashboard error:', error)
    return res.status(500).json({ 
      error: 'Failed to fetch dashboard data',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
