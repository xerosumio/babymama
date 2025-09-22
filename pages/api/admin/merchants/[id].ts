import { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '@/lib/mongodb'
import Merchant from '@/models/Merchant'
import { verifyAdminToken } from '@/lib/auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect()

  try {
    // Verify admin token
    const token = req.headers.authorization?.replace('Bearer ', '')
    if (!token) {
      return res.status(401).json({ error: 'No token provided' })
    }

    const admin = await verifyAdminToken(token)
    if (!admin) {
      return res.status(401).json({ error: 'Invalid token' })
    }

    const { id } = req.query

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
    const { status, isActive, commissionRate, ...updateData } = req.body

    const merchant = await Merchant.findById(id)
    
    if (!merchant) {
      return res.status(404).json({ error: 'Merchant not found' })
    }

    // Update merchant data
    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined) {
        merchant[key] = updateData[key]
      }
    })

    // Handle status changes
    if (status) {
      merchant.status = status
      // Update isActive based on status
      if (status === 'active') {
        merchant.isActive = true
      } else if (status === 'suspended' || status === 'inactive') {
        merchant.isActive = false
      }
    }

    if (commissionRate !== undefined) {
      merchant.commissionRate = commissionRate
    }

    await merchant.save()

    return res.status(200).json({
      message: 'Merchant updated successfully',
      merchant: merchant.toObject()
    })
  } catch (error) {
    console.error('Update merchant error:', error)
    return res.status(400).json({ error: 'Failed to update merchant' })
  }
}

async function deleteMerchant(req: NextApiRequest, res: NextApiResponse, id: string) {
  try {
    const merchant = await Merchant.findById(id)
    
    if (!merchant) {
      return res.status(404).json({ error: 'Merchant not found' })
    }

    await Merchant.findByIdAndDelete(id)

    return res.status(200).json({ message: 'Merchant deleted successfully' })
  } catch (error) {
    console.error('Delete merchant error:', error)
    return res.status(400).json({ error: 'Failed to delete merchant' })
  }
}
