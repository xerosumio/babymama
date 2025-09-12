import { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '@/lib/mongodb'
import Merchant from '@/models/Merchant'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    await dbConnect()

    const { 
      name, 
      email, 
      password, 
      phone, 
      description,
      address 
    } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email and password are required' })
    }

    // Check if merchant already exists
    const existingMerchant = await Merchant.findOne({ email })
    if (existingMerchant) {
      return res.status(400).json({ error: 'Merchant already exists' })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create merchant
    const merchant = new Merchant({
      name,
      email,
      password: hashedPassword,
      phone: phone || '',
      description: description || { en: '', 'zh-HK': '' },
      address: address || {
        street: '',
        city: '',
        state: '',
        postalCode: '',
        country: ''
      },
      isActive: false, // New merchants need approval
      commissionRate: 10, // Default commission rate
      payoutAccount: {
        type: 'bank',
        accountId: '',
        accountName: ''
      },
      shippingTemplates: []
    })

    await merchant.save()

    // Generate JWT token
    const token = jwt.sign(
      { 
        merchantId: merchant._id, 
        email: merchant.email, 
        userType: 'merchant',
        role: 'merchant'
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    // Remove password from response
    const merchantResponse = merchant.toObject()
    delete merchantResponse.password

    return res.status(201).json({
      message: 'Merchant registered successfully',
      token,
      merchant: merchantResponse,
      userType: 'merchant'
    })
  } catch (error) {
    console.error('Merchant registration error:', error)
    return res.status(500).json({ 
      error: 'Registration failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
