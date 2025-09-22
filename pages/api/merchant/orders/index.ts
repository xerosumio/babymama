import { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '@/lib/mongodb'
import Order from '@/models/Order'
import { verifyMerchantToken } from '@/lib/auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect()

  try {
    switch (req.method) {
      case 'GET':
        return await getMerchantOrders(req, res)
      default:
        res.setHeader('Allow', ['GET'])
        return res.status(405).json({ error: 'Method not allowed' })
    }
  } catch (error) {
    console.error('API Error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

async function getMerchantOrders(req: NextApiRequest, res: NextApiResponse) {
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

    const { 
      page = 1, 
      limit = 20, 
      status,
      sort = 'createdAt',
      order = 'desc' 
    } = req.query

    // Build query for orders containing items from this merchant
    const query: any = {
      'items.merchantId': decoded.merchantId
    }
    
    if (status && status !== 'all') {
      query.status = status
    }

    const sortOptions: any = {}
    sortOptions[sort as string] = order === 'asc' ? 1 : -1

    const orders = await Order.find(query)
      .populate('userId', 'firstName lastName email')
      .sort(sortOptions)
      .limit(Number(limit) * 1)
      .skip((Number(page) - 1) * Number(limit))

    const total = await Order.countDocuments(query)

    // Transform orders to include merchant-specific data
    const transformedOrders = orders.map(order => {
      const merchantItems = order.items.filter((item: any) => 
        item.merchantId.toString() === decoded.merchantId
      )
      
      const merchantTotal = merchantItems.reduce((sum: number, item: any) => sum + item.total, 0)
      
      return {
        _id: order._id,
        orderNumber: order.orderNumber,
        customer: order.userId ? {
          name: `${order.userId.firstName} ${order.userId.lastName}`,
          email: order.userId.email
        } : {
          name: 'Guest Customer',
          email: order.guestEmail || 'N/A'
        },
        status: order.status,
        paymentStatus: order.paymentStatus,
        total: merchantTotal,
        items: merchantItems,
        shippingAddress: order.shippingAddress,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt
      }
    })

    return res.status(200).json({
      orders: transformedOrders,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    })
  } catch (error) {
    console.error('Get merchant orders error:', error)
    return res.status(500).json({ error: 'Failed to fetch orders' })
  }
}
