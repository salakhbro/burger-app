import { useState } from 'react'
import { Link } from 'react-router-dom'
import { TrashIcon } from '../../assets/icons'
import FoodImage from '../../components/FoodImage/FoodImage.jsx'
import { products } from '../../features/products.js'
import { formatPrice } from '../../features/formatPrice.js'
import { useStore } from '../../store/useStore.js'
import '../../assets/style/Cart.css'

const DELIVERY_FEE = 1.5

export default function Cart() {
  const { cart, setQty, removeFromCart, clearCart } = useStore()
  const [ordered, setOrdered] = useState(false)

  const items = cart
    .map((item) => ({ ...item, product: products.find((p) => p.id === item.id) }))
    .filter((item) => item.product)

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.qty, 0)
  const delivery = items.length ? DELIVERY_FEE : 0
  const total = subtotal + delivery

  const checkout = () => {
    clearCart()
    setOrdered(true)
  }

  if (ordered) {
    return (
      <div className="container page empty">
        <h1 className="page__title">Order placed 🎉</h1>
        <p>Hot food will reach you in about 60 minutes.</p>
        <Link to="/" className="btn btn--yellow">
          Back to home
        </Link>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="container page empty">
        <h1 className="page__title">Your cart is empty</h1>
        <p>Add something tasty from the menu.</p>
        <Link to="/category/all" className="btn btn--yellow">
          Browse food
        </Link>
      </div>
    )
  }

  return (
    <div className="container page">
      <h1 className="page__title">Cart</h1>

      <div className="cart__layout">
        <ul className="cart__list">
          {items.map(({ product, qty }) => (
            <li key={product.id} className="cart-item">
              <Link to={`/product/${product.id}`} className="cart-item__img">
                <FoodImage product={product} />
              </Link>
              <div>
                <p className="cart-item__name">{product.name}</p>
                <p className="cart-item__price">{formatPrice(product.price)} each</p>
              </div>
              <div className="qty">
                <button type="button" aria-label={`Decrease ${product.name}`} onClick={() => setQty(product.id, qty - 1)}>
                  −
                </button>
                <span>{qty}</span>
                <button type="button" aria-label={`Increase ${product.name}`} onClick={() => setQty(product.id, qty + 1)}>
                  +
                </button>
              </div>
              <p className="cart-item__total">{formatPrice(product.price * qty)}</p>
              <button
                type="button"
                className="cart-item__remove"
                aria-label={`Remove ${product.name}`}
                onClick={() => removeFromCart(product.id)}
              >
                <TrashIcon size={18} />
              </button>
            </li>
          ))}
        </ul>

        <aside className="summary">
          <h2>Order summary</h2>
          <div className="summary__row">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="summary__row">
            <span>Delivery</span>
            <span>{formatPrice(delivery)}</span>
          </div>
          <div className="summary__row summary__row--total">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
          <button type="button" className="btn btn--yellow" onClick={checkout}>
            Place order
          </button>
          <button type="button" className="btn btn--ghost" onClick={clearCart}>
            Clear cart
          </button>
        </aside>
      </div>
    </div>
  )
}
