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

    const { id } = req.query

    if (!id) {
      return res.status(400).json({ error: 'Product ID is required' })
    }

    switch (req.method) {
      case 'GET':
        return await getProduct(req, res, id as string)
      case 'PUT':
        return await updateProduct(req, res, id as string)
      case 'DELETE':
        return await deleteProduct(req, res, id as string)
      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
        return res.status(405).json({ error: 'Method not allowed' })
    }
  } catch (error) {
    console.error('API Error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

async function getProduct(req: NextApiRequest, res: NextApiResponse, id: string) {
  try {
    const product = await Product.findById(id)
      .populate('categoryId', 'name slug')
      .populate('merchantId', 'name email status')
      .populate('reviewedBy', 'firstName lastName email')

    if (!product) {
      return res.status(404).json({ error: 'Product not found' })
    }

    return res.status(200).json(product)
  } catch (error) {
    console.error('Get product error:', error)
    return res.status(500).json({ error: 'Failed to fetch product' })
  }
}

async function updateProduct(req: NextApiRequest, res: NextApiResponse, id: string) {
  try {
    const { status, reviewNotes, isActive, isFeatured, isNew } = req.body

    const updateData: any = {}
    
    if (status) {
      updateData.status = status
      updateData.reviewedAt = new Date()
      updateData.reviewedBy = req.body.reviewedBy // 从token中获取管理员ID
    }
    
    if (reviewNotes !== undefined) {
      updateData.reviewNotes = reviewNotes
    }
    
    if (isActive !== undefined) {
      updateData.isActive = isActive
    }
    
    if (isFeatured !== undefined) {
      updateData.isFeatured = isFeatured
    }
    
    if (isNew !== undefined) {
      updateData.isNew = isNew
    }

    const product = await Product.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    )
      .populate('categoryId', 'name slug')
      .populate('merchantId', 'name email status')
      .populate('reviewedBy', 'firstName lastName email')

    if (!product) {
      return res.status(404).json({ error: 'Product not found' })
    }

    return res.status(200).json(product)
  } catch (error) {
    console.error('Update product error:', error)
    return res.status(500).json({ error: 'Failed to update product' })
  }
}

async function deleteProduct(req: NextApiRequest, res: NextApiResponse, id: string) {
  try {
    const product = await Product.findByIdAndDelete(id)

    if (!product) {
      return res.status(404).json({ error: 'Product not found' })
    }

    return res.status(200).json({ message: 'Product deleted successfully' })
  } catch (error) {
    console.error('Delete product error:', error)
    return res.status(500).json({ error: 'Failed to delete product' })
  }
}
