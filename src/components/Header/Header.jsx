import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { BagIcon, HeartIcon, MenuIcon, SearchIcon } from '../../assets/icons'
import { useStore } from '../../store/useStore.js'
import '../../assets/style/Header.css'

const links = [
  { to: '/', label: 'Home' },
  { to: '/#menu', label: 'Menu' },
  { to: '/#delivery', label: 'Delivery' },
  { to: '/category/all', label: 'Shop' },
  { to: '#contact', label: 'Contact' },
]

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const { cartCount, favorites } = useStore()
  const navigate = useNavigate()

  const closeMenu = () => setMenuOpen(false)

  const onSearch = (e) => {
    e.preventDefault()
    const q = query.trim()
    navigate(q ? `/category/all?q=${encodeURIComponent(q)}` : '/category/all')
    setSearchOpen(false)
    setQuery('')
    closeMenu()
  }

  return (
    <header className="header">
      <div className="container header__inner">
        <Link to="/" className="header__logo" onClick={closeMenu}>
          Burger
        </Link>

        <nav className={`header__nav ${menuOpen ? 'is-open' : ''}`} aria-label="Main">
          {links.map((link) => (
            <Link key={link.label} to={link.to} onClick={closeMenu}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="header__actions">
          <button
            type="button"
            className="icon-btn"
            aria-label="Search"
            aria-expanded={searchOpen}
            onClick={() => setSearchOpen((open) => !open)}
          >
            <SearchIcon />
          </button>
          <Link to="/category/favorites" className="icon-btn" aria-label={`Favorites (${favorites.length})`}>
            <HeartIcon />
            {favorites.length > 0 && <span className="icon-btn__badge">{favorites.length}</span>}
          </Link>
          <Link to="/cart" className="icon-btn" aria-label={`Cart (${cartCount})`}>
            <BagIcon />
            {cartCount > 0 && <span className="icon-btn__badge">{cartCount}</span>}
          </Link>
          <button
            type="button"
            className="icon-btn header__burger"
            aria-label="Menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <MenuIcon />
          </button>
        </div>
      </div>

      {searchOpen && (
        <div className="header__search">
          <form className="container header__form" onSubmit={onSearch} role="search">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search food"
              aria-label="Search food"
              autoFocus
            />
            <button type="submit" className="btn btn--yellow">
              Search
            </button>
          </form>
        </div>
      )}
    </header>
  )
}
