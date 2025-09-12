import { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '@/lib/mongodb'
import Merchant from '@/models/Merchant'

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
    const { 
      page = 1, 
      limit = 10, 
      status, 
      search,
      sort = 'createdAt',
      order = 'desc' 
    } = req.query

    const query: any = {}
    
    if (status) {
      query.status = status
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { businessName: { $regex: search, $options: 'i' } }
      ]
    }

    const sortOptions: any = {}
    sortOptions[sort as string] = order === 'asc' ? 1 : -1

    const merchants = await Merchant.find(query)
      .sort(sortOptions)
      .limit(Number(limit) * 1)
      .skip((Number(page) - 1) * Number(limit))
      .select('-password')

    const total = await Merchant.countDocuments(query)

    return res.status(200).json({
      merchants,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    })
  } catch (error) {
    console.error('Get merchants error:', error)
    return res.status(500).json({ error: 'Failed to fetch merchants' })
  }
}

async function createMerchant(req: NextApiRequest, res: NextApiResponse) {
  try {
    const merchant = new Merchant(req.body)
    await merchant.save()
    
    // Remove password from response
    const merchantResponse = merchant.toObject()
    delete merchantResponse.password
    
    return res.status(201).json(merchantResponse)
  } catch (error) {
    console.error('Create merchant error:', error)
    return res.status(400).json({ error: 'Failed to create merchant' })
  }
}
