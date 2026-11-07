
import { products } from './features/products.js'

const API = 'http://localhost:3000/api'

const categoryIds = {
  pizza: 2,
  'fast-food': 5,
  desserts: 6,
  drinks: 7,
  sneklar: 4,
}

export async function seedProducts() {
  try {
    const response = await fetch(`${API}/products`)
    if (!response.ok) throw new Error('Products API ishlamadi')

    const existing = await response.json()
    let added = 0
    let skipped = 0

    for (const product of products) {
      // Bir xil nomli mahsulot mavjud bo'lsa, o'tkazib yuboramiz
      const found = existing.some(
        (item) =>
          item.name.trim().toLowerCase() ===
          product.name.trim().toLowerCase(),
      )

      if (found) {
        skipped++
        continue
      }

      const category_id = categoryIds[product.category]

      if (!category_id) {
        console.warn('Kategoriya topilmadi:', product.name)
        continue
      }

      const result = await fetch(`${API}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: product.name,
          description: product.desc || '',
          price: product.price,
          image: product.image || '',
          stock: 100,
          category_id,
        }),
      })

      if (!result.ok) {
        const message = await result.text()
        console.error('Xato:', product.name, message)
        continue
      }

      added++
      console.log('Qo‘shildi:', product.name)
    }

    console.log('IMPORT YAKUNLANDI')
    console.log('Yangi mahsulotlar:', added)
    console.log('Oldindan mavjud:', skipped)
  } catch (error) {
    console.error('Import xatosi:', error)
  }
}