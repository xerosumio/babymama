import { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '@/lib/mongodb'
import Product from '@/models/Product'
import { verifyMerchantToken } from '@/lib/auth'
import mongoose from 'mongoose'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect()

  try {
    switch (req.method) {
      case 'GET':
        return await getMerchantProducts(req, res)
      default:
        res.setHeader('Allow', ['GET'])
        return res.status(405).json({ error: 'Method not allowed' })
    }
  } catch (error) {
    console.error('API Error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

async function getMerchantProducts(req: NextApiRequest, res: NextApiResponse) {
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

    const { 
      page = 1, 
      limit = 12, 
      search, 
      status,
      sort = 'createdAt',
      order = 'desc' 
    } = req.query

    const query: any = {
      merchantId: decoded.merchantId // Only get products for this merchant
    }
    
    if (search) {
      query.$or = [
        { 'name.en': { $regex: search, $options: 'i' } },
        { 'name.zh-HK': { $regex: search, $options: 'i' } },
        { 'description.en': { $regex: search, $options: 'i' } },
        { 'description.zh-HK': { $regex: search, $options: 'i' } }
      ]
    }

    if (status && status !== 'all') {
      query.status = status
    }

    const sortOptions: any = {}
    sortOptions[sort as string] = order === 'asc' ? 1 : -1

    const products = await Product.find(query)
      .sort(sortOptions)
      .limit(Number(limit) * 1)
      .skip((Number(page) - 1) * Number(limit))


    const total = await Product.countDocuments(query)

    // Transform products to include inventory from variants
    const transformedProducts = products.map(product => ({
      _id: product._id,
      name: product.name.en,
      price: product.price,
      comparePrice: product.compareAtPrice,
      category: product.categoryId?.name?.en || 'Unknown',
      subCategory: product.categoryId?.slug || '',
      images: product.images || [],
      inventory: {
        quantity: product.variants?.[0]?.inventory || 0,
        lowStockThreshold: 10 // Default threshold
      },
      status: product.status,
      featured: product.isFeatured,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt
    }))

    return res.status(200).json({
      products: transformedProducts,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    })
  } catch (error) {
    console.error('Get merchant products error:', error)
    return res.status(500).json({ error: 'Failed to fetch products' })
  }
}
