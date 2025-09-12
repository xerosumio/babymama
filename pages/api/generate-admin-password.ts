import { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcryptjs'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const password = 'admin123'
    const hashedPassword = await bcrypt.hash(password, 12)
    
    return res.status(200).json({
      password,
      hashedPassword,
      message: 'Copy the hashed password to admin auth login'
    })
  } catch (error) {
    return res.status(500).json({ 
      error: 'Failed to generate password',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
