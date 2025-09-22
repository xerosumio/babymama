import { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '@/lib/mongodb'
import Product from '@/models/Product'
import { verifyMerchantToken } from '@/lib/auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect()

  try {
    switch (req.method) {
      case 'GET':
        return await getMerchantProduct(req, res)
      case 'PUT':
        return await updateMerchantProduct(req, res)
      case 'DELETE':
        return await deleteMerchantProduct(req, res)
      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
        return res.status(405).json({ error: 'Method not allowed' })
    }
  } catch (error) {
    console.error('API Error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

async function getMerchantProduct(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Verify merchant authentication
    const token = req.headers.authorization?.replace('Bearer ', '')
    if (!token) {
      return res.status(401).json({ error: 'No token provided' })
    }

    const decoded = verifyMerchantToken(token)
    if (!decoded) {
      return res.status(401).json({ error: 'Invalid token' })
    }

    const { id } = req.query

    const product = await Product.findOne({
      _id: id,
      merchantId: decoded.merchantId // Only allow access to own products
    })
    

    if (!product) {
      return res.status(404).json({ error: 'Product not found' })
    }

    return res.status(200).json(product)
  } catch (error) {
    console.error('Get merchant product error:', error)
    return res.status(500).json({ error: 'Failed to fetch product' })
  }
}

async function updateMerchantProduct(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Verify merchant authentication
    const token = req.headers.authorization?.replace('Bearer ', '')
    if (!token) {
      return res.status(401).json({ error: 'No token provided' })
    }

    const decoded = verifyMerchantToken(token)
    if (!decoded) {
      return res.status(401).json({ error: 'Invalid token' })
    }

    const { id } = req.query

    // Check if product exists and belongs to this merchant
    const existingProduct = await Product.findOne({
      _id: id,
      merchantId: decoded.merchantId
    })

    if (!existingProduct) {
      return res.status(404).json({ error: 'Product not found' })
    }

    // Update product
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        ...req.body,
        updatedAt: new Date()
      },
      { new: true }
    ).populate('categoryId', 'name slug')

    return res.status(200).json(updatedProduct)
  } catch (error) {
    console.error('Update merchant product error:', error)
    return res.status(500).json({ error: 'Failed to update product' })
  }
}

async function deleteMerchantProduct(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Verify merchant authentication
    const token = req.headers.authorization?.replace('Bearer ', '')
    if (!token) {
      return res.status(401).json({ error: 'No token provided' })
    }

    const decoded = verifyMerchantToken(token)
    if (!decoded) {
      return res.status(401).json({ error: 'Invalid token' })
    }

    const { id } = req.query

    // Check if product exists and belongs to this merchant
    const existingProduct = await Product.findOne({
      _id: id,
      merchantId: decoded.merchantId
    })

    if (!existingProduct) {
      return res.status(404).json({ error: 'Product not found' })
    }

    // Delete product
    await Product.findByIdAndDelete(id)

    return res.status(200).json({ message: 'Product deleted successfully' })
  } catch (error) {
    console.error('Delete merchant product error:', error)
    return res.status(500).json({ error: 'Failed to delete product' })
  }
}
