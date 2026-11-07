
export const initialState = {
  cart: [],
  favorites: [],
}

export function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const existing = state.cart.find(
        (item) => Number(item.id) === Number(action.id)
      )

      const qty = Math.max(1, Number(action.qty) || 1)

      if (existing) {
        return {
          ...state,
          cart: state.cart.map((item) =>
            Number(item.id) === Number(action.id)
              ? { ...item, qty: item.qty + qty }
              : item
          ),
        }
      }

      return {
        ...state,
        cart: [
          ...state.cart,
          {
            id: action.id,
            qty,
          },
        ],
      }
    }

    case 'SET_QTY': {
      return {
        ...state,
        cart: state.cart.map((item) =>
          Number(item.id) === Number(action.id)
            ? {
              ...item,
              qty: Math.max(1, Number(action.qty) || 1),
            }
            : item
        ),
      }
    }

    case 'REMOVE': {
      return {
        ...state,
        cart: state.cart.filter(
          (item) => Number(item.id) !== Number(action.id)
        ),
      }
    }

    case 'CLEAR': {
      return {
        ...state,
        cart: [],
      }
    }

    case 'TOGGLE_FAVORITE': {
      const id = Number(action.id)

      const exists = state.favorites.some(
        (favoriteId) => Number(favoriteId) === id
      )

      return {
        ...state,
        favorites: exists
          ? state.favorites.filter(
            (favoriteId) => Number(favoriteId) !== id
          )
          : [...state.favorites, id],
      }
    }

    case 'SET_FAVORITES': {
      return {
        ...state,
        favorites: [...new Set(action.ids.map(Number))],
      }
    }

    default:
      return state
  }
}
