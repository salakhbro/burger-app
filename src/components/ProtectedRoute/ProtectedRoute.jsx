import { Navigate, useLocation } from 'react-router-dom'

export default function ProtectedRoute({ children, requiredRole }) {
  const location = useLocation()

  let user = null
  try {
    user = JSON.parse(localStorage.getItem('burger-user') || 'null')
  } catch {
    user = null
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />
  }

  return children
}
