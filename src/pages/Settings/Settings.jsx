import { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { LogOut, Save, UserRound } from 'lucide-react'
import { useLanguage } from '../../i18n/useLanguage.js'
import '../../assets/style/Settings.css'

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem('burger-user') || 'null')
  } catch {
    return null
  }
}

export default function Settings() {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const user = getStoredUser()
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user?.id) return

    let cancelled = false

    fetch(`http://localhost:3000/api/customers/user/${user.id}`)
      .then(async (response) => {
        const text = await response.text()
        let data

        try {
          data = JSON.parse(text)
        } catch {
          data = text
        }

        if (!response.ok) {
          throw new Error(data?.message || data || 'Could not load settings')
        }

        if (!cancelled) {
          setPhone(data.phone || '')
          setAddress(data.address || '')
        }
      })
      .catch((loadError) => {
        console.error('Settings load error:', loadError)
        if (!cancelled) setError(loadError.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [user?.id])

  if (!user) return <Navigate to="/login" replace />
  if (user.role === 'admin') return <Navigate to="/admin" replace />

  const handleSave = async (event) => {
    event.preventDefault()
    setError('')
    setSaved(false)
    setSaving(true)

    try {
      const response = await fetch(
        `http://localhost:3000/api/customers/user/${user.id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            phone: phone.trim(),
            address: address.trim(),
          }),
        }
      )

      const text = await response.text()
      let data

      try {
        data = JSON.parse(text)
      } catch {
        data = text
      }

      if (!response.ok) {
        throw new Error(
          data?.message || data || 'Could not save account settings'
        )
      }

      setPhone(data.phone || '')
      setAddress(data.address || '')
      setSaved(true)
    } catch (saveError) {
      console.error('Settings save error:', saveError)
      setError(saveError.message)
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('burger-user')
    localStorage.removeItem('burger-token')
    window.dispatchEvent(new Event('burger-auth-changed'))
    navigate('/login', { replace: true })
  }

  return (
    <section className="settings-page">
      <div className="settings-layout">
        <aside className="settings-sidebar">
          <div className="settings-avatar">
            {(user.name || 'U').charAt(0).toUpperCase()}
          </div>
          <h1 className="settings-user-name">{user.name}</h1>
          {user.email && <p className="settings-user-email">{user.email}</p>}
          <span className="settings-role">{t('Customer')}</span>

          <nav className="settings-nav" aria-label={t('Account settings')}>
            <Link to="/customer">
              <UserRound size={18} />
              {t('Overview')}
            </Link>
            <span className="is-active" aria-current="page">
              <Save size={18} />
              {t('Delivery details')}
            </span>
          </nav>

          <button
            type="button"
            className="settings-logout"
            onClick={handleLogout}
          >
            <LogOut size={18} />
            {t('Log out')}
          </button>
        </aside>

        <main className="settings-content">
          <h2>{t('Delivery details')}</h2>
          <p className="settings-description">
            {t('Save a phone number and address for your orders.')}
          </p>

          <form className="settings-form" onSubmit={handleSave}>
            <label>
              {t('Phone number')}
              <input
                type="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                autoComplete="tel"
                placeholder="+998 90 123 45 67"
                minLength={7}
              />
            </label>

            <label>
              {t('Delivery address')}
              <input
                type="text"
                value={address}
                onChange={(event) => setAddress(event.target.value)}
                autoComplete="street-address"
                placeholder={t('Street, building, apartment')}
              />
            </label>

            {error && (
              <p className="settings-message is-error" role="alert">
                {t(error)}
              </p>
            )}
            {saved && (
              <p className="settings-message is-success" role="status">
                {t('Your account details have been saved.')}
              </p>
            )}

            <button type="submit" disabled={saving || loading}>
              <Save size={18} />
              {loading ? t('Loading...') : saving ? t('Saving...') : t('Save delivery details')}
            </button>
          </form>
        </main>
      </div>
    </section>
  )
}
