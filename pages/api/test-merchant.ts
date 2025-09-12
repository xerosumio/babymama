import { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '@/lib/mongodb'
import Merchant from '@/models/Merchant'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    await dbConnect()

    const merchant = await Merchant.findOne({ email: 'info@organicbaby.com' }).select('+password')
    
    return res.status(200).json({
      merchant: {
        name: merchant?.name,
        email: merchant?.email,
        hasPassword: !!merchant?.password,
        passwordLength: merchant?.password?.length || 0,
        passwordPreview: merchant?.password ? merchant.password.substring(0, 20) + '...' : 'NO PASSWORD'
      }
    })
  } catch (error) {
    console.error('Test merchant error:', error)
    return res.status(500).json({ 
      error: 'Test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
