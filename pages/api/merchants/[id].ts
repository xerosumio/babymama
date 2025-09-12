import { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '@/lib/mongodb'
import Merchant from '@/models/Merchant'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect()

  const { id } = req.query

  try {
    switch (req.method) {
      case 'GET':
        return await getMerchant(req, res, id as string)
      case 'PUT':
        return await updateMerchant(req, res, id as string)
      case 'DELETE':
        return await deleteMerchant(req, res, id as string)
      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
        return res.status(405).json({ error: 'Method not allowed' })
    }
  } catch (error) {
    console.error('API Error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

async function getMerchant(req: NextApiRequest, res: NextApiResponse, id: string) {
  try {
    const merchant = await Merchant.findById(id).select('-password')

    if (!merchant) {
      return res.status(404).json({ error: 'Merchant not found' })
    }

    return res.status(200).json(merchant)
  } catch (error) {
    console.error('Get merchant error:', error)
    return res.status(500).json({ error: 'Failed to fetch merchant' })
  }
}

async function updateMerchant(req: NextApiRequest, res: NextApiResponse, id: string) {
  try {
    const updateData = { ...req.body }
    
    // Don't allow password updates through this endpoint
    delete updateData.password

    const merchant = await Merchant.findByIdAndUpdate(id, updateData, { 
      new: true, 
      runValidators: true 
    }).select('-password')

    if (!merchant) {
      return res.status(404).json({ error: 'Merchant not found' })
    }

    return res.status(200).json(merchant)
  } catch (error) {
    console.error('Update merchant error:', error)
    return res.status(400).json({ error: 'Failed to update merchant' })
  }
}

async function deleteMerchant(req: NextApiRequest, res: NextApiResponse, id: string) {
  try {
    const merchant = await Merchant.findByIdAndDelete(id)

    if (!merchant) {
      return res.status(404).json({ error: 'Merchant not found' })
    }

    return res.status(200).json({ message: 'Merchant deleted successfully' })
  } catch (error) {
    console.error('Delete merchant error:', error)
    return res.status(500).json({ error: 'Failed to delete merchant' })
  }
}
