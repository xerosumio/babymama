import { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '@/lib/mongodb'
import Product from '@/models/Product'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect()

  const { id } = req.query

  try {
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
      .populate('category', 'name slug')
      .populate('merchant', 'name email')
      .populate('reviews.user', 'name email')

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
    const product = await Product.findByIdAndUpdate(id, req.body, { 
      new: true, 
      runValidators: true 
    })
      .populate('category', 'name slug')
      .populate('merchant', 'name email')

    if (!product) {
      return res.status(404).json({ error: 'Product not found' })
    }

    return res.status(200).json(product)
  } catch (error) {
    console.error('Update product error:', error)
    return res.status(400).json({ error: 'Failed to update product' })
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
