import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useLanguage } from '../../i18n/useLanguage.js'
import '../../assets/style/Login.css'

const API_URL = 'http://localhost:3000/api/users'

export default function PasswordReset() {
  const { t } = useLanguage()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') || ''
  const isReset = Boolean(token)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (isReset && password !== confirmPassword) {
        throw new Error('Passwords do not match.')
      }

      const response = await fetch(
        `${API_URL}/${isReset ? 'reset-password' : 'forgot-password'}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(
            isReset ? { token, password } : { email: email.trim() }
          ),
        }
      )
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Could not process password reset request.')
      }

      setSuccess(true)
    } catch (requestError) {
      console.error('Password reset error:', requestError)
      setError(
        requestError instanceof TypeError
          ? t('Could not connect to the backend server!')
          : t(requestError.message)
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="bg-shape shape-1">🍔</div>
      <div className="bg-shape shape-2">🍟</div>
      <div className="bg-shape shape-3">🥤</div>
      <div className="bg-shape shape-4">🍕</div>

      <section className="login-card password-reset-card">
        <div className="brand-header">
          <div className="logo-badge">
            <span className="burger-icon">🍔</span>
          </div>
          <h1 className="brand-title">Burger</h1>
          <p className="brand-subtitle">
            {t(isReset ? 'Choose a new password' : 'Reset your password')}
          </p>
        </div>

        {success ? (
          <div className="password-reset-result" role="status">
            <p>
              {t(
                isReset
                  ? 'Password reset successfully. You can now sign in with your new password.'
                  : 'If an account exists for this email, password reset instructions will be sent.'
              )}
            </p>
            <Link to="/login" className="login-btn password-reset-submit">
              {t('Back to login')}
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="login-form">
            {isReset ? (
              <>
                <div className="input-group">
                  <label htmlFor="new-password">{t('New password')}</label>
                  <div className="input-wrapper">
                    <span className="input-icon">🔒</span>
                    <input
                      id="new-password"
                      type="password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      minLength={6}
                      autoComplete="new-password"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>
                <div className="input-group">
                  <label htmlFor="confirm-password">
                    {t('Confirm new password')}
                  </label>
                  <div className="input-wrapper">
                    <span className="input-icon">🔒</span>
                    <input
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(event) => setConfirmPassword(event.target.value)}
                      minLength={6}
                      autoComplete="new-password"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>
              </>
            ) : (
              <div className="input-group">
                <label htmlFor="reset-email">{t('Email')}</label>
                <div className="input-wrapper">
                  <span className="input-icon">📧</span>
                  <input
                    id="reset-email"
                    type="email"
                    placeholder={t('Your email address')}
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    autoComplete="email"
                    required
                    disabled={loading}
                  />
                </div>
              </div>
            )}

            {error && (
              <p className="password-reset-error" role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="login-btn password-reset-submit"
              disabled={loading}
            >
              {t(loading ? 'Loading...' : isReset ? 'Save new password' : 'Send reset link')}
            </button>
          </form>
        )}

        {!success && (
          <div className="login-footer">
            <p>
              <Link to="/login" className="signup-link">
                {t('Back to login')}
              </Link>
            </p>
          </div>
        )}
      </section>
    </div>
  )
}
