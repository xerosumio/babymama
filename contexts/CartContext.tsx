import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { Product, CartItem } from '@/lib/types'

interface CartState {
  items: CartItem[]
  total: number
  itemCount: number
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: { product: Product; quantity: number; variant?: any } }
  | { type: 'REMOVE_ITEM'; payload: { productId: string; variantId?: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; variantId?: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartItem[] }

const CartContext = createContext<{
  state: CartState
  dispatch: React.Dispatch<CartAction>
  addToCart: (product: Product, quantity: number, variant?: any) => void
  removeFromCart: (productId: string, variantId?: string) => void
  updateQuantity: (productId: string, variantId: string | undefined, quantity: number) => void
  clearCart: () => void
} | null>(null)

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, quantity, variant } = action.payload
      const existingItemIndex = state.items.findIndex(
        item => item.productId === product._id && item.variantId === variant?._id
      )

      if (existingItemIndex > -1) {
        const updatedItems = [...state.items]
        updatedItems[existingItemIndex].quantity += quantity
        return {
          ...state,
          items: updatedItems,
          itemCount: state.itemCount + quantity,
          total: calculateTotal(updatedItems)
        }
      } else {
        const newItem: CartItem = {
          _id: `${product._id}-${variant?._id || 'default'}`,
          productId: product._id,
          variantId: variant?._id,
          quantity,
          price: variant?.price || product.price,
          product,
          variant
        }
        return {
          ...state,
          items: [...state.items, newItem],
          itemCount: state.itemCount + quantity,
          total: calculateTotal([...state.items, newItem])
        }
      }
    }

    case 'REMOVE_ITEM': {
      const { productId, variantId } = action.payload
      const updatedItems = state.items.filter(
        item => !(item.productId === productId && item.variantId === variantId)
      )
      return {
        ...state,
        items: updatedItems,
        itemCount: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
        total: calculateTotal(updatedItems)
      }
    }

    case 'UPDATE_QUANTITY': {
      const { productId, variantId, quantity } = action.payload
      const updatedItems = state.items.map(item =>
        item.productId === productId && item.variantId === variantId
          ? { ...item, quantity: Math.max(0, quantity) }
          : item
      ).filter(item => item.quantity > 0)

      return {
        ...state,
        items: updatedItems,
        itemCount: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
        total: calculateTotal(updatedItems)
      }
    }

    case 'CLEAR_CART':
      return {
        items: [],
        total: 0,
        itemCount: 0
      }

    case 'LOAD_CART':
      return {
        items: action.payload,
        itemCount: action.payload.reduce((sum, item) => sum + item.quantity, 0),
        total: calculateTotal(action.payload)
      }

    default:
      return state
  }
}

const calculateTotal = (items: CartItem[]): number => {
  return items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
}

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    total: 0,
    itemCount: 0
  })

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('babymama-cart')
    if (savedCart) {
      try {
        const cartItems = JSON.parse(savedCart)
        dispatch({ type: 'LOAD_CART', payload: cartItems })
      } catch (error) {
        console.error('Error loading cart from localStorage:', error)
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('babymama-cart', JSON.stringify(state.items))
  }, [state.items])

  const addToCart = (product: Product, quantity: number, variant?: any) => {
    dispatch({ type: 'ADD_ITEM', payload: { product, quantity, variant } })
  }

  const removeFromCart = (productId: string, variantId?: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { productId, variantId } })
  }

  const updateQuantity = (productId: string, variantId: string | undefined, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, variantId, quantity } })
  }

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
  }

  return (
    <CartContext.Provider value={{
      state,
      dispatch,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart
    }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

