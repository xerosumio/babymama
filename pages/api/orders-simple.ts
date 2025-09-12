import { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '@/lib/mongodb'
import Order from '@/models/Order'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    await dbConnect()

    const { 
      page = 1, 
      limit = 10, 
      status, 
      userId,
      sort = 'createdAt',
      order = 'desc' 
    } = req.query

    const query: any = {}
    
    if (status) {
      query.status = status
    }
    
    if (userId) {
      query.userId = userId
    }

    const sortOptions: any = {}
    sortOptions[sort as string] = order === 'asc' ? 1 : -1

    const orders = await Order.find(query)
      .sort(sortOptions)
      .limit(Number(limit) * 1)
      .skip((Number(page) - 1) * Number(limit))
      .populate('userId', 'firstName lastName email')

    const total = await Order.countDocuments(query)

    return res.status(200).json({
      orders,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    })
  } catch (error) {
    console.error('Get orders error:', error)
    return res.status(500).json({ error: 'Failed to fetch orders' })
  }
}
