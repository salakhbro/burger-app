import { Link } from 'react-router-dom'
import { HeartIcon } from '../../assets/icons'
import FoodImage from '../FoodImage/FoodImage.jsx'
import { formatPrice } from '../../features/formatPrice.js'
import { useStore } from '../../store/useStore.js'
import '../../assets/style/Product.css'

export default function ProductCard({ product }) {
  const { isFavorite, toggleFavorite } = useStore()
  const fav = isFavorite(product.id)

  return (
    <article className="food-card">
      <Link to={`/product/${product.id}`} className="food-card__link">
        <div className="food-card__img">
          <FoodImage product={product} />
        </div>
        <h3>{product.name}</h3>
        <p>{product.desc}</p>
      </Link>
      <div className="food-card__bottom">
        <strong className="food-card__price">{formatPrice(product.price)}</strong>
        <button
          type="button"
          className={`heart-btn ${fav ? 'is-active' : ''}`}
          aria-label={fav ? `Remove ${product.name} from favorites` : `Add ${product.name} to favorites`}
          aria-pressed={fav}
          onClick={() => toggleFavorite(product.id)}
        >
          <HeartIcon size={16} filled={fav} />
        </button>
      </div>
    </article>
  )
}
