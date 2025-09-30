import { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'
import jwt from 'jsonwebtoken'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect()

  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' })
    }

    const token = authHeader.substring(7) // Remove 'Bearer ' prefix

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any
    const userId = decoded.userId

    if (req.method === 'GET') {
      // Get user addresses
      const user = await User.findById(userId).select('addresses')
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' })
      }

      return res.status(200).json({
        success: true,
        addresses: user.addresses || []
      })
    } else if (req.method === 'POST') {
      // Add new address
      const { firstName, lastName, address1, address2, city, state, postalCode, country, phone, isDefault, type } = req.body

      if (!firstName || !lastName || !address1 || !city || !state || !postalCode || !country || !phone) {
        return res.status(400).json({ error: 'Required fields are missing' })
      }

      const newAddress = {
        firstName,
        lastName,
        address1,
        address2: address2 || '',
        city,
        state,
        postalCode,
        country,
        phone,
        isDefault: isDefault || false,
        type: type || 'shipping'
      }

      // If this is set as default, unset other default addresses
      if (isDefault) {
        await User.updateOne(
          { _id: userId },
          { $set: { 'addresses.$[].isDefault': false } }
        )
      }

      const user = await User.findByIdAndUpdate(
        userId,
        { $push: { addresses: newAddress } },
        { new: true }
      ).select('addresses')

      if (!user) {
        return res.status(404).json({ error: 'User not found' })
      }

      return res.status(201).json({
        success: true,
        addresses: user.addresses
      })
    }
  } catch (error) {
    console.error('Address API error:', error)
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ error: 'Invalid token' })
    }
    return res.status(500).json({ error: 'Internal server error' })
  }
}
