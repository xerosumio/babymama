import { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '@/lib/mongodb'
import Merchant from '@/models/Merchant'
import { verifyMerchantToken } from '@/lib/auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect()

  try {
    switch (req.method) {
      case 'GET':
        return await getMerchantSettings(req, res)
      case 'PUT':
        return await updateMerchantSettings(req, res)
      default:
        res.setHeader('Allow', ['GET', 'PUT'])
        return res.status(405).json({ error: 'Method not allowed' })
    }
  } catch (error) {
    console.error('API Error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

async function getMerchantSettings(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Verify merchant authentication
    const token = req.headers.authorization?.replace('Bearer ', '')
    if (!token) {
      return res.status(401).json({ error: 'No token provided' })
    }

    const decoded = verifyMerchantToken(token)
    if (!decoded) {
      return res.status(401).json({ error: 'Invalid token' })
    }

    const merchant = await Merchant.findById(decoded.merchantId)
    if (!merchant) {
      return res.status(404).json({ error: 'Merchant not found' })
    }

    return res.status(200).json({
      business: {
        businessName: merchant.name,
        businessType: merchant.businessType,
        contactPerson: merchant.contactPerson,
        email: merchant.email,
        phone: merchant.phone,
        description: merchant.description,
        logo: merchant.logo
      },
      address: merchant.address,
      bankAccount: merchant.payoutAccount,
      notifications: {
        emailNotifications: true, // Default values
        smsNotifications: false,
        orderUpdates: true,
        lowStockAlerts: true,
        newReviews: true
      },
      shipping: {
        freeShippingThreshold: 500,
        shippingRates: [], // Could be expanded
        processingTime: '1-2 business days'
      },
      store: {
        currency: 'HKD',
        timezone: 'Asia/Hong_Kong',
        language: 'en',
        isActive: merchant.isActive,
        status: merchant.status
      }
    })
  } catch (error) {
    console.error('Get merchant settings error:', error)
    return res.status(500).json({ error: 'Failed to fetch settings' })
  }
}

async function updateMerchantSettings(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Verify merchant authentication
    const token = req.headers.authorization?.replace('Bearer ', '')
    if (!token) {
      return res.status(401).json({ error: 'No token provided' })
    }

    const decoded = verifyMerchantToken(token)
    if (!decoded) {
      return res.status(401).json({ error: 'Invalid token' })
    }

    const { business, address, bankAccount, notifications, shipping, store } = req.body

    const updateData: any = {}

    if (business) {
      updateData.name = business.businessName
      updateData.businessType = business.businessType
      updateData.contactPerson = business.contactPerson
      updateData.email = business.email
      updateData.phone = business.phone
      updateData.description = business.description
      if (business.logo) updateData.logo = business.logo
    }

    if (address) {
      updateData.address = address
    }

    if (bankAccount) {
      updateData.payoutAccount = bankAccount
    }

    if (store) {
      if (store.isActive !== undefined) updateData.isActive = store.isActive
      if (store.status) updateData.status = store.status
    }

    const updatedMerchant = await Merchant.findByIdAndUpdate(
      decoded.merchantId,
      updateData,
      { new: true }
    )

    if (!updatedMerchant) {
      return res.status(404).json({ error: 'Merchant not found' })
    }

    return res.status(200).json({
      message: 'Settings updated successfully',
      merchant: {
        business: {
          businessName: updatedMerchant.name,
          businessType: updatedMerchant.businessType,
          contactPerson: updatedMerchant.contactPerson,
          email: updatedMerchant.email,
          phone: updatedMerchant.phone,
          description: updatedMerchant.description,
          logo: updatedMerchant.logo
        },
        address: updatedMerchant.address,
        bankAccount: updatedMerchant.payoutAccount,
        store: {
          isActive: updatedMerchant.isActive,
          status: updatedMerchant.status
        }
      }
    })
  } catch (error) {
    console.error('Update merchant settings error:', error)
    return res.status(500).json({ error: 'Failed to update settings' })
  }
}
