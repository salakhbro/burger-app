export const categories = [
  { slug: 'all', label: 'All' },
  { slug: 'pizza', label: 'Pizza' },
  { slug: 'fast-food', label: 'Fast food' },
  { slug: 'sandwiches', label: 'Sandwiches' },
  { slug: 'desserts', label: 'Desserts' },
  { slug: 'drinks', label: 'Drinks' },
]

// `image` — o'z rasmingizni src/assets/images ga qo'shib, shu yerda import qiling.
// Rasm bo'lmasa, `emoji` ko'rsatiladi.
export const products = [
  { id: 1, name: 'Style pizza', desc: 'Pizza filled with tomatoes', price: 6.5, category: 'pizza', emoji: '🍕', image: null },
  { id: 2, name: 'Hot-dog', desc: 'Hot-dog filled with sausages', price: 2.0, category: 'fast-food', emoji: '🌭', image: null },
  { id: 3, name: 'Shawarma', desc: 'Shawarma filled with sausages', price: 2.5, category: 'fast-food', emoji: '🌯', image: null },
  { id: 4, name: 'Hamburger', desc: 'Vegetables and cheese lettuce', price: 2.5, category: 'fast-food', emoji: '🍔', image: null },
  { id: 5, name: 'KFS', desc: 'KFS filled with chicken fingers', price: 2.0, category: 'fast-food', emoji: '🍗', image: null },
  { id: 6, name: 'Sandwiches', desc: 'Sandwiches with meat', price: 2.0, category: 'sandwiches', emoji: '🥪', image: null },
  { id: 7, name: 'Ice-creams', desc: 'Chocolates and fruits', price: 0.5, category: 'desserts', emoji: '🍦', image: null },
  { id: 8, name: 'Desserts', desc: 'Desserts filled with chocolates and fruits', price: 0.8, category: 'desserts', emoji: '🧁', image: null },
  { id: 9, name: 'Drinks', desc: 'Fizzy drinks', price: 1.0, category: 'drinks', emoji: '🥤', image: null },
]
