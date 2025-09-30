import { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '@/lib/mongodb'
import Category from '@/models/Category'
import { verifyAdminToken } from '@/lib/auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect()

  try {
    // Verify admin authentication
    const token = req.headers.authorization?.replace('Bearer ', '')
    if (!token) {
      return res.status(401).json({ error: 'No token provided' })
    }

    const adminUser = await verifyAdminToken(token)
    if (!adminUser) {
      return res.status(401).json({ error: 'Invalid or expired token' })
    }

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
    console.error('Admin Categories API Error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

async function getCategories(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { parent, status, search } = req.query
    
    const query: any = {}
    
    if (parent !== undefined) {
      query.parentId = parent === 'null' ? null : parent
    }
    
    if (status) {
      query.isActive = status === 'active'
    }
    
    if (search) {
      query.$or = [
        { 'name.en': { $regex: search, $options: 'i' } },
        { 'name.zh-HK': { $regex: search, $options: 'i' } },
        { slug: { $regex: search, $options: 'i' } }
      ]
    }

    const categories = await Category.find(query)
      .populate('parentId', 'name slug')
      .sort({ sortOrder: 1, name: 1 })

    // Build hierarchical structure
    const categoryMap = new Map()
    const rootCategories: any[] = []

    categories.forEach(category => {
      categoryMap.set(category._id.toString(), { ...category.toObject(), children: [] })
    })

    categories.forEach(category => {
      const categoryObj = categoryMap.get(category._id.toString())
      if (category.parentId) {
        const parent = categoryMap.get(category.parentId.toString())
        if (parent) {
          parent.children.push(categoryObj)
        }
      } else {
        rootCategories.push(categoryObj)
      }
    })

    return res.status(200).json(rootCategories)
  } catch (error) {
    console.error('Get categories error:', error)
    return res.status(500).json({ error: 'Failed to fetch categories' })
  }
}

async function createCategory(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { name, slug, parentId, image, isActive, sortOrder } = req.body

    // Validate required fields
    if (!name || !name.en || !name['zh-HK'] || !slug) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    // Check if slug already exists
    const existingCategory = await Category.findOne({ slug })
    if (existingCategory) {
      return res.status(400).json({ error: 'Category slug already exists' })
    }

    // Validate parent category if provided
    if (parentId) {
      const parentCategory = await Category.findById(parentId)
      if (!parentCategory) {
        return res.status(400).json({ error: 'Parent category not found' })
      }
    }

    const category = new Category({
      name,
      slug,
      parentId: parentId || null,
      image: image || null,
      isActive: isActive !== undefined ? isActive : true,
      sortOrder: sortOrder || 0
    })

    await category.save()
    
    return res.status(201).json(category)
  } catch (error) {
    console.error('Create category error:', error)
    return res.status(400).json({ error: 'Failed to create category' })
  }
}


