import { useMemo } from 'react'
import { Link, Navigate, NavLink, useParams, useSearchParams } from 'react-router-dom'
import ProductCard from '../../components/ProductCard/ProductCard.jsx'
import { categories, products } from '../../features/products.js'
import { useStore } from '../../store/useStore.js'
import '../../assets/style/Category.css'

export default function Category() {
  const { slug } = useParams()
  const [params] = useSearchParams()
  const { favorites } = useStore()

  const q = (params.get('q') || '').trim().toLowerCase()
  const isFavorites = slug === 'favorites'
  const current = categories.find((c) => c.slug === slug)

  const list = useMemo(
    () =>
      products.filter((p) => {
        const inCategory = isFavorites ? favorites.includes(p.id) : slug === 'all' || p.category === slug
        const matches = !q || p.name.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q)
        return inCategory && matches
      }),
    [slug, q, isFavorites, favorites],
  )

  if (!isFavorites && !current) {
    return <Navigate to="/category/all" replace />
  }

  const title = isFavorites ? 'Favorites' : current.label

  return (
    <div className="container page">
      <div className="category__head">
        <div>
          <h1 className="page__title">{title}</h1>
          <p className="category__sub">
            {q ? `${list.length} result(s) for “${params.get('q')}”` : `${list.length} item(s)`}
          </p>
        </div>
      </div>

      <nav className="category__tabs" aria-label="Categories">
        {categories.map((c) => (
          <NavLink
            key={c.slug}
            to={`/category/${c.slug}`}
            className={({ isActive }) => `category__tab${isActive ? ' is-active' : ''}`}
          >
            {c.label}
          </NavLink>
        ))}
      </nav>

      {list.length > 0 ? (
        <div className="food-grid">
          {list.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="empty">
          <p>{isFavorites ? 'You have no favorites yet. Tap the heart on any dish to save it.' : 'Nothing found.'}</p>
          <Link to="/category/all" className="btn btn--yellow">
            Browse all food
          </Link>
        </div>
      )}
    </div>
  )
}
