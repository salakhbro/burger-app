import { Navigate, useNavigate } from 'react-router-dom'
import { ShoppingBag, Heart, Home, LogOut, ShieldCheck } from 'lucide-react'
import { useStore } from '../../store/useStore.js'
import { useLanguage } from '../../i18n/useLanguage.js'
import '../../assets/style/Profile.css'

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem('burger-user') || 'null')
  } catch {
    return null
  }
}

export default function Profile() {
  const navigate = useNavigate()
  const { t } = useLanguage()
  const { cartCount, favorites } = useStore()
  const user = getStoredUser()

  if (!user) return <Navigate to="/login" replace />

  const handleLogout = () => {
    localStorage.removeItem('burger-user')
    localStorage.removeItem('burger-token')
    window.dispatchEvent(new Event('burger-auth-changed'))
    navigate('/login', { replace: true })
  }

  const isAdmin = user.role === 'admin'

  return (
    <section className="profile-page">
      <div className="profile-card">
        <div className="profile-card__avatar">
          {(user.name || 'U').charAt(0).toUpperCase()}
        </div>

        <h1 className="profile-card__name">{user.name}</h1>
        {user.email && <p className="profile-card__email">{user.email}</p>}

        <span className={`profile-card__role${isAdmin ? ' is-admin' : ''}`}>
          {t(isAdmin ? 'Admin' : 'Customer')}
        </span>

        <div className="profile-card__stats">
          <div>
            <strong>{cartCount}</strong>
            <span>{t('In cart')}</span>
          </div>
          <div>
            <strong>{favorites.length}</strong>
            <span>{t('Favorites')}</span>
          </div>
        </div>

        <div className="profile-card__actions">
          {isAdmin && (
            <button type="button" onClick={() => navigate('/admin')}>
              <ShieldCheck size={18} /> {t('Admin panel')}
            </button>
          )}
          <button type="button" onClick={() => navigate('/cart')}>
            <ShoppingBag size={18} /> {t('My cart')}
          </button>
          <button type="button" onClick={() => navigate('/category/favorites')}>
            <Heart size={18} /> {t('Favorites')}
          </button>
          <button type="button" onClick={() => navigate('/')}>
            <Home size={18} /> {t('Home')}
          </button>
        </div>

        <button
          type="button"
          className="profile-card__logout"
          onClick={handleLogout}
        >
          <LogOut size={18} /> {t('Log out')}
        </button>
      </div>
    </section>
  )
}