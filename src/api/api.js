// Backend bilan gaplashadigan barcha funksiyalar shu yerda.
// Backend manzili o'zgarsa, faqat shu qatorni o'zgartirasiz.
const API_URL = 'http://localhost:3000/api'

// Umumiy so'rov funksiyasi: javobni o'qiydi, xato bo'lsa Error tashlaydi
async function request(path, options = {}) {
    const response = await fetch(`${API_URL}${path}`, {
        headers: { 'Content-Type': 'application/json' },
        ...options,
    })

    // Backend ba'zan JSON, ba'zan oddiy matn qaytaradi — ikkalasini ham o'qiymiz
    const text = await response.text()
    let data
    try {
        data = JSON.parse(text)
    } catch {
        data = text
    }

    if (!response.ok) {
        const message = data?.message || (typeof data === 'string' && data) || 'Xatolik yuz berdi'
        throw new Error(message)
    }

    return data
}

// Mahsulotlarni olish
export const getProducts = () => request('/products')
export const getCategories = () => request('/categories')
export const createProduct = (product) =>
    request('/products', {
        method: 'POST',
        body: JSON.stringify(product),
    })
export const updateProduct = (id, product) =>
    request(`/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(product),
    })
export const deleteProduct = (id) =>
    request(`/products/${id}`, { method: 'DELETE' })
export const createContact = (contact) =>
    request('/contacts', {
        method: 'POST',
        body: JSON.stringify(contact),
    })

// Ro'yxatdan o'tish va kirish
export const registerUser = (name, email, password) =>
    request('/users', {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
    })

export const loginUser = (name, password) =>
    request('/users/login', {
        method: 'POST',
        body: JSON.stringify({ name, password }),
    })

// Buyurtma yaratish va unga mahsulot qo'shish
export const createOrder = (order) =>
    request('/orders', {
        method: 'POST',
        body: JSON.stringify(order),
    })

export const createOrderItem = (item) =>
    request('/order-items', {
        method: 'POST',
        body: JSON.stringify(item),
    })
