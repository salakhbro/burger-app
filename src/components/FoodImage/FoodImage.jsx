// Rasm bo'lsa <img>, bo'lmasa emoji ko'rsatadi.
import { useLanguage } from '../../i18n/useLanguage.js'

export default function FoodImage({ product }) {
  const { localizeProduct } = useLanguage()
  const localized = localizeProduct(product)
  if (product.image) {
    return <img src={product.image} alt={localized.name} loading="lazy" />
  }
  return (
    <span className="food-emoji" role="img" aria-label={localized.name}>
      {product.emoji}
    </span>
  )
}
