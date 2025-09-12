import React, { createContext, useContext, useReducer, ReactNode } from 'react'
import { Product } from '@/lib/types'

interface WishlistState {
  items: Product[]
  itemCount: number
}

type WishlistAction =
  | { type: 'ADD_TO_WISHLIST'; payload: Product }
  | { type: 'REMOVE_FROM_WISHLIST'; payload: string }
  | { type: 'CLEAR_WISHLIST' }

const initialState: WishlistState = {
  items: [],
  itemCount: 0
}

const wishlistReducer = (state: WishlistState, action: WishlistAction): WishlistState => {
  switch (action.type) {
    case 'ADD_TO_WISHLIST':
      const existingItem = state.items.find(item => item._id === action.payload._id)
      if (existingItem) {
        return state // Item already in wishlist
      }
      return {
        ...state,
        items: [...state.items, action.payload],
        itemCount: state.itemCount + 1
      }
    case 'REMOVE_FROM_WISHLIST':
      return {
        ...state,
        items: state.items.filter(item => item._id !== action.payload),
        itemCount: state.itemCount - 1
      }
    case 'CLEAR_WISHLIST':
      return {
        ...state,
        items: [],
        itemCount: 0
      }
    default:
      return state
  }
}

interface WishlistContextType {
  state: WishlistState
  addToWishlist: (product: Product) => void
  removeFromWishlist: (productId: string) => void
  clearWishlist: () => void
  isInWishlist: (productId: string) => boolean
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export const useWishlist = () => {
  const context = useContext(WishlistContext)
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider')
  }
  return context
}

interface WishlistProviderProps {
  children: ReactNode
}

export const WishlistProvider: React.FC<WishlistProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(wishlistReducer, initialState)

  const addToWishlist = (product: Product) => {
    dispatch({ type: 'ADD_TO_WISHLIST', payload: product })
  }

  const removeFromWishlist = (productId: string) => {
    dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: productId })
  }

  const clearWishlist = () => {
    dispatch({ type: 'CLEAR_WISHLIST' })
  }

  const isInWishlist = (productId: string) => {
    return state.items.some(item => item._id === productId)
  }

  const value = {
    state,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    isInWishlist
  }

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  )
}

