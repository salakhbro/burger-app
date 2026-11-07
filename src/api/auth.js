// Foydalanuvchi ma'lumotlarini localStorage bilan yagona standartda boshqarish

export function getUser() {
  try {
    return JSON.parse(localStorage.getItem('burger-user') || 'null')
  } catch {
    return null
  }
}

export function getToken() {
  return localStorage.getItem('burger-token') || null
}

export function saveUser(user, token) {
  if (user) {
    localStorage.setItem('burger-user', JSON.stringify(user))
  }
  if (token) {
    localStorage.setItem('burger-token', token)
  }
  window.dispatchEvent(new Event('burger-auth-changed'))
}

export function removeUser() {
  localStorage.removeItem('burger-user')
  localStorage.removeItem('burger-token')
  localStorage.removeItem('adminToken')
  window.dispatchEvent(new Event('burger-auth-changed'))
}

export function isAuthenticated() {
  return Boolean(getUser())
}

export function isAdmin() {
  const u = getUser()
  return Boolean(u && u.role === 'admin')
}
