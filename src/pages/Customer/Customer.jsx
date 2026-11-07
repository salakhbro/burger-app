import { useEffect, useState, useCallback } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { ShoppingBag, Heart, Package, LogOut, Save, RotateCcw } from 'lucide-react'
import { useStore } from '../../store/useStore.js'
import { useLanguage } from '../../i18n/useLanguage.js'
import { formatPrice } from '../../features/formatPrice.js'
import { useToast } from '../../components/Toast/useToast.js'
import '../../assets/style/Customer.css'

const getStoredUser = () => {
    try {
        return JSON.parse(localStorage.getItem('burger-user') || 'null')
    } catch {
        return null
    }
}

export default function Customer() {
    const navigate = useNavigate()
    const { t, language } = useLanguage()
    const { cartCount, favorites, addToCart } = useStore()
    const { showSuccess, showError, showInfo } = useToast()

    const [user, setUser] = useState(getStoredUser)
    const [tab, setTab] = useState('overview')
    const [name, setName] = useState(user?.name || '')
    const [email, setEmail] = useState(user?.email || '')
    const [saved, setSaved] = useState(false)
    const [saving, setSaving] = useState(false)
    const [saveError, setSaveError] = useState('')
    const [orders, setOrders] = useState([])
    const [ordersLoading, setOrdersLoading] = useState(true)

    const loadUserOrders = useCallback(async () => {
        if (!user?.id) return
        setOrdersLoading(true)

        let backendOrders = []
        try {
            const response = await fetch(`http://localhost:3000/api/orders?userId=${user.id}`)
            if (response.ok) {
                const data = await response.json()
                if (Array.isArray(data)) backendOrders = data
            }
        } catch (err) {
            console.warn('Backend orders load warning:', err.message)
        }

        // Merge with local orders
        try {
            const local = JSON.parse(localStorage.getItem('burger-orders') || '[]')
            if (Array.isArray(local)) {
                const userLocal = local.filter((o) => Number(o.user_id) === Number(user.id))
                const existingIds = new Set(backendOrders.map((o) => o.id))
                for (const lo of userLocal) {
                    if (!existingIds.has(lo.id)) {
                        backendOrders.push(lo)
                    }
                }
            }
        } catch (e) {
            console.error(e)
        }

        backendOrders.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
        setOrders(backendOrders)
        setOrdersLoading(false)
    }, [user?.id])

    useEffect(() => {
        loadUserOrders()
    }, [loadUserOrders])

    if (!user) return <Navigate to="/login" replace />
    if (user.role === 'admin') return <Navigate to="/admin" replace />

    const handleSave = async (e) => {
        e.preventDefault()
        setSaveError('')
        setSaved(false)
        setSaving(true)

        try {
            let updatedUser = { ...user, name: name.trim(), email: email.trim() }

            try {
                const response = await fetch(`http://localhost:3000/api/users/${user.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: name.trim(),
                        email: email.trim(),
                    }),
                })
                if (response.ok) {
                    const data = await response.json()
                    updatedUser = { ...user, ...data }
                }
            } catch {
                console.warn('Offline profile update')
            }

            localStorage.setItem('burger-user', JSON.stringify(updatedUser))
            setUser(updatedUser)
            window.dispatchEvent(new Event('burger-auth-changed'))
            setSaved(true)
            showSuccess(t('Your account details have been saved.'))
        } catch (error) {
            console.error('Account update error:', error)
            setSaveError(error.message)
            showError(t(error.message))
        } finally {
            setSaving(false)
        }
    }

    const handleReorder = (order) => {
        if (!order.items || order.items.length === 0) return
        for (const it of order.items) {
            const prodId = it.product_id || it.product?.id
            if (prodId) {
                addToCart(prodId, it.quantity || 1)
            }
        }
        showSuccess(t('Added to cart.'))
        navigate('/cart')
    }

    const handleLogout = () => {
        localStorage.removeItem('burger-user')
        localStorage.removeItem('burger-token')
        localStorage.removeItem('adminToken')
        window.dispatchEvent(new Event('burger-auth-changed'))
        showInfo(t('Log out'))
        navigate('/login', { replace: true })
    }

    return (
        <section className="customer-page">
            <div className="customer-container">
                <aside className="customer-sidebar">
                    <div className="customer-profile">
                        <div className="customer-avatar">
                            {(user.name || 'U').charAt(0).toUpperCase()}
                        </div>
                        <h2>{user.name}</h2>
                        <p>{user.email || 'customer@burger.uz'}</p>
                    </div>

                    <nav className="customer-nav">
                        <button
                            type="button"
                            className={tab === 'overview' ? 'is-active' : ''}
                            onClick={() => setTab('overview')}
                        >
                            <Package size={18} /> {t('Overview')}
                        </button>
                        <button
                            type="button"
                            className={tab === 'orders' ? 'is-active' : ''}
                            onClick={() => setTab('orders')}
                        >
                            <ShoppingBag size={18} /> {t('My orders')} ({orders.length})
                        </button>
                        <button
                            type="button"
                            className={tab === 'settings' ? 'is-active' : ''}
                            onClick={() => setTab('settings')}
                        >
                            <Save size={18} /> {t('Account details')}
                        </button>
                        <button
                            type="button"
                            className="customer-logout"
                            onClick={handleLogout}
                        >
                            <LogOut size={18} /> {t('Log out')}
                        </button>
                    </nav>
                </aside>

                <main className="customer-main">
                    {tab === 'overview' && (
                        <>
                            <h1>{t('Welcome,')} {user.name}! 👋</h1>
                            <div className="customer-cards">
                                <button type="button" onClick={() => navigate('/cart')}>
                                    <ShoppingBag size={26} />
                                    <strong>{cartCount}</strong>
                                    <span>{t('In cart')}</span>
                                </button>
                                <button type="button" onClick={() => navigate('/category/favorites')}>
                                    <Heart size={26} />
                                    <strong>{favorites.length}</strong>
                                    <span>{t('Favorites')}</span>
                                </button>
                                <button type="button" onClick={() => setTab('orders')}>
                                    <Package size={26} />
                                    <strong>{orders.length}</strong>
                                    <span>{t('Orders')}</span>
                                </button>
                            </div>
                            <button
                                type="button"
                                className="customer-cta"
                                onClick={() => navigate('/category/all')}
                            >
                                {t('Order something tasty 🍔')}
                            </button>
                        </>
                    )}

                    {tab === 'orders' && (
                        <>
                            <h1>{t('My orders')}</h1>
                            {ordersLoading ? (
                                <p className="customer-muted">{t('Loading...')}</p>
                            ) : orders.length === 0 ? (
                                <p className="customer-muted">{t('You have no orders yet.')}</p>
                            ) : (
                                <ul className="customer-orders" style={{ listStyle: 'none', padding: 0 }}>
                                    {orders.map((o) => (
                                        <li
                                            key={o.id}
                                            style={{
                                                background: '#fff',
                                                padding: '16px 20px',
                                                borderRadius: 14,
                                                marginBottom: 12,
                                                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                flexWrap: 'wrap',
                                                gap: 12,
                                            }}
                                        >
                                            <div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                    <strong>#{o.id}</strong>
                                                    <span className="customer-status">
                                                        {t(
                                                            (o.status || 'pending').charAt(0).toUpperCase() +
                                                            (o.status || 'pending').slice(1)
                                                        )}
                                                    </span>
                                                </div>
                                                <span style={{ fontSize: 13, color: '#6b7280' }}>
                                                    {o.createdAt
                                                        ? new Date(o.createdAt).toLocaleDateString(language)
                                                        : ''}
                                                    {o.address ? ` • ${o.address}` : ''}
                                                </span>
                                            </div>

                                            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                                                {o.total_price != null && (
                                                    <strong style={{ fontSize: 16 }}>{formatPrice(o.total_price)}</strong>
                                                )}
                                                {o.items && o.items.length > 0 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleReorder(o)}
                                                        className="btn btn--yellow"
                                                        style={{ padding: '8px 14px', fontSize: 12 }}
                                                    >
                                                        <RotateCcw size={14} /> {t('Re-order')}
                                                    </button>
                                                )}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </>
                    )}

                    {tab === 'settings' && (
                        <>
                            <h1>{t('Account details')}</h1>
                            <form className="customer-form" onSubmit={handleSave}>
                                <label>
                                    {t('Name')}
                                    <input
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </label>
                                <label>
                                    {t('Email')}
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </label>
                                {saveError && (
                                    <p className="customer-error" role="alert">
                                        {t(saveError)}
                                    </p>
                                )}
                                <button type="submit" disabled={saving}>
                                    <Save size={18} /> {saving ? t('Saving...') : saved ? t('Saved ✓') : t('Save changes')}
                                </button>
                            </form>
                        </>
                    )}
                </main>
            </div>
        </section>
    )
}
