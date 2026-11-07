import { categories, products } from './products.js'

const API_URL = 'http://localhost:3000/api/categories'

const backendNameAliases = {
  pizza: ['pizzalar categoriyalar'],
  'fast-food': ['fast food'],
  desserts: [],
  drinks: [],
  snacks: ['sneklar'],
}

let syncPromise

async function readResponse(response) {
  const text = await response.text()

  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}

export function syncCategories() {
  if (syncPromise) return syncPromise

  syncPromise = (async () => {
    const response = await fetch(API_URL)
    const existing = await readResponse(response)

    if (!response.ok || !Array.isArray(existing)) {
      throw new Error(
        existing?.message || existing || 'Could not load backend categories'
      )
    }

    const synced = []

    for (const category of categories.filter((item) => item.slug !== 'all')) {
      const aliases = [
        category.label.toLowerCase(),
        ...(backendNameAliases[category.slug] || []),
      ]
      const match = existing.find((item) =>
        aliases.includes(String(item.name || '').trim().toLowerCase())
      )
      const payload = {
        name: category.label,
        description: `${products.filter((product) => product.category === category.slug).length} delicious choices`,
      }

      const saveResponse = await fetch(
        match ? `${API_URL}/${match.id}` : API_URL,
        {
          method: match ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      )
      const savedCategory = await readResponse(saveResponse)

      if (!saveResponse.ok) {
        throw new Error(
          savedCategory?.message ||
            savedCategory ||
            `Could not save ${category.label} category`
        )
      }

      synced.push(savedCategory)
    }

    return synced
  })().catch((error) => {
    syncPromise = null
    throw error
  })

  return syncPromise
}
