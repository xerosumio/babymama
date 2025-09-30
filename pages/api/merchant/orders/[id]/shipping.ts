import { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '@/lib/mongodb'
import Order from '@/models/Order'
import { verifyMerchantToken } from '@/lib/auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect()

  try {
    switch (req.method) {
      case 'PUT':
        return await updateShippingInfo(req, res)
      case 'GET':
        return await getShippingInfo(req, res)
      default:
        res.setHeader('Allow', ['GET', 'PUT'])
        return res.status(405).json({ error: 'Method not allowed' })
    }
  } catch (error) {
    console.error('API Error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

async function updateShippingInfo(req: NextApiRequest, res: NextApiResponse) {
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

    const { id } = req.query
    const { trackingNumber, carrier, status, notes } = req.body

    // Find order and verify it belongs to this merchant
    const order = await Order.findOne({
      _id: id,
      'items.merchantId': decoded.merchantId
    })

    if (!order) {
      return res.status(404).json({ error: 'Order not found or access denied' })
    }

    // Update shipping information
    const updateData: any = {}
    
    if (trackingNumber) updateData.trackingNumber = trackingNumber
    if (carrier) updateData.carrier = carrier
    if (status) updateData.status = status
    if (notes) updateData.notes = notes

    // If tracking number is provided, update status to shipped
    if (trackingNumber && !status) {
      updateData.status = 'shipped'
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    ).populate('userId', 'firstName lastName email')

    return res.status(200).json({
      message: 'Shipping information updated successfully',
      order: {
        _id: updatedOrder._id,
        orderNumber: updatedOrder.orderNumber,
        status: updatedOrder.status,
        trackingNumber: updatedOrder.trackingNumber,
        carrier: updatedOrder.carrier,
        notes: updatedOrder.notes,
        customer: updatedOrder.userId ? {
          name: `${updatedOrder.userId.firstName} ${updatedOrder.userId.lastName}`,
          email: updatedOrder.userId.email
        } : null,
        shippingAddress: updatedOrder.shippingAddress,
        updatedAt: updatedOrder.updatedAt
      }
    })
  } catch (error) {
    console.error('Update shipping info error:', error)
    return res.status(500).json({ error: 'Failed to update shipping information' })
  }
}

async function getShippingInfo(req: NextApiRequest, res: NextApiResponse) {
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

    const { id } = req.query

    // Find order and verify it belongs to this merchant
    const order = await Order.findOne({
      _id: id,
      'items.merchantId': decoded.merchantId
    }).populate('userId', 'firstName lastName email')

    if (!order) {
      return res.status(404).json({ error: 'Order not found or access denied' })
    }

    return res.status(200).json({
      order: {
        _id: order._id,
        orderNumber: order.orderNumber,
        status: order.status,
        trackingNumber: order.trackingNumber,
        carrier: order.carrier,
        notes: order.notes,
        customer: order.userId ? {
          name: `${order.userId.firstName} ${order.userId.lastName}`,
          email: order.userId.email
        } : null,
        shippingAddress: order.shippingAddress,
        items: order.items.filter((item: any) => 
          item.merchantId.toString() === decoded.merchantId
        ),
        createdAt: order.createdAt,
        updatedAt: order.updatedAt
      }
    })
  } catch (error) {
    console.error('Get shipping info error:', error)
    return res.status(500).json({ error: 'Failed to get shipping information' })
  }
}
