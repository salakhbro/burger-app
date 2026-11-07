import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import {
  BagIcon,
  HeartIcon,
  MenuIcon,
  SearchIcon,
} from '../../assets/icons'
import { UserRound, Settings, LogOut } from 'lucide-react'
import { useStore } from '../../store/useStore.js'
import { useLanguage } from '../../i18n/useLanguage.js'
import LanguageSwitcher from '../../i18n/LanguageSwitcher.jsx'
import '../../assets/style/Header.css'

const links = [
  { to: '/', label: 'Home' },
  { to: '/#menu', label: 'Menu' },
  { to: '/#delivery', label: 'Delivery' },
  { to: '/category/all', label: 'Shop' },
  { to: '#contact', label: 'Contact' },
]

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem('burger-user') || 'null')
  } catch {
    return null
  }
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [profileOpen, setProfileOpen] = useState(false)
  const [user, setUser] = useState(getStoredUser)

  const profileRef = useRef(null)

  const { cartCount, favorites } = useStore()
  const { t } = useLanguage()
  const navigate = useNavigate()
  const location = useLocation()

  const username = user?.name || ''

  // Sahifa o'zgarganda user'ni qayta o'qiymiz (login/register dan keyin yangilanadi)
  useEffect(() => {
    setUser(getStoredUser())
    setProfileOpen(false)
  }, [location.pathname])

  // Boshqa tabda login/logout bo'lsa ham yangilanadi
  useEffect(() => {
    const onStorage = () => setUser(getStoredUser())
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  // Dropdown tashqarisini bosganda yopiladi
  useEffect(() => {
    const onClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  const closeMenu = () => setMenuOpen(false)

  const onSearch = (e) => {
    e.preventDefault()
    const q = query.trim()

    navigate(
      q ? `/category/all?q=${encodeURIComponent(q)}` : '/category/all'
    )

    setSearchOpen(false)
    setQuery('')
    closeMenu()
  }

  const handleUserClick = () => {
    if (!user) {
      navigate('/login')
      return
    }
    setProfileOpen((open) => !open)
  }

  const handleLogout = () => {
    localStorage.removeItem('burger-user')
    localStorage.removeItem('burger-token')
    window.dispatchEvent(new Event('burger-auth-changed'))
    setUser(null)
    setProfileOpen(false)
    closeMenu()
    navigate('/login')
  }

  const goToProfile = () => {
    setProfileOpen(false)
    navigate(user?.role === 'admin' ? '/admin' : '/customer')
  }

  const goToSettings = () => {
    setProfileOpen(false)
    navigate('/settings')
  }

  return (
    <header className="header">
      <div className="container header__inner">
        <Link to="/" className="header__logo" onClick={closeMenu}>
          Burger
        </Link>

        <nav
          className={`header__nav ${menuOpen ? 'is-open' : ''}`}
          aria-label={t('Main')}
        >
          {links.map((link) => (
            <Link key={link.label} to={link.to} onClick={closeMenu}>
              {t(link.label)}
            </Link>
          ))}
        </nav>

        <div className="header__actions">
          <LanguageSwitcher />
          <button
            type="button"
            className={`icon-btn${searchOpen ? ' is-active' : ''}`}
            aria-label={t('Search')}
            aria-expanded={searchOpen}
            onClick={() => setSearchOpen((open) => !open)}
          >
            <SearchIcon />
          </button>

          <Link
            to="/category/favorites"
            className={`icon-btn${location.pathname === '/category/favorites' ? ' is-active' : ''}`}
            aria-label={`${t('Favorites')} (${favorites.length})`}
          >
            <HeartIcon />
            {favorites.length > 0 && (
              <span className="icon-btn__badge">{favorites.length}</span>
            )}
          </Link>

          <Link
            to="/cart"
            className={`icon-btn${location.pathname === '/cart' ? ' is-active' : ''}`}
            aria-label={`${t('Cart')} (${cartCount})`}
          >
            <BagIcon />
            {cartCount > 0 && (
              <span className="icon-btn__badge">{cartCount}</span>
            )}
          </Link>

          {/* Profile menu */}
          <div className="profile-menu-container" ref={profileRef}>
            <button
              type="button"
              className={`icon-btn profile-trigger${profileOpen ? ' is-active' : ''}`}
              aria-label={t('User profile')}
              aria-expanded={profileOpen}
              onClick={handleUserClick}
            >
              {username ? (
                <span className="header-avatar">
                  {username.charAt(0).toUpperCase()}
                </span>
              ) : (
                <UserRound size={22} />
              )}
            </button>

            {profileOpen && user && (
              <div className="profile-dropdown">
                <div className="profile-user">
                  <div className="profile-avatar">
                    {username.charAt(0).toUpperCase()}
                  </div>

                  <div className="profile-user-info">
                    <strong>{username}</strong>
                    <span>{t(user.role === 'admin' ? 'Admin' : 'Customer')}</span>
                  </div>
                </div>

                <div className="profile-divider" />

                <button
                  type="button"
                  className="profile-option"
                  onClick={goToProfile}
                >
                  <UserRound size={18} />
                  <span>{t('Profile')}</span>
                </button>

                <button
                  type="button"
                  className="profile-option"
                  onClick={goToSettings}
                >
                  <Settings size={18} />
                  <span>{t('Settings')}</span>
                </button>

                <div className="profile-divider" />

                <button
                  type="button"
                  className="profile-option profile-logout"
                  onClick={handleLogout}
                >
                  <LogOut size={18} />
                  <span>{t('Log out')}</span>
                </button>
              </div>
            )}
          </div>

          <button
            type="button"
            className={`icon-btn header__burger${menuOpen ? ' is-active' : ''}`}
            aria-label={t('Menu')}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <MenuIcon />
          </button>
        </div>
      </div>

      {searchOpen && (
        <div className="header__search">
          <form
            className="container header__form"
            onSubmit={onSearch}
            role="search"
          >
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('Search food')}
              aria-label={t('Search food')}
              autoFocus
            />

            <button type="submit" className="btn btn--yellow">
              {t('Search')}
            </button>
          </form>
        </div>
      )}
    </header>
  )
}