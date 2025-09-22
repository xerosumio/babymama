import { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '@/lib/mongodb'
import Category from '@/models/Category'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect()

  try {
    switch (req.method) {
      case 'GET':
        return await getCategories(req, res)
      case 'POST':
        // Only allow GET for public API - POST should go through admin API
        return res.status(403).json({ error: 'Category creation is only available through admin API' })
      default:
        res.setHeader('Allow', ['GET'])
        return res.status(405).json({ error: 'Method not allowed' })
    }
  } catch (error) {
    console.error('API Error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

async function getCategories(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { parent } = req.query
    
    const query: any = { isActive: true } // Only return active categories for public API
    if (parent) {
      query.parentId = parent === 'null' ? null : parent
    }

    const categories = await Category.find(query)
      .populate('parentId', 'name slug')
      .sort({ sortOrder: 1, name: 1 })

    return res.status(200).json(categories)
  } catch (error) {
    console.error('Get categories error:', error)
    return res.status(500).json({ error: 'Failed to fetch categories' })
  }
}
