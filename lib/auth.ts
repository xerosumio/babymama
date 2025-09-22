import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export interface TokenPayload {
  userId?: string
  merchantId?: string
  adminId?: string
  email: string
  userType: 'user' | 'merchant' | 'admin'
  role: string
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload
    return decoded
  } catch (error) {
    console.error('Token verification failed:', error)
    return null
  }
}

export function verifyAdminToken(token: string): TokenPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload
    if (decoded.userType === 'admin' || decoded.role === 'admin') {
      return decoded
    }
    return null
  } catch (error) {
    console.error('Admin token verification failed:', error)
    return null
  }
}

export function verifyMerchantToken(token: string): TokenPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload
    if (decoded.userType === 'merchant' || decoded.role === 'merchant') {
      return decoded
    }
    return null
  } catch (error) {
    console.error('Merchant token verification failed:', error)
    return null
  }
}

export function generateToken(payload: Omit<TokenPayload, 'iat' | 'exp'>): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}