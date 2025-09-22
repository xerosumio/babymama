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
          const merchantData = localStorage.getItem('merchant_data')
          if (merchantData) {
            const merchant = JSON.parse(merchantData)
            // Check if merchant is active
            if (merchant.status === 'active' && merchant.isActive) {
              dispatch({ type: 'LOGIN_SUCCESS', payload: merchant })
            } else {
              // Clear invalid session
              localStorage.removeItem('merchant_token')
              localStorage.removeItem('merchant_data')
            }
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
      // Call the actual login API
      const response = await fetch('/api/merchant/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      })

      if (response.ok) {
        const data = await response.json()
        const merchant = data.merchant
        
        // Check if merchant is active
        if (merchant.status === 'active' && merchant.isActive) {
          localStorage.setItem('merchant_token', data.token)
          localStorage.setItem('merchant_data', JSON.stringify(merchant))
          dispatch({ type: 'LOGIN_SUCCESS', payload: merchant })
        } else {
          throw new Error('Your account is pending approval or has been suspended')
        }
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Login failed')
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed'
      dispatch({ type: 'LOGIN_FAILURE', payload: errorMessage })
    }
  }

  const register = async (merchantData: Partial<Merchant>) => {
    dispatch({ type: 'LOGIN_START' })
    
    try {
      // Call the actual registration API
      const response = await fetch('/api/merchant/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(merchantData)
      })

      if (response.ok) {
        const data = await response.json()
        const merchant = data.merchant
        
        // Store merchant data and token
        localStorage.setItem('merchant_token', data.token)
        localStorage.setItem('merchant_data', JSON.stringify(merchant))
        dispatch({ type: 'LOGIN_SUCCESS', payload: merchant })
        
        // Show success message
        alert('Registration successful! Your account is pending approval.')
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Registration failed')
      }
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
