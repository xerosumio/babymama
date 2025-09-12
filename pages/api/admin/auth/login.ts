import { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

// Admin users - in production, this should be in a separate admin collection
const ADMIN_USERS = [
  {
    email: 'admin@babymama.com',
    password: '$2b$12$DM5y/leme1t3J8j4oYR9b.GL/DSgBYfgiCDF370i/VNe336zgvNWq', // admin123
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin'
  }
]

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    await dbConnect()

    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    // Check admin users
    const adminUser = ADMIN_USERS.find(user => user.email === email)

    if (!adminUser) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, adminUser.password)

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        adminId: adminUser.email, 
        email: adminUser.email, 
        userType: 'admin',
        role: 'admin'
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    return res.status(200).json({
      message: 'Admin login successful',
      token,
      admin: {
        email: adminUser.email,
        firstName: adminUser.firstName,
        lastName: adminUser.lastName,
        role: adminUser.role
      },
      userType: 'admin'
    })
  } catch (error) {
    console.error('Admin login error:', error)
    return res.status(500).json({ 
      error: 'Login failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
