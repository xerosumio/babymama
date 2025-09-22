import { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '@/lib/mongodb'
import Product from '@/models/Product'
import { verifyAdminToken } from '@/lib/auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect()

  try {
    // 验证管理员权限
    const token = req.headers.authorization?.replace('Bearer ', '')
    if (!token) {
      return res.status(401).json({ error: 'No token provided' })
    }

    try {
      await verifyAdminToken(token)
    } catch (error) {
      return res.status(401).json({ error: 'Invalid token' })
    }

    switch (req.method) {
      case 'GET':
        return await getProducts(req, res)
      default:
        res.setHeader('Allow', ['GET'])
        return res.status(405).json({ error: 'Method not allowed' })
    }
  } catch (error) {
    console.error('API Error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

async function getProducts(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { 
      page = 1, 
      limit = 20, 
      status, 
      merchantId,
      search,
      sort = 'createdAt',
      order = 'desc' 
    } = req.query

    const query: any = {}
    
    if (status) {
      query.status = status
    }
    
    if (merchantId) {
      query.merchantId = merchantId
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { 'merchantId.name': { $regex: search, $options: 'i' } }
      ]
    }

    const sortOptions: any = {}
    sortOptions[sort as string] = order === 'asc' ? 1 : -1

    const products = await Product.find(query)
      .sort(sortOptions)
      .limit(Number(limit) * 1)
      .skip((Number(page) - 1) * Number(limit))
      .populate('categoryId', 'name slug')
      .populate('merchantId', 'name email status')
      .populate('reviewedBy', 'firstName lastName email')

    const total = await Product.countDocuments(query)

    // 统计各状态商品数量
    const stats = await Product.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ])

    const statusStats = {
      pending: 0,
      approved: 0,
      rejected: 0,
      active: 0,
      inactive: 0,
      draft: 0
    }

    stats.forEach(stat => {
      statusStats[stat._id as keyof typeof statusStats] = stat.count
    })

    return res.status(200).json({
      products,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      },
      stats: statusStats
    })
  } catch (error) {
    console.error('Get products error:', error)
    return res.status(500).json({ error: 'Failed to fetch products' })
  }
}
