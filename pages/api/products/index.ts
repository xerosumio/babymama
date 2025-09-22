import { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '@/lib/mongodb'
import Product from '@/models/Product'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect()

  try {
    switch (req.method) {
      case 'GET':
        return await getProducts(req, res)
      case 'POST':
        return await createProduct(req, res)
      default:
        res.setHeader('Allow', ['GET', 'POST'])
        return res.status(405).json({ error: 'Method not allowed' })
    }
  } catch (error) {
    console.error('API Error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

async function getProducts(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { 
      page = 1, 
      limit = 12, 
      category, 
      search, 
      sort = 'createdAt',
      order = 'desc' 
    } = req.query

    const query: any = {
      status: 'approved', // 只显示已审核的商品
      isActive: true // 只显示激活的商品
    }
    
    if (category) {
      query['categoryId'] = category
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { 'category.name': { $regex: search, $options: 'i' } }
      ]
    }

    const sortOptions: any = {}
    sortOptions[sort as string] = order === 'asc' ? 1 : -1

    const products = await Product.find(query)
      .sort(sortOptions)
      .limit(Number(limit) * 1)
      .skip((Number(page) - 1) * Number(limit))

    const total = await Product.countDocuments(query)

    return res.status(200).json({
      products,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    })
  } catch (error) {
    console.error('Get products error:', error)
    return res.status(500).json({ error: 'Failed to fetch products' })
  }
}

async function createProduct(req: NextApiRequest, res: NextApiResponse) {
  try {
    // 确保新商品默认为pending状态，需要审核
    const productData = {
      ...req.body,
      status: 'pending',
      isActive: false // 新商品默认不激活，需要审核通过后才能激活
    }
    
    const product = new Product(productData)
    const savedProduct = await product.save()
    
    return res.status(201).json(savedProduct)
  } catch (error) {
    console.error('Create product error:', error)
    return res.status(400).json({ error: 'Failed to create product' })
  }
}
