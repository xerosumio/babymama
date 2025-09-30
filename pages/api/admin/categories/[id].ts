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

    const { id } = req.query

    switch (req.method) {
      case 'GET':
        return await getCategory(req, res, id as string)
      case 'PUT':
        return await updateCategory(req, res, id as string)
      case 'DELETE':
        return await deleteCategory(req, res, id as string)
      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
        return res.status(405).json({ error: 'Method not allowed' })
    }
  } catch (error) {
    console.error('Admin Category API Error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

async function getCategory(req: NextApiRequest, res: NextApiResponse, id: string) {
  try {
    const category = await Category.findById(id).populate('parentId', 'name slug')
    
    if (!category) {
      return res.status(404).json({ error: 'Category not found' })
    }

    return res.status(200).json(category)
  } catch (error) {
    console.error('Get category error:', error)
    return res.status(500).json({ error: 'Failed to fetch category' })
  }
}

async function updateCategory(req: NextApiRequest, res: NextApiResponse, id: string) {
  try {
    const { name, slug, parentId, image, isActive, sortOrder } = req.body

    const category = await Category.findById(id)
    if (!category) {
      return res.status(404).json({ error: 'Category not found' })
    }

    // Check if slug already exists (excluding current category)
    if (slug && slug !== category.slug) {
      const existingCategory = await Category.findOne({ slug, _id: { $ne: id } })
      if (existingCategory) {
        return res.status(400).json({ error: 'Category slug already exists' })
      }
    }

    // Validate parent category if provided
    if (parentId && parentId !== category.parentId?.toString()) {
      if (parentId === id) {
        return res.status(400).json({ error: 'Category cannot be its own parent' })
      }
      
      const parentCategory = await Category.findById(parentId)
      if (!parentCategory) {
        return res.status(400).json({ error: 'Parent category not found' })
      }

      // Check for circular reference
      let currentParent = parentCategory
      while (currentParent.parentId) {
        if (currentParent.parentId.toString() === id) {
          return res.status(400).json({ error: 'Circular reference detected' })
        }
        currentParent = await Category.findById(currentParent.parentId)
        if (!currentParent) break
      }
    }

    // Update category
    const updateData: any = {}
    if (name) updateData.name = name
    if (slug) updateData.slug = slug
    if (parentId !== undefined) updateData.parentId = parentId || null
    if (image !== undefined) updateData.image = image
    if (isActive !== undefined) updateData.isActive = isActive
    if (sortOrder !== undefined) updateData.sortOrder = sortOrder

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('parentId', 'name slug')

    return res.status(200).json(updatedCategory)
  } catch (error) {
    console.error('Update category error:', error)
    return res.status(400).json({ error: 'Failed to update category' })
  }
}

async function deleteCategory(req: NextApiRequest, res: NextApiResponse, id: string) {
  try {
    const category = await Category.findById(id)
    if (!category) {
      return res.status(404).json({ error: 'Category not found' })
    }

    // Check if category has children
    const childrenCount = await Category.countDocuments({ parentId: id })
    if (childrenCount > 0) {
      return res.status(400).json({ 
        error: 'Cannot delete category with children. Please delete or move children first.' 
      })
    }

    // Check if category is used by products
    // Note: This would require a Product model check in a real implementation
    // const productsCount = await Product.countDocuments({ categoryId: id })
    // if (productsCount > 0) {
    //   return res.status(400).json({ 
    //     error: 'Cannot delete category that is used by products' 
    //   })
    // }

    await Category.findByIdAndDelete(id)

    return res.status(200).json({ message: 'Category deleted successfully' })
  } catch (error) {
    console.error('Delete category error:', error)
    return res.status(500).json({ error: 'Failed to delete category' })
  }
}


