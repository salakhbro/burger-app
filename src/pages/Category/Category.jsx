import { useMemo } from 'react'
import { Link, Navigate, NavLink, useParams, useSearchParams } from 'react-router-dom'
import ProductCard from '../../components/ProductCard/ProductCard.jsx'
import { useStore } from '../../store/useStore.js'
import { useLanguage } from '../../i18n/useLanguage.js'
import '../../assets/style/Category.css'

export default function Category() {
  const { slug } = useParams()
  const [params] = useSearchParams()
  const { favorites, catalogCategories, catalogProducts } = useStore()
  const { t, localizeProduct } = useLanguage()

  const q = (params.get('q') || '').trim().toLowerCase()
  const isFavorites = slug === 'favorites'
  const current = catalogCategories.find((c) => c.slug === slug)

  const list = useMemo(
    () =>
      catalogProducts.filter((p) => {
        const inCategory = isFavorites ? favorites.includes(p.id) : slug === 'all' || p.category === slug
        const localized = localizeProduct(p)
        const matches = !q || localized.name.toLowerCase().includes(q) || localized.desc.toLowerCase().includes(q)
        return inCategory && matches
      }),
    [slug, q, isFavorites, favorites, localizeProduct, catalogProducts],
  )

  if (!isFavorites && !current) {
    return <Navigate to="/category/all" replace />
  }

  const title = isFavorites ? t('Favorites') : t(current.label)

  return (
    <div className="container page">
      <div className="category__head">
        <div>
          <h1 className="page__title">{title}</h1>
          <p className="category__sub">
            {q
              ? `${list.length} ${t('results for')} “${params.get('q')}”`
              : `${list.length} ${t('items')}`}
          </p>
        </div>
      </div>

      <nav className="category__tabs" aria-label={t('Categories')}>
        {catalogCategories.map((c) => (
          <NavLink
            key={c.slug}
            to={`/category/${c.slug}`}
            className={({ isActive }) => `category__tab${isActive ? ' is-active' : ''}`}
          >
            {t(c.label)}
          </NavLink>
        ))}
      </nav>

      {list.length > 0 ? (
        <div className="food-grid">
          {list.map((product) => (
            <ProductCard key={product.id} product={localizeProduct(product)} />
          ))}
        </div>
      ) : (
        <div className="empty">
          <p>{t(isFavorites ? 'You have no favorites yet. Tap the heart on any dish to save it.' : 'Nothing found.')}</p>
          <Link to="/category/all" className="btn btn--yellow">
            {t('Browse all food')}
          </Link>
        </div>
      )}
    </div>
  )
}