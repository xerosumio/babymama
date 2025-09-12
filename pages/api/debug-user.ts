import { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    await dbConnect()

    const user = await User.findOne({ email: 'john@example.com' }).select('+password')
    
    return res.status(200).json({
      user: {
        email: user?.email,
        hasPassword: !!user?.password,
        passwordLength: user?.password?.length || 0,
        passwordType: typeof user?.password
      }
    })
  } catch (error) {
    console.error('Debug error:', error)
    return res.status(500).json({ 
      error: 'Debug failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
