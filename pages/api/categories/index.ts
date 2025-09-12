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
        return await createCategory(req, res)
      default:
        res.setHeader('Allow', ['GET', 'POST'])
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
    
    const query: any = {}
    if (parent) {
      query.parentId = parent === 'null' ? null : parent
    }

    const categories = await Category.find(query)
      .populate('parentId', 'name slug')
      .sort({ name: 1 })

    return res.status(200).json(categories)
  } catch (error) {
    console.error('Get categories error:', error)
    return res.status(500).json({ error: 'Failed to fetch categories' })
  }
}

async function createCategory(req: NextApiRequest, res: NextApiResponse) {
  try {
    const category = new Category(req.body)
    await category.save()
    
    return res.status(201).json(category)
  } catch (error) {
    console.error('Create category error:', error)
    return res.status(400).json({ error: 'Failed to create category' })
  }
}
