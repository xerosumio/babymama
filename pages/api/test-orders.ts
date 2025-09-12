import { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '@/lib/mongodb'
import Order from '@/models/Order'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    await dbConnect()

    console.log('Testing orders...')
    
    // Simple query without populate
    const orders = await Order.find({}).limit(2)
    console.log('Found orders:', orders.length)

    // Test with populate
    const ordersWithPopulate = await Order.find({})
      .populate('userId', 'firstName lastName email')
      .limit(2)
    console.log('Found orders with populate:', ordersWithPopulate.length)

    return res.status(200).json({
      message: 'Order test completed',
      simpleCount: orders.length,
      populatedCount: ordersWithPopulate.length,
      orders: orders.map(order => ({
        orderNumber: order.orderNumber,
        status: order.status,
        total: order.total,
        itemsCount: order.items.length
      }))
    })
  } catch (error) {
    console.error('Order test error:', error)
    return res.status(500).json({ 
      error: 'Order test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
