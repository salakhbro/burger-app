import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ChevronLeft, HeartIcon } from '../../assets/icons'
import FoodImage from '../../components/FoodImage/FoodImage.jsx'
import ProductCard from '../../components/ProductCard/ProductCard.jsx'
import { categories, products } from '../../features/products.js'
import { formatPrice } from '../../features/formatPrice.js'
import { useStore } from '../../store/useStore.js'
import '../../assets/style/Product.css'

function ProductDetails({ product }) {
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const { addToCart, isFavorite, toggleFavorite } = useStore()
  const fav = isFavorite(product.id)

  const others = products.filter((p) => p.id !== product.id)
  const related = [
    ...others.filter((p) => p.category === product.category),
    ...others.filter((p) => p.category !== product.category),
  ].slice(0, 3)

  const categoryLabel = categories.find((c) => c.slug === product.category)?.label

  const onAdd = () => {
    addToCart(product.id, qty)
    setAdded(true)
  }

  return (
    <div className="container page">
      <Link to="/category/all" className="product__back">
        <ChevronLeft size={18} /> Back to menu
      </Link>

      <div className="product__layout">
        <div className="product__visual">
          <FoodImage product={product} />
        </div>

        <div>
          <p className="product__category">{categoryLabel}</p>
          <h1 className="product__name">{product.name}</h1>
          <p className="product__desc">{product.desc}</p>
          <p className="product__price">{formatPrice(product.price)}</p>

          <div className="product__buy">
            <div className="qty">
              <button type="button" aria-label="Decrease quantity" onClick={() => setQty((q) => Math.max(1, q - 1))}>
                −
              </button>
              <span aria-live="polite">{qty}</span>
              <button type="button" aria-label="Increase quantity" onClick={() => setQty((q) => q + 1)}>
                +
              </button>
            </div>
            <button type="button" className="btn btn--yellow" onClick={onAdd}>
              Add to cart
            </button>
            <button
              type="button"
              className={`heart-btn ${fav ? 'is-active' : ''}`}
              aria-label={fav ? 'Remove from favorites' : 'Add to favorites'}
              aria-pressed={fav}
              onClick={() => toggleFavorite(product.id)}
            >
              <HeartIcon size={16} filled={fav} />
            </button>
          </div>

          {added && (
            <p className="product__added" role="status">
              Added to cart. <Link to="/cart">View cart</Link>
            </p>
          )}
        </div>
      </div>

      <section className="related">
        <h2>You may also like</h2>
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
  const { id } = useParams()
  const product = products.find((p) => p.id === Number(id))

  if (!product) {
    return (
      <div className="container page empty">
        <h1 className="page__title">Dish not found</h1>
        <Link to="/category/all" className="btn btn--yellow">
          Back to menu
        </Link>
      </div>
    )
  }

  // key — boshqa taomga o'tganda qty/added holati qayta boshlanishi uchun
  return <ProductDetails key={product.id} product={product} />
}
