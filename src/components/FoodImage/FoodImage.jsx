// Rasm bo'lsa <img>, bo'lmasa emoji ko'rsatadi.
export default function FoodImage({ product }) {
  if (product.image) {
    return <img src={product.image} alt={product.name} loading="lazy" />
  }
  return (
    <span className="food-emoji" role="img" aria-label={product.name}>
      {product.emoji}
    </span>
  )
}
