import { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '@/lib/mongodb'
import Merchant from '@/models/Merchant'
import { verifyAdminToken } from '@/lib/auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect()

  try {
    switch (req.method) {
      case 'GET':
        return await getMerchants(req, res)
      case 'POST':
        return await createMerchant(req, res)
      default:
        res.setHeader('Allow', ['GET', 'POST'])
        return res.status(405).json({ error: 'Method not allowed' })
    }
  } catch (error) {
    console.error('API Error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

async function getMerchants(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Verify admin token
    const token = req.headers.authorization?.replace('Bearer ', '')
    if (!token) {
      return res.status(401).json({ error: 'No token provided' })
    }

    const admin = await verifyAdminToken(token)
    if (!admin) {
      return res.status(401).json({ error: 'Invalid token' })
    }

    const { 
      page = 1, 
      limit = 10, 
      status, 
      search 
    } = req.query

    const query: any = {}
    
    if (status && status !== 'all') {
      query.status = status
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { contactPerson: { $regex: search, $options: 'i' } }
      ]
    }

    const merchants = await Merchant.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(Number(limit) * 1)
      .skip((Number(page) - 1) * Number(limit))

    const total = await Merchant.countDocuments(query)

    // Calculate stats
    const stats = {
      total: await Merchant.countDocuments(),
      active: await Merchant.countDocuments({ status: 'active' }),
      pending: await Merchant.countDocuments({ status: 'pending' }),
      suspended: await Merchant.countDocuments({ status: 'suspended' }),
      inactive: await Merchant.countDocuments({ status: 'inactive' })
    }

    return res.status(200).json({
      merchants,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      },
      stats
    })
  } catch (error) {
    console.error('Get merchants error:', error)
    return res.status(500).json({ error: 'Failed to fetch merchants' })
  }
}

async function createMerchant(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Verify admin token
    const token = req.headers.authorization?.replace('Bearer ', '')
    if (!token) {
      return res.status(401).json({ error: 'No token provided' })
    }

    const admin = await verifyAdminToken(token)
    if (!admin) {
      return res.status(401).json({ error: 'Invalid token' })
    }

    const merchant = new Merchant(req.body)
    await merchant.save()
    
    return res.status(201).json(merchant)
  } catch (error) {
    console.error('Create merchant error:', error)
    return res.status(400).json({ error: 'Failed to create merchant' })
  }
}
