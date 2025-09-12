import { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect()

  try {
    switch (req.method) {
      case 'GET':
        return await getUsers(req, res)
      case 'POST':
        return await createUser(req, res)
      default:
        res.setHeader('Allow', ['GET', 'POST'])
        return res.status(405).json({ error: 'Method not allowed' })
    }
  } catch (error) {
    console.error('API Error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

async function getUsers(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search,
      sort = 'createdAt',
      order = 'desc' 
    } = req.query

    const query: any = {}
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ]
    }

    const sortOptions: any = {}
    sortOptions[sort as string] = order === 'asc' ? 1 : -1

    const users = await User.find(query)
      .sort(sortOptions)
      .limit(Number(limit) * 1)
      .skip((Number(page) - 1) * Number(limit))
      .select('-password')

    const total = await User.countDocuments(query)

    return res.status(200).json({
      users,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    })
  } catch (error) {
    console.error('Get users error:', error)
    return res.status(500).json({ error: 'Failed to fetch users' })
  }
}

async function createUser(req: NextApiRequest, res: NextApiResponse) {
  try {
    const user = new User(req.body)
    await user.save()
    
    // Remove password from response
    const userResponse = user.toObject()
    delete userResponse.password
    
    return res.status(201).json(userResponse)
  } catch (error) {
    console.error('Create user error:', error)
    return res.status(400).json({ error: 'Failed to create user' })
  }
}
