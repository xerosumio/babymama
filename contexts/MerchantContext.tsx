import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { Merchant } from '@/lib/merchantTypes'

interface MerchantState {
  merchant: Merchant | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

type MerchantAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: Merchant }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_MERCHANT'; payload: Merchant }
  | { type: 'CLEAR_ERROR' }

const initialState: MerchantState = {
  merchant: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
}

function merchantReducer(state: MerchantState, action: MerchantAction): MerchantState {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      }
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        merchant: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      }
    case 'LOGIN_FAILURE':
      return {
        ...state,
        merchant: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      }
    case 'LOGOUT':
      return {
        ...state,
        merchant: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      }
    case 'UPDATE_MERCHANT':
      return {
        ...state,
        merchant: action.payload,
      }
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      }
    default:
      return state
  }
}

interface MerchantContextType extends MerchantState {
  login: (email: string, password: string) => Promise<void>
  register: (merchantData: Partial<Merchant>) => Promise<void>
  logout: () => void
  updateMerchant: (merchantData: Partial<Merchant>) => Promise<void>
  clearError: () => void
}

const MerchantContext = createContext<MerchantContextType | undefined>(undefined)

export function MerchantProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(merchantReducer, initialState)

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('merchant_token')
        if (token) {
          // In a real app, you would verify the token with the server
          // For now, we'll just check if it exists
          const merchantData = localStorage.getItem('merchant_data')
          if (merchantData) {
            const merchant = JSON.parse(merchantData)
            dispatch({ type: 'LOGIN_SUCCESS', payload: merchant })
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        localStorage.removeItem('merchant_token')
        localStorage.removeItem('merchant_data')
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    dispatch({ type: 'LOGIN_START' })
    
    try {
      // In a real app, you would make an API call here
      // For now, we'll simulate a login
      if (email === 'merchant@test.com' && password === 'password123') {
        const mockMerchant: Merchant = {
          _id: '1',
          businessName: 'Baby Care Store',
          businessType: 'company',
          contactPerson: 'John Doe',
          email: 'merchant@test.com',
          phone: '+852-1234-5678',
          address: {
            street: '123 Main Street',
            city: 'Hong Kong',
            state: 'Hong Kong',
            postalCode: '00000',
            country: 'Hong Kong'
          },
          businessLicense: 'BL123456',
          taxId: 'TX123456',
          bankAccount: {
            accountName: 'Baby Care Store Ltd',
            accountNumber: '1234567890',
            bankName: 'HSBC',
            bankCode: '004'
          },
          status: 'approved',
          commissionRate: 0.15,
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date(),
          lastLoginAt: new Date()
        }
        
        localStorage.setItem('merchant_token', 'mock_token')
        localStorage.setItem('merchant_data', JSON.stringify(mockMerchant))
        dispatch({ type: 'LOGIN_SUCCESS', payload: mockMerchant })
      } else {
        throw new Error('Invalid credentials')
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed'
      dispatch({ type: 'LOGIN_FAILURE', payload: errorMessage })
    }
  }

  const register = async (merchantData: Partial<Merchant>) => {
    dispatch({ type: 'LOGIN_START' })
    
    try {
      // In a real app, you would make an API call here
      // For now, we'll simulate a registration
      const newMerchant: Merchant = {
        _id: Date.now().toString(),
        businessName: merchantData.businessName || '',
        businessType: merchantData.businessType || 'individual',
        contactPerson: merchantData.contactPerson || '',
        email: merchantData.email || '',
        phone: merchantData.phone || '',
        address: merchantData.address || {
          street: '',
          city: '',
          state: '',
          postalCode: '',
          country: ''
        },
        businessLicense: merchantData.businessLicense,
        taxId: merchantData.taxId,
        bankAccount: merchantData.bankAccount || {
          accountName: '',
          accountNumber: '',
          bankName: '',
          bankCode: ''
        },
        status: 'pending',
        commissionRate: 0.15,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      
      // In a real app, you would save to database
      console.log('Merchant registered:', newMerchant)
      dispatch({ type: 'LOGIN_SUCCESS', payload: newMerchant })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed'
      dispatch({ type: 'LOGIN_FAILURE', payload: errorMessage })
    }
  }

  const logout = () => {
    localStorage.removeItem('merchant_token')
    localStorage.removeItem('merchant_data')
    dispatch({ type: 'LOGOUT' })
  }

  const updateMerchant = async (merchantData: Partial<Merchant>) => {
    if (!state.merchant) return
    
    try {
      const updatedMerchant = { ...state.merchant, ...merchantData, updatedAt: new Date() }
      localStorage.setItem('merchant_data', JSON.stringify(updatedMerchant))
      dispatch({ type: 'UPDATE_MERCHANT', payload: updatedMerchant })
    } catch (error) {
      console.error('Update failed:', error)
    }
  }

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' })
  }

  const value: MerchantContextType = {
    ...state,
    login,
    register,
    logout,
    updateMerchant,
    clearError,
  }

  return (
    <MerchantContext.Provider value={value}>
      {children}
    </MerchantContext.Provider>
  )
}

export function useMerchant() {
  const context = useContext(MerchantContext)
  if (context === undefined) {
    throw new Error('useMerchant must be used within a MerchantProvider')
  }
  return context
}
