import { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '@/lib/mongodb'
import Order from '@/models/Order'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect()

  try {
    switch (req.method) {
      case 'GET':
        return await getTrackingInfo(req, res)
      default:
        res.setHeader('Allow', ['GET'])
        return res.status(405).json({ error: 'Method not allowed' })
    }
  } catch (error) {
    console.error('API Error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

async function getTrackingInfo(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query
    const { trackingNumber } = req.query

    let order

    // If tracking number is provided, search by tracking number
    if (trackingNumber) {
      order = await Order.findOne({
        trackingNumber: trackingNumber
      }).populate('userId', 'firstName lastName email')
    } else {
      // Otherwise search by order ID
      order = await Order.findById(id).populate('userId', 'firstName lastName email')
    }

    if (!order) {
      return res.status(404).json({ error: 'Order not found' })
    }

    // Don't return sensitive information for public tracking
    return res.status(200).json({
      order: {
        orderNumber: order.orderNumber,
        status: order.status,
        trackingNumber: order.trackingNumber,
        carrier: order.carrier,
        shippingAddress: {
          city: order.shippingAddress.city,
          state: order.shippingAddress.state,
          country: order.shippingAddress.country
        },
        estimatedDelivery: order.status === 'shipped' ? 
          new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : // 3 days from now
          null,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt
      }
    })
  } catch (error) {
    console.error('Get tracking info error:', error)
    return res.status(500).json({ error: 'Failed to get tracking information' })
  }
}
