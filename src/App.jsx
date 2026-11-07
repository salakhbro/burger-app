import { Link, Navigate, Route, Routes, useLocation } from 'react-router-dom'

import Header from './components/Header/Header.jsx'
import Footer from './components/Footer/Footer.jsx'
import ScrollToHash from './features/ScrollToHash.jsx'
import LanguageSwitcher from './i18n/LanguageSwitcher.jsx'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute.jsx'
import { useLanguage } from './i18n/useLanguage.js'

import Home from './pages/Home/Home.jsx'
import Category from './pages/Category/Category.jsx'
import Product from './pages/Product/Product.jsx'
import Cart from './pages/Cart/Cart.jsx'
import Login from './pages/Login/Login.jsx'
import Register from './pages/Register/Register.jsx'
import Admin from './pages/Admin/Admin.jsx'
import Profile from './pages/Profile/Profile.jsx'
import Customer from './pages/Customer/Customer.jsx'
import Settings from './pages/Settings/Settings.jsx'
import PasswordReset from './pages/PasswordReset/PasswordReset.jsx'

import './App.css'
import './assets/style/Menu.css'

function NotFound() {
  const { t } = useLanguage()

  return (
    <div className="container page empty">
      <h1 className="page__title">{t('Page not found')}</h1>
      <p>{t('The page you are looking for does not exist.')}</p>

      <Link to="/" className="btn btn--yellow">
        {t('Back to home')}
      </Link>
    </div>
  )
}

export default function App() {
  const location = useLocation()
  const isLoginPage = location.pathname === '/login'
  const isRegisterPage = location.pathname === '/register'
  const isPasswordResetPage = location.pathname === '/forgot-password'
  const isAdminPage = location.pathname.startsWith('/admin')
  const hideLayout = isLoginPage || isRegisterPage || isPasswordResetPage || isAdminPage

  return (
    <div className="app">
      <ScrollToHash />
      {!hideLayout && <Header />}
      {(isLoginPage || isRegisterPage) && (
        <LanguageSwitcher className="language-switcher--floating language-switcher--light" />
      )}
      <main className="app__main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/category"
            element={<Navigate to="/category/all" replace />}
          />
          <Route path="/category/:slug" element={<Category />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<PasswordReset />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="admin">
                <Admin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customer"
            element={
              <ProtectedRoute>
                <Customer />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {!hideLayout && <Footer />}
    </div>
  )
}
