import { useEffect, useMemo, useReducer } from 'react'
import { CartContext } from './CartContext.js'
import { cartReducer, initialState } from '../features/cartReducer.js'

const STORAGE_KEY = 'burger-store'

function init() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY))
    return saved ? { ...initialState, ...saved } : initialState
  } catch {
    return initialState
  }
}

export default function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, undefined, init)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      // storage to'la yoki o'chirilgan — e'tiborsiz qoldiramiz
    }
  }, [state])

  const value = useMemo(
    () => ({
      cart: state.cart,
      favorites: state.favorites,
      cartCount: state.cart.reduce((sum, item) => sum + item.qty, 0),
      addToCart: (id, qty = 1) => dispatch({ type: 'ADD', id, qty }),
      setQty: (id, qty) => dispatch({ type: 'SET_QTY', id, qty }),
      removeFromCart: (id) => dispatch({ type: 'REMOVE', id }),
      clearCart: () => dispatch({ type: 'CLEAR' }),
      toggleFavorite: (id) => dispatch({ type: 'TOGGLE_FAVORITE', id }),
      isFavorite: (id) => state.favorites.includes(id),
    }),
    [state],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
