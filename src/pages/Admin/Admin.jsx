import { useCallback, useEffect, useState } from 'react'
import {
  LayoutDashboard, ShoppingBag, Users, DollarSign,
  Clock, Search, RefreshCw, Package, Plus, Pencil, Trash2, X as CloseIcon,
  LogOut, Menu, X
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../../i18n/useLanguage.js'
import { formatPrice } from '../../features/formatPrice.js'
import { useToast } from '../../components/Toast/useToast.js'
import LanguageSwitcher from '../../i18n/LanguageSwitcher.jsx'
import {
  createProduct,
  deleteProduct,
  getCategories,
  getProducts,
  updateProduct,
} from '../../api/api.js'
import '../../assets/style/Admin.css'

const API = 'http://localhost:3000/api'
const EMPTY_PRODUCT = {
  name: '',
  description: '',
  price: '',
  image: '',
  stock: '0',
  category_id: '',
}

export default function Admin() {
  const navigate = useNavigate()
  const { t } = useLanguage()
  const { showSuccess, showError, showInfo } = useToast()

  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sidebar, setSidebar] = useState(false)
  const [currentTab, setCurrentTab] = useState('dashboard')
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [productsLoading, setProductsLoading] = useState(false)
  const [productSaving, setProductSaving] = useState(false)
  const [productForm, setProductForm] = useState(EMPTY_PRODUCT)
  const [editingProductId, setEditingProductId] = useState(null)

  const loadProducts = useCallback(async () => {
    try {
      setProductsLoading(true)
      const [productList, categoryList] = await Promise.all([
        getProducts(),
        getCategories(),
      ])
      setProducts(Array.isArray(productList) ? productList : [])
      setCategories(Array.isArray(categoryList) ? categoryList : [])
    } catch (error) {
      showError(error.message || t('Failed to load products!'))
    } finally {
      setProductsLoading(false)
    }
  }, [showError, t])

  const loadOrders = useCallback(async () => {
    try {
      setLoading(true)
      let list = []
      try {
        const response = await fetch(`${API}/orders`)
        if (response.ok) {
          const data = await response.json()
          list = Array.isArray(data) ? data : []
        }
      } catch (e) {
        console.warn('Backend orders fetch failed, reading local backup:', e.message)
      }

      // Merge with any local orders from localStorage
      try {
        const local = JSON.parse(localStorage.getItem('burger-orders') || '[]')
        if (Array.isArray(local) && local.length > 0) {
          const existingIds = new Set(list.map((o) => o.id))
          for (const lo of local) {
            if (!existingIds.has(lo.id)) {
              list.push(lo)
            }
          }
        }
      } catch (err) {
        console.error(err)
      }

      setOrders(list)
    } catch (error) {
      console.error(error)
      showError(t('Failed to load orders!'))
    } finally {
      setLoading(false)
    }
  }, [t, showError])

  useEffect(() => {
    loadOrders()
  }, [loadOrders])

  useEffect(() => {
    if (currentTab === 'products') loadProducts()
  }, [currentTab, loadProducts])

  const resetProductForm = () => {
    setProductForm(EMPTY_PRODUCT)
    setEditingProductId(null)
  }

  const editProduct = (product) => {
    setProductForm({
      name: product.name || '',
      description: product.description || '',
      price: String(product.price ?? ''),
      image: product.image || '',
      stock: String(product.stock ?? 0),
      category_id: String(product.category_id ?? ''),
    })
    setEditingProductId(product.id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const saveProduct = async (event) => {
    event.preventDefault()
    const payload = {
      ...productForm,
      price: Number(productForm.price),
      stock: Number(productForm.stock),
      category_id: Number(productForm.category_id),
    }

    try {
      setProductSaving(true)
      if (editingProductId === null) {
        await createProduct(payload)
        showSuccess(t('Product created successfully.'))
      } else {
        await updateProduct(editingProductId, payload)
        showSuccess(t('Product updated successfully.'))
      }
      resetProductForm()
      await loadProducts()
    } catch (error) {
      showError(error.message || t('Could not save product.'))
    } finally {
      setProductSaving(false)
    }
  }

  const removeProduct = async (product) => {
    if (!window.confirm(`${t('Delete product')} "${product.name}"?`)) return
    try {
      await deleteProduct(product.id)
      setProducts((current) => current.filter((item) => item.id !== product.id))
      if (editingProductId === product.id) resetProductForm()
      showSuccess(t('Product deleted successfully.'))
    } catch (error) {
      showError(error.message || t('Could not delete product.'))
    }
  }

  const updateStatus = async (id, status) => {
    try {
      try {
        await fetch(`${API}/orders/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status }),
        })
      } catch {
        // offline mode
      }

      // Also update in state & localStorage
      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, status } : o))
      )

      try {
        const local = JSON.parse(localStorage.getItem('burger-orders') || '[]')
        const updatedLocal = local.map((o) => (o.id === id ? { ...o, status } : o))
        localStorage.setItem('burger-orders', JSON.stringify(updatedLocal))
      } catch (e) {
        console.error(e)
      }

      showSuccess(`${t('Status')}: #${id} ➔ ${t(status.charAt(0).toUpperCase() + status.slice(1))}`)
    } catch {
      showError(t('Could not update status!'))
    }
  }

  const filtered = orders.filter((order) => {
    const matchesSearch = `${order.user?.name || ''} ${order.user?.email || ''} ${order.id} ${order.address || ''}`
      .toLowerCase()
      .includes(search.toLowerCase())

    const matchesStatus =
      statusFilter === 'all' || order.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const revenue = orders
    .filter((o) => o.status === 'completed')
    .reduce((sum, o) => sum + Number(o.total_price || 0), 0)

  const pending = orders.filter((o) => o.status === 'pending').length
  const customers = new Set(orders.map((o) => o.user_id)).size

  const logout = () => {
    localStorage.removeItem('burger-user')
    localStorage.removeItem('burger-token')
    localStorage.removeItem('adminToken')
    window.dispatchEvent(new Event('burger-auth-changed'))
    showInfo(t('Log out'))
    navigate('/login', { replace: true })
  }

  return (
    <div className="admin">
      <aside className={`admin-sidebar ${sidebar ? 'active' : ''}`}>
        <div className="admin-logo">
          <span>🍔</span> Burger<span className="yellow">Admin</span>
          <button type="button" onClick={() => setSidebar(false)}>
            <X />
          </button>
        </div>

        <p className="sidebar-label">{t('MENU')}</p>
        <button
          type="button"
          className={`sidebar-link ${currentTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => {
            setCurrentTab('dashboard')
            setSidebar(false)
          }}
          style={{ width: '100%', border: 0, background: 'transparent', textAlign: 'left', font: 'inherit', cursor: 'pointer' }}
        >
          <LayoutDashboard size={18} /> {t('Dashboard')}
        </button>
        <button
          type="button"
          className={`sidebar-link ${currentTab === 'orders' ? 'active' : ''}`}
          onClick={() => {
            setCurrentTab('orders')
            setSidebar(false)
          }}
          style={{ width: '100%', border: 0, background: 'transparent', textAlign: 'left', font: 'inherit', cursor: 'pointer' }}
        >
          <ShoppingBag size={18} /> {t('Orders')} ({orders.length})
        </button>
        <button
          type="button"
          className={`sidebar-link ${currentTab === 'products' ? 'active' : ''}`}
          onClick={() => {
            setCurrentTab('products')
            setSidebar(false)
          }}
          style={{ width: '100%', border: 0, background: 'transparent', textAlign: 'left', font: 'inherit', cursor: 'pointer' }}
        >
          <Package size={18} /> {t('Products')} ({products.length})
        </button>

        <button type="button" className="admin-logout" onClick={logout}>
          <LogOut size={18} /> {t('Log out')}
        </button>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <button
            type="button"
            className="mobile-menu"
            onClick={() => setSidebar(true)}
          >
            <Menu />
          </button>
          <div>
            <h2>{currentTab === 'products' ? t('Products') : currentTab === 'orders' ? t('Orders') : t('Dashboard')}</h2>
            <p>{t('Welcome to Burger Admin Panel')}</p>
          </div>
          <button
            type="button"
            className="refresh-btn"
            onClick={() => {
              if (currentTab === 'products') loadProducts()
              else loadOrders()
              showInfo(t('Refresh'))
            }}
          >
            <RefreshCw size={18} /> {t('Refresh')}
          </button>
          <LanguageSwitcher className="language-switcher--light" />
        </header>

        <section className="admin-stats">
          <div className="stat-card">
            <div className="stat-icon orange">
              <ShoppingBag />
            </div>
            <p>{t('Total Orders')}</p>
            <h2>{orders.length}</h2>
          </div>

          <div className="stat-card">
            <div className="stat-icon blue">
              <Users />
            </div>
            <p>{t('Customers')}</p>
            <h2>{customers}</h2>
          </div>

          <div className="stat-card">
            <div className="stat-icon purple">
              <Clock />
            </div>
            <p>{t('Pending Orders')}</p>
            <h2>{pending}</h2>
          </div>

          <div className="stat-card">
            <div className="stat-icon green">
              <DollarSign />
            </div>
            <p>{t('Completed Revenue')}</p>
            <h2>{formatPrice(revenue)}</h2>
          </div>
        </section>

        {currentTab === 'products' ? (
          <section className="orders-section products-section">
            <div className="orders-heading">
              <div>
                <h2>{editingProductId === null ? t('Add a product') : t('Edit product')}</h2>
                <p>{t('Product changes are saved to the backend database.')}</p>
              </div>
              {editingProductId !== null && (
                <button type="button" className="product-cancel-btn" onClick={resetProductForm}>
                  <CloseIcon size={16} /> {t('Cancel')}
                </button>
              )}
            </div>

            <form className="product-form" onSubmit={saveProduct}>
              <label>
                {t('Product name')}
                <input
                  required
                  minLength="2"
                  maxLength="150"
                  value={productForm.name}
                  onChange={(event) => setProductForm({ ...productForm, name: event.target.value })}
                />
              </label>
              <label>
                {t('Category')}
                <select
                  required
                  value={productForm.category_id}
                  onChange={(event) => setProductForm({ ...productForm, category_id: event.target.value })}
                >
                  <option value="">{t('Select category')}</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
              </label>
              <label>
                {t('Price')}
                <input
                  required
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={productForm.price}
                  onChange={(event) => setProductForm({ ...productForm, price: event.target.value })}
                />
              </label>
              <label>
                {t('Stock')}
                <input
                  required
                  type="number"
                  min="0"
                  step="1"
                  value={productForm.stock}
                  onChange={(event) => setProductForm({ ...productForm, stock: event.target.value })}
                />
              </label>
              <label className="product-form__wide">
                {t('Description')}
                <textarea
                  maxLength="1000"
                  rows="3"
                  value={productForm.description}
                  onChange={(event) => setProductForm({ ...productForm, description: event.target.value })}
                />
              </label>
              <label className="product-form__wide">
                {t('Image URL')}
                <input
                  type="url"
                  maxLength="500"
                  value={productForm.image}
                  onChange={(event) => setProductForm({ ...productForm, image: event.target.value })}
                  placeholder="https://..."
                />
              </label>
              <div className="product-form__actions product-form__wide">
                <button type="submit" className="product-save-btn" disabled={productSaving || categories.length === 0}>
                  {editingProductId === null ? <Plus size={17} /> : <Pencil size={16} />}
                  {productSaving ? t('Saving...') : editingProductId === null ? t('Create product') : t('Save changes')}
                </button>
              </div>
            </form>

            <div className="orders-heading product-list-heading">
              <div>
                <h2>{t('Product list')}</h2>
                <p>{t('Products')} ({products.length})</p>
              </div>
              <button type="button" className="refresh-btn" onClick={loadProducts} disabled={productsLoading}>
                <RefreshCw size={18} /> {t('Refresh')}
              </button>
            </div>

            {productsLoading ? (
              <div className="admin-loading">{t('Loading products...')}</div>
            ) : (
              <div className="orders-table-wrap">
                <table className="orders-table products-table">
                  <thead>
                    <tr>
                      <th>{t('Product')}</th>
                      <th>{t('Category')}</th>
                      <th>{t('Price')}</th>
                      <th>{t('Stock')}</th>
                      <th>{t('Actions')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id}>
                        <td>
                          <div className="product-name-cell">
                            {product.image && <img src={product.image} alt="" />}
                            <strong>{product.name}</strong>
                          </div>
                        </td>
                        <td>{product.category?.name || categories.find((category) => category.id === product.category_id)?.name || '—'}</td>
                        <td>{formatPrice(product.price)}</td>
                        <td>{product.stock}</td>
                        <td>
                          <div className="product-actions">
                            <button type="button" onClick={() => editProduct(product)} aria-label={t('Edit product')}>
                              <Pencil size={16} />
                            </button>
                            <button type="button" onClick={() => removeProduct(product)} aria-label={t('Delete product')}>
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {products.length === 0 && (
                      <tr><td colSpan="5" className="empty-orders">{t('No products found')}</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        ) : <section className="orders-section">
          <div className="orders-heading">
            <div>
              <h2>{t('Recent Orders')}</h2>
              <p>{t('Manage your customer orders')}</p>
            </div>

            <div className="admin-search">
              <Search size={18} />
              <input
                placeholder={t('Search customer...')}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Quick Filter Tabs */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
            {['all', 'pending', 'preparing', 'delivering', 'completed', 'cancelled'].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '20px',
                  border: '1px solid ' + (statusFilter === st ? '#ffb800' : '#e5e7eb'),
                  background: statusFilter === st ? '#ffb800' : '#fff',
                  color: statusFilter === st ? '#1f1f1f' : '#6b7280',
                  fontWeight: 600,
                  fontSize: 12,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                {st === 'all' ? t('All') : t(st.charAt(0).toUpperCase() + st.slice(1))}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="admin-loading">{t('Loading orders...')}</div>
          ) : (
            <div className="orders-table-wrap">
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>{t('Order ID')}</th>
                    <th>{t('Customer')}</th>
                    <th>{t('Email')}</th>
                    <th>{t('Address')}</th>
                    <th>{t('Total')}</th>
                    <th>{t('Status')}</th>
                  </tr>
                </thead>

                <tbody>
                  {filtered.map((order) => (
                    <tr key={order.id}>
                      <td>
                        <strong>#{order.id}</strong>
                      </td>
                      <td>{order.user?.name || 'Customer'}</td>
                      <td>{order.user?.email || '-'}</td>
                      <td>{order.address}</td>
                      <td>{formatPrice(order.total_price)}</td>
                      <td>
                        <select
                          className={`status-select ${order.status}`}
                          value={order.status}
                          onChange={(e) =>
                            updateStatus(order.id, e.target.value)
                          }
                        >
                          <option value="pending">{t('Pending')}</option>
                          <option value="confirmed">{t('Confirmed')}</option>
                          <option value="preparing">{t('Preparing')}</option>
                          <option value="delivering">{t('Delivering')}</option>
                          <option value="completed">{t('Completed')}</option>
                          <option value="cancelled">{t('Cancelled')}</option>
                        </select>
                      </td>
                    </tr>
                  ))}

                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan="6" className="empty-orders">
                        {t('No orders found')}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>}
      </main>
    </div>
  )
}
