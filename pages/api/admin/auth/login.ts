import { NextApiRequest, NextApiResponse } from 'next'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { username, password } = req.body

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' })
    }

    // Simple admin authentication
    if (username === 'admin@test.com' && password === 'admin123') {
      const admin = {
        id: '1',
        username: 'admin@test.com',
        name: 'Admin User',
        role: 'admin'
      }

      // Generate JWT token
      const token = jwt.sign(
        { 
          adminId: admin.id, 
          email: admin.username, 
          userType: 'admin',
          role: 'admin'
        },
        JWT_SECRET,
        { expiresIn: '7d' }
      )

      return res.status(200).json({
        message: 'Login successful',
        token,
        admin,
        userType: 'admin'
      })
    } else {
      return res.status(401).json({ error: 'Invalid credentials' })
    }
  } catch (error) {
    console.error('Admin login error:', error)
    return res.status(500).json({ 
      error: 'Login failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}