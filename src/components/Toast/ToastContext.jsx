import { useState, useCallback } from 'react'
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react'
import { ToastContext } from './ToastContextDefinition.js'
import './Toast.css'

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const showToast = useCallback((message, type = 'info', duration = 3500) => {
    if (!message) return
    const id = Date.now() + Math.random()

    setToasts((prev) => [...prev, { id, message, type }])

    setTimeout(() => {
      removeToast(id)
    }, duration)
  }, [removeToast])

  const showSuccess = useCallback((msg, duration) => showToast(msg, 'success', duration), [showToast])
  const showError = useCallback((msg, duration) => showToast(msg, 'error', duration), [showToast])
  const showInfo = useCallback((msg, duration) => showToast(msg, 'info', duration), [showToast])

  return (
    <ToastContext.Provider value={{ showToast, showSuccess, showError, showInfo }}>
      {children}
      <div className="toast-container" aria-live="polite">
        {toasts.map((toast) => {
          const Icon =
            toast.type === 'success'
              ? CheckCircle2
              : toast.type === 'error'
              ? AlertCircle
              : Info
          const iconColor =
            toast.type === 'success'
              ? '#10b981'
              : toast.type === 'error'
              ? '#ef4444'
              : '#ffb800'

          return (
            <div key={toast.id} className={`toast toast--${toast.type}`}>
              <span className="toast__icon">
                <Icon size={20} color={iconColor} />
              </span>
              <span className="toast__message">{toast.message}</span>
              <button
                type="button"
                className="toast__close"
                onClick={() => removeToast(toast.id)}
                aria-label="Yopish"
              >
                <X size={16} />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}
