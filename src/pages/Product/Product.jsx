import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ChevronLeft, HeartIcon } from '../../assets/icons'
import FoodImage from '../../components/FoodImage/FoodImage.jsx'
import ProductCard from '../../components/ProductCard/ProductCard.jsx'
import { formatPrice } from '../../features/formatPrice.js'
import { useStore } from '../../store/useStore.js'
import { useLanguage } from '../../i18n/useLanguage.js'
import { useToast } from '../../components/Toast/useToast.js'
import '../../assets/style/Product.css'

function ProductDetails({ product }) {
  const { t, localizeProduct } = useLanguage()
  const { showSuccess, showInfo } = useToast()
  const {
    addToCart,
    catalogCategories,
    catalogProducts,
    isFavorite,
    toggleFavorite,
    favoritesLoading,
    getBackendProduct,
  } = useStore()
  product = localizeProduct(product)
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const [favoriteError, setFavoriteError] = useState('')

  const backendProduct = getBackendProduct(product)
  product = {
    ...product,
    price: backendProduct?.price ?? product.price,
  }
  const fav = isFavorite(product.id)

  const others = catalogProducts.filter((p) => p.id !== product.id)

  const related = [
    ...others.filter((p) => p.category === product.category),
    ...others.filter((p) => p.category !== product.category),
  ].slice(0, 3)

  const categoryLabel = t(
    catalogCategories.find((c) => c.slug === product.category)?.label || ''
  )

  const onAdd = () => {
    addToCart(product.id, qty)
    setAdded(true)
    showSuccess(`${qty}x ${product.name} — ${t('Added to cart.')}`)
  }

  const onToggleFavorite = async () => {
    setFavoriteError('')

    try {
      await toggleFavorite(product.id)
      if (!fav) {
        showSuccess(`${product.name} — ${t('Added to favorites') || 'Sevimlilarga qo‘shildi'}`)
      } else {
        showInfo(`${product.name} — ${t('Removed from favorites') || 'Sevimlilardan olindi'}`)
      }
    } catch (error) {
      setFavoriteError(t(error.message))
    }
  }

  return (
    <div className="container page">
      <Link to="/category/all" className="product__back">
        <ChevronLeft size={18} />
        {t('Back to menu')}
      </Link>

      <div className="product__layout">
        <div className="product__visual">
          <FoodImage product={product} />
        </div>

        <div className="product__info">
          <p className="product__category">{categoryLabel}</p>

          <h1 className="product__name">{product.name}</h1>

          <p className="product__desc">{product.desc}</p>

          <p className="product__price">
            {formatPrice(product.price)}
          </p>

          <div className="product__buy">
            <div className="qty">
              <button
                type="button"
                aria-label={t('Decrease quantity')}
                onClick={() => setQty((q) => Math.max(1, q - 1))}
              >
                −
              </button>

              <span aria-live="polite">{qty}</span>

              <button
                type="button"
                aria-label={t('Increase quantity')}
                onClick={() => setQty((q) => q + 1)}
              >
                +
              </button>
            </div>

            <button
              type="button"
              className="btn btn--yellow product__add-btn"
              onClick={onAdd}
            >
              {t('Add to cart')}
            </button>

            <button
              type="button"
              className={`heart-btn ${fav ? 'is-active' : ''}`}
              aria-label={
                t(fav ? 'Remove from favorites' : 'Add to favorites')
              }
              aria-pressed={fav}
              onClick={onToggleFavorite}
              disabled={favoritesLoading}
            >
              <HeartIcon size={18} filled={fav} />
            </button>
          </div>

          {favoriteError && (
            <p className="review-message error" role="alert">
              {favoriteError}
            </p>
          )}

          {added && (
            <p className="product__added" role="status">
              {t('Added to cart.')} <Link to="/cart">{t('View cart')}</Link>
            </p>
          )}
        </div>
      </div>

      <section className="related">
        <h2>{t('You may also like')}</h2>

        <div className="food-grid">
          {related.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  )
}

export default function Product() {
  const { t } = useLanguage()
  const { catalogProducts } = useStore()
  const { id } = useParams()

  const product = catalogProducts.find((p) => p.id === Number(id))

  if (!product) {
    return (
      <div className="container page empty">
        <h1 className="page__title">{t('Dish not found')}</h1>

        <Link to="/category/all" className="btn btn--yellow">
          {t('Back to menu')}
        </Link>
      </div>
    )
  }

  return <ProductDetails key={product.id} product={product} />
}