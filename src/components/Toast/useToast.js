import { useContext } from 'react'
import { ToastContext } from './ToastContextDefinition.js'

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    return {
      showToast: (m) => console.log('[Toast]', m),
      showSuccess: (m) => console.log('[Toast:success]', m),
      showError: (m) => console.error('[Toast:error]', m),
      showInfo: (m) => console.log('[Toast:info]', m),
    }
  }
  return context
}
