import { useContext } from 'react'
import { CartContext } from './CartContext.js'

export function useStore() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useStore must be used inside <CartProvider>')
  return ctx
}