import { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '@/lib/mongodb'
import Order from '@/models/Order'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect()

  const { id } = req.query

  try {
    switch (req.method) {
      case 'GET':
        return await getOrder(req, res, id as string)
      case 'PUT':
        return await updateOrder(req, res, id as string)
      case 'DELETE':
        return await deleteOrder(req, res, id as string)
      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
        return res.status(405).json({ error: 'Method not allowed' })
    }
  } catch (error) {
    console.error('API Error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

async function getOrder(req: NextApiRequest, res: NextApiResponse, id: string) {
  try {
    const order = await Order.findById(id)
      .populate('user', 'name email phone')
      .populate('items.product', 'name price image description')
      .populate('items.merchant', 'name email phone')

    if (!order) {
      return res.status(404).json({ error: 'Order not found' })
    }

    return res.status(200).json(order)
  } catch (error) {
    console.error('Get order error:', error)
    return res.status(500).json({ error: 'Failed to fetch order' })
  }
}

async function updateOrder(req: NextApiRequest, res: NextApiResponse, id: string) {
  try {
    const { status, trackingNumber, notes } = req.body

    const updateData: any = {}
    if (status) updateData.status = status
    if (trackingNumber) updateData.trackingNumber = trackingNumber
    if (notes) updateData.notes = notes

    const order = await Order.findByIdAndUpdate(id, updateData, { 
      new: true, 
      runValidators: true 
    })
      .populate('user', 'name email phone')
      .populate('items.product', 'name price image')
      .populate('items.merchant', 'name email')

    if (!order) {
      return res.status(404).json({ error: 'Order not found' })
    }

    return res.status(200).json(order)
  } catch (error) {
    console.error('Update order error:', error)
    return res.status(400).json({ error: 'Failed to update order' })
  }
}

async function deleteOrder(req: NextApiRequest, res: NextApiResponse, id: string) {
  try {
    const order = await Order.findByIdAndDelete(id)

    if (!order) {
      return res.status(404).json({ error: 'Order not found' })
    }

    return res.status(200).json({ message: 'Order deleted successfully' })
  } catch (error) {
    console.error('Delete order error:', error)
    return res.status(500).json({ error: 'Failed to delete order' })
  }
}
