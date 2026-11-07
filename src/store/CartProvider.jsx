import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react'

import { CartContext } from './CartContext.js'
import { cartReducer, initialState } from '../features/cartReducer.js'
import { categories, getCategorySlug, products } from '../features/products.js'

const STORAGE_KEY = 'burger-store'
const API_URL = 'http://localhost:3000/api'

const normalize = (name) => String(name || '').trim().toLowerCase()

const productNameAliases = {
  'texas grill pizza': ['texascha grill'],  
  'cheddar doner pizza': ['cheddar donar'],
  'meat mix pizza': ['goshtli miks'],
  'cheese pizza': ['pishloqli pitsa'],
  'freeman pizza': ['frimen'],
  'four seasons pizza': ['tort fasl'],
  'alfredo pizza': ['alfredo'],
  'cheesy chicken pizza': ['pishloqli joja'],
  'double pepperoni pizza': ['dabl pepperoni'],
  'ranch chicken pizza': ['runch jojacha'],
  'hot dog': ['hot-dog'],
  'cheese hot dog': ['pishloqli hot-dog'],
  'royal hot dog': ['shoxona hot-dog'],
  'chicken shawarma': ['tovuqli shawarma'],
  'cheesy mini lavash': ['pishloqli mini lavash'],
  'tandir cheese lavash': ['tandir lavash pishloq bilan'],
  'large lavash': ['katta lavash'],
  'large cheese lavash': ['katta pishloqli lavash'],
  sandwich: ['sandwiches'],
  'crispy chicken (kfc style)': ['kfc'],
  'assorted desserts': ['desserts'],
  'cinnamon rolls (4 pcs) 👶': ['sinnamonchalar 4 ta 👶'],
  'cinnamon rolls (8 pcs) 👶': ['sinnamonchalar 8 ta 👶'],
  'cinnamon rolls (16 pcs) 👶': ['sinnamonchalar 16 ta 👶'],
  'chocolate cheesecake': ['shokoladli chizkeyk'],
  'chocolate fondant': ['shokoladli fondan'],
  'berry donut': ['rezavorli donat'],
  'hazelnut donut': ['findiqli donat'],
  'strawberry donut': ['qulupnayli donat'],
  'small french fries': ['fri kichkina'],
  'medium french fries': ['fri o‘rta'],
  'large french fries': ['fri katta'],
  'country wedges': ['jaydari kartoshka'],
  'giant french fries': ['fri gigant'],
  'chicken bites': ['jo‘ja books'],
  'chicken nuggets (5 pcs)': ['naggets 5 dona'],
  'chicken nuggets (8 pcs)': ['naggets 8 dona'],
  'chicken nuggets (15 pcs)': ['naggets 15 dona'],
  'nuggets box': ['naggets books'],
  mojito: ['moxito'],
}

const matchesProductName = (backendName, localProduct) => {
  const name = normalize(localProduct.name)

  return [name, ...(productNameAliases[name] || [])].some(
    (alias) => normalize(alias) === normalize(backendName)
  )
}

const getUserId = () => {
  try {
    const user = JSON.parse(
      localStorage.getItem('burger-user') || 'null'
    )

    return user?.id ?? null
  } catch {
    return null
  }
}

const getArray = (data) => {
  if (Array.isArray(data)) return data
  if (Array.isArray(data?.data)) return data.data
  if (Array.isArray(data?.data?.rows)) return data.data.rows
  if (Array.isArray(data?.rows)) return data.rows

  return []
}

function init() {
  try {
    const saved = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || 'null'
    )

    return saved
      ? { ...initialState, ...saved }
      : initialState
  } catch {
    return initialState
  }
}

export default function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, undefined, init)

  const [favoriteRecords, setFavoriteRecords] = useState([])
  const [backendCategories, setBackendCategories] = useState([])
  const [backendProducts, setBackendProducts] = useState([])
  const [favoritesLoading, setFavoritesLoading] = useState(true)

  const favoriteBusy = useRef(new Set())
  const mutationVersion = useRef(0)

  const catalogCategories = useMemo(() => {
    const backendOnlyCategories = backendCategories
      .filter((category) => !getCategorySlug(category))
      .map((category) => ({
        slug: `category-${Number(category.id)}`,
        label: category.name,
        backendId: Number(category.id),
      }))
      .filter((category) => Number.isFinite(category.backendId) && category.backendId > 0)

    return [...categories, ...backendOnlyCategories]
  }, [backendCategories])

  const catalogProducts = useMemo(() => {
    const backendCategorySlugs = new Map(
      catalogCategories
        .filter((category) => category.backendId)
        .map((category) => [category.backendId, category.slug])
    )
    const localProducts = products.map((product) => {
      const backendProduct = backendProducts.find((item) =>
        matchesProductName(item.name, product)
      )
      const backendCategoryId = Number(
        backendProduct?.category_id ?? backendProduct?.category?.id
      )
      const backendCategorySlug = backendCategorySlugs.get(backendCategoryId)

      return backendCategorySlug
        ? { ...product, category: backendCategorySlug }
        : product
    })
    const backendOnlyProducts = backendProducts
      .filter(
        (backendProduct) =>
          !products.some((product) =>
            matchesProductName(backendProduct.name, product)
          )
      )
      .map((backendProduct) => ({
        id: -Number(backendProduct.id),
        backendId: Number(backendProduct.id),
        name: backendProduct.name,
        desc: backendProduct.description || '',
        price: Number(backendProduct.price),
        category:
          backendCategorySlugs.get(
            Number(backendProduct.category_id ?? backendProduct.category?.id)
          ) ||
          getCategorySlug(backendProduct.category) ||
          (backendProduct.category?.id
            ? `category-${Number(backendProduct.category.id)}`
            : backendProduct.category_id
              ? `category-${Number(backendProduct.category_id)}`
              : ''),
        image: backendProduct.image || null,
        emoji: '🍔',
      }))
      .filter((product) => Number.isFinite(product.backendId) && product.backendId > 0)

    return [...localProducts, ...backendOnlyProducts]
  }, [backendProducts, catalogCategories])

  const getLocalProduct = useCallback((product) => {
    if (typeof product === 'object' && product !== null) {
      return (
        catalogProducts.find((p) => Number(p.id) === Number(product.id)) ||
        products.find(
          (p) => normalize(p.name) === normalize(product.name)
        ) || product
      )
    }

    return catalogProducts.find(
      (p) => Number(p.id) === Number(product)
    )
  }, [catalogProducts])

  const getLocalId = useCallback(
    (product) => {
      const item = getLocalProduct(product)
      return item?.id ?? Number(product)
    },
    [getLocalProduct]
  )

  const getBackendProduct = useCallback(
    (product) =>
      backendProducts.find(
        (item) =>
          Number(item.id) === Number(product?.backendId) ||
          matchesProductName(item.name, product)
      ) ??
      null,
    [backendProducts]
  )

  const loadData = useCallback(async () => {
    const currentVersion = mutationVersion.current

    try {
      setFavoritesLoading(true)

      const productsResponse = await fetch(`${API_URL}/products`)

      if (!productsResponse.ok) {
        throw new Error('Products yuklanmadi')
      }

      const productsJson = await productsResponse.json()
      const backendData = getArray(productsJson)

      setBackendProducts(backendData)

      try {
        const categoriesResponse = await fetch(`${API_URL}/categories`)
        if (!categoriesResponse.ok) {
          throw new Error('Categories yuklanmadi')
        }

        const categoriesJson = await categoriesResponse.json()
        if (!Array.isArray(categoriesJson)) {
          throw new Error('Categories javobi noto‘g‘ri formatda')
        }

        setBackendCategories(categoriesJson)
      } catch (error) {
        console.error('Categories loading error:', error)
      }

      const userId = getUserId()

      if (!userId) {
        if (currentVersion === mutationVersion.current) {
          setFavoriteRecords([])
          dispatch({
            type: 'SET_FAVORITES',
            ids: [],
          })
        }

        return
      }

      const response = await fetch(
        `${API_URL}/favorites?user_id=${userId}`
      )

      if (!response.ok) {
        throw new Error('Favorites yuklanmadi')
      }

      const json = await response.json()
      const data = getArray(json)

      if (currentVersion !== mutationVersion.current) return

      const userFavorites = data.filter(
        (favorite) =>
          Number(favorite.user_id) === Number(userId)
      )

      const ids = userFavorites
        .map((favorite) => {
          const backendProduct = backendData.find(
            (p) => Number(p.id) === Number(favorite.product_id)
          )

          if (!backendProduct) return null

          const localProduct = products.find((p) =>
            matchesProductName(backendProduct.name, p)
          )

          return localProduct?.id ?? -Number(backendProduct.id)
        })
        .filter((id) => id !== null)

      setFavoriteRecords(userFavorites)

      dispatch({
        type: 'SET_FAVORITES',
        ids,
      })
    } catch (error) {
      console.error('Favorites loading error:', error)
    } finally {
      setFavoritesLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const reloadAfterAuthChange = useCallback(() => {
    mutationVersion.current += 1
    loadData()
  }, [loadData])

  useEffect(() => {
    window.addEventListener('burger-auth-changed', reloadAfterAuthChange)
    window.addEventListener('storage', reloadAfterAuthChange)

    return () => {
      window.removeEventListener('burger-auth-changed', reloadAfterAuthChange)
      window.removeEventListener('storage', reloadAfterAuthChange)
    }
  }, [reloadAfterAuthChange])

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(state)
    )
  }, [state])

  const toggleFavorite = useCallback(
    async (product) => {
      const localProduct = getLocalProduct(product)
      const localId = getLocalId(product)

      if (!localProduct || !Number.isFinite(Number(localId))) {
        throw new Error('Mahsulot topilmadi')
      }

      if (favoriteBusy.current.has(localId)) return

      const userId = getUserId()

      // Mehmon foydalanuvchi bo'lsa yoki backend hali ulanmagan bo'lsa mahalliy xotirada saqlaymiz
      if (!userId) {
        dispatch({
          type: 'TOGGLE_FAVORITE',
          id: localId,
        })
        return
      }

      const backendProduct = backendProducts.find(
        (p) => matchesProductName(p.name, localProduct)
      )

      if (!backendProduct) {
        // Backend mahsuloti topilmasa ham mahalliy rejimda saqlaymiz
        dispatch({
          type: 'TOGGLE_FAVORITE',
          id: localId,
        })
        return
      }

      favoriteBusy.current.add(localId)

      const existing = favoriteRecords.find(
        (f) =>
          Number(f.product_id) === Number(backendProduct.id) &&
          Number(f.user_id) === Number(userId)
      )

      try {
        if (existing) {
          const response = await fetch(
            `${API_URL}/favorites/${existing.id}`,
            {
              method: 'DELETE',
            }
          ).catch(() => null)

          if (response && !response.ok) {
            console.warn('Backend favorite o‘chirish xatosi')
          }

          mutationVersion.current += 1

          setFavoriteRecords((prev) =>
            prev.filter(
              (f) => Number(f.id) !== Number(existing.id)
            )
          )

          dispatch({
            type: 'TOGGLE_FAVORITE',
            id: localId,
          })
        } else {
          const response = await fetch(
            `${API_URL}/favorites`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                user_id: userId,
                product_id: backendProduct.id,
              }),
            }
          ).catch(() => null)

          if (response && response.ok) {
            const json = await response.json()
            const newFavorite = json.data ?? json
            mutationVersion.current += 1
            setFavoriteRecords((prev) => [
              ...prev.filter(
                (f) =>
                  Number(f.product_id) !== Number(backendProduct.id)
              ),
              newFavorite,
            ])
          }

          dispatch({
            type: 'TOGGLE_FAVORITE',
            id: localId,
          })
        }
      } catch (error) {
        console.warn('Favorite sync warning:', error.message)
        dispatch({
          type: 'TOGGLE_FAVORITE',
          id: localId,
        })
      } finally {
        favoriteBusy.current.delete(localId)
      }
    },
    [
      backendProducts,
      favoriteRecords,
      getLocalProduct,
      getLocalId,
    ]
  )

  const value = useMemo(
    () => ({
      cart: state.cart,
      favorites: state.favorites,
      catalogCategories,
      catalogProducts,
      favoritesLoading,
      getBackendProduct,

      reloadFavorites: loadData,

      cartCount: state.cart.reduce(
        (sum, item) => sum + item.qty,
        0
      ),

      addToCart: (id, qty = 1) =>
        dispatch({ type: 'ADD', id, qty }),

      setQty: (id, qty) =>
        dispatch({ type: 'SET_QTY', id, qty }),

      removeFromCart: (id) =>
        dispatch({ type: 'REMOVE', id }),

      clearCart: () =>
        dispatch({ type: 'CLEAR' }),

      toggleFavorite,
      isFavorite: (product) =>
        state.favorites.some(
          (id) => Number(id) === Number(getLocalId(product))
        ),
    }),
    [
      state,
      catalogCategories,
      catalogProducts,
      favoritesLoading,
      loadData,
      toggleFavorite,
      getBackendProduct,
      getLocalId,
    ]
  )

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}
