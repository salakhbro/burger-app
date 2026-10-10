export const initialState = { cart: [], favorites: [] }

export function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const { id, qty } = action
      const exists = state.cart.some((item) => item.id === id)
      const cart = exists
        ? state.cart.map((item) => (item.id === id ? { ...item, qty: item.qty + qty } : item))
        : [...state.cart, { id, qty }]
      return { ...state, cart }
    }
    case 'SET_QTY': {
      if (action.qty < 1) {
        return { ...state, cart: state.cart.filter((item) => item.id !== action.id) }
      }
      return {
        ...state,
        cart: state.cart.map((item) => (item.id === action.id ? { ...item, qty: action.qty } : item)),
      }
    }
    case 'REMOVE':
      return { ...state, cart: state.cart.filter((item) => item.id !== action.id) }
    case 'CLEAR':
      return { ...state, cart: [] }
    case 'TOGGLE_FAVORITE': {
      const has = state.favorites.includes(action.id)
      return {
        ...state,
        favorites: has
          ? state.favorites.filter((id) => id !== action.id)
          : [...state.favorites, action.id],
      }
    }
    default:
      return state
  }
}
