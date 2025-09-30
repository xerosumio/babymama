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
      // Get user payment methods
      const user = await User.findById(userId).select('paymentMethods')
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' })
      }

      return res.status(200).json({
        success: true,
        paymentMethods: user.paymentMethods || []
      })
    } else if (req.method === 'POST') {
      // Add new payment method
      const { type, cardNumber, expiryMonth, expiryYear, cardholderName, isDefault } = req.body

      if (!type || !cardNumber || !expiryMonth || !expiryYear || !cardholderName) {
        return res.status(400).json({ error: 'Missing required fields' })
      }

      // Basic validation
      if (cardNumber.length < 13 || cardNumber.length > 19) {
        return res.status(400).json({ error: 'Invalid card number' })
      }

      if (expiryMonth < 1 || expiryMonth > 12) {
        return res.status(400).json({ error: 'Invalid expiry month' })
      }

      const currentYear = new Date().getFullYear()
      if (expiryYear < currentYear) {
        return res.status(400).json({ error: 'Card has expired' })
      }

      const newPaymentMethod = {
        type,
        cardNumber: cardNumber.replace(/\s/g, ''), // Remove spaces
        expiryMonth: String(expiryMonth).padStart(2, '0'),
        expiryYear: String(expiryYear),
        cardholderName,
        isDefault: isDefault || false,
        isActive: true
      }

      // If this is set as default, unset other default payment methods
      if (isDefault) {
        await User.updateOne(
          { _id: userId },
          { $set: { 'paymentMethods.$[].isDefault': false } }
        )
      }

      const user = await User.findByIdAndUpdate(
        userId,
        { $push: { paymentMethods: newPaymentMethod } },
        { new: true }
      ).select('paymentMethods')

      if (!user) {
        return res.status(404).json({ error: 'User not found' })
      }

      return res.status(201).json({
        success: true,
        paymentMethods: user.paymentMethods
      })
    }
  } catch (error) {
    console.error('Payment Methods API error:', error)
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ error: 'Invalid token' })
    }
    return res.status(500).json({ error: 'Internal server error' })
  }
}
