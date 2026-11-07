import { useState } from 'react'
import { Link } from 'react-router-dom'
import { HeartIcon, BagIcon } from '../../assets/icons'
import FoodImage from '../FoodImage/FoodImage.jsx'
import { formatPrice } from '../../features/formatPrice.js'
import { useStore } from '../../store/useStore.js'
import { useLanguage } from '../../i18n/useLanguage.js'
import { useToast } from '../Toast/useToast.js'
import '../../assets/style/Product.css'

const API = 'http://localhost:3000/api'

export default function ProductCard({ product }) {
  const { t, localizeProduct } = useLanguage()
  const { showSuccess, showInfo } = useToast()
  const localProduct = product
  const {
    isFavorite,
    toggleFavorite,
    addToCart,
    favoritesLoading,
    getBackendProduct,
  } = useStore()
  const backendProduct = getBackendProduct(localProduct)
  product = {
    ...localizeProduct(localProduct),
    price: backendProduct?.price ?? localProduct.price,
  }

  const [showReviews, setShowReviews] = useState(false)
  const [reviews, setReviews] = useState([])
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [reviewsLoading, setReviewsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [favoriteError, setFavoriteError] = useState('')

  const fav = isFavorite(product.id)

  const averageRating = reviews.length
    ? (
        reviews.reduce(
          (sum, review) => sum + Number(review.rating || 0),
          0
        ) / reviews.length
      ).toFixed(1)
    : null

  const loadReviews = async () => {
    try {
      setReviewsLoading(true)
      setError('')

      const response = await fetch(`${API}/reviews`)

      if (!response.ok) {
        throw new Error('Could not load reviews')
      }

      const data = await response.json()

      if (!Array.isArray(data)) {
        throw new Error('Invalid review data')
      }

      setReviews(
        data.filter(
          (review) =>
            Number(review.product_id) === Number(backendProduct?.id)
        )
      )
    } catch (err) {
      setError(t(err.message))
    } finally {
      setReviewsLoading(false)
    }
  }

  const handleShowReviews = async () => {
    if (showReviews) {
      setShowReviews(false)
      return
    }

    setShowReviews(true)
    setSuccess('')
    await loadReviews()
  }

  const handleSubmitReview = async (e) => {
    e.preventDefault()

    setError('')
    setSuccess('')

    let user

    try {
      user = JSON.parse(
        localStorage.getItem('burger-user') || 'null'
      )
    } catch {
      user = null
    }

    if (!user?.id) {
      setError(t('Please log in to write a review!'))
      return
    }

    if (!comment.trim()) {
      setError(t('Please write a comment!'))
      return
    }

    if (!backendProduct) {
      setError(t('This product is not available in the backend menu.'))
      return
    }

    try {
      setLoading(true)

      const response = await fetch(`${API}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.id,
          product_id: backendProduct.id,
          rating,
          comment: comment.trim(),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message || 'Could not send review'
        )
      }

      setComment('')
      setRating(5)
      setSuccess(t('Thank you! Your feedback has been successfully submitted.'))

      await loadReviews()
    } catch (err) {
      setError(t(err.message))
    } finally {
      setLoading(false)
    }
  }

  const handleToggleFavorite = async () => {
    setFavoriteError('')

    try {
      await toggleFavorite(product.id)
      if (!fav) {
        showSuccess(`${product.name} — ${t('Added to favorites') || 'Sevimlilarga qo‘shildi'}`)
      } else {
        showInfo(`${product.name} — ${t('Removed from favorites') || 'Sevimlilardan olindi'}`)
      }
    } catch (err) {
      setFavoriteError(t(err.message))
    }
  }

  return (
    <article className="food-card">

      {/* PRODUCT */}
      <Link
        to={`/product/${product.id}`}
        className="food-card__link"
      >
        <div className="food-card__img">
          <FoodImage product={product} />
        </div>

        <h3>{product.name}</h3>
        <p>{product.desc}</p>
      </Link>

      {/* PRICE AND ACTIONS */}
      <div className="food-card__bottom">
        <strong className="food-card__price">
          {formatPrice(product.price)}
        </strong>

        <div className="food-card__actions">
          <button
            type="button"
            className={`heart-btn ${fav ? 'is-active' : ''}`}
            onClick={handleToggleFavorite}
            aria-label={t(fav ? 'Remove from favorites' : 'Add to favorites')}
            aria-pressed={fav}
            disabled={favoritesLoading}
          >
            <HeartIcon size={16} filled={fav} />
          </button>

          <button
            type="button"
            className="cart-btn"
            onClick={() => {
              addToCart(product.id)
              showSuccess(`${product.name} — ${t('Added to cart.')}`)
            }}
            aria-label={t('Add to cart')}
          >
            <BagIcon size={18} />
          </button>
        </div>
      </div>
      {favoriteError && (
        <p className="review-message error" role="alert">
          {favoriteError}
        </p>
      )}

      {/* REVIEWS */}
      <div className="product-review">

        <button
          type="button"
          className={`review-toggle ${showReviews ? 'is-open' : ''}`}
          onClick={handleShowReviews}
          aria-expanded={showReviews}
        >
          <span className="review-toggle__left">
            <span className="review-toggle__star">★</span>

            <span className="review-toggle__rating">
              {averageRating || t('New')}
            </span>

            <span className="review-toggle__count">
              ({reviews.length} {t('ratings')})
            </span>
          </span>

          <span className="review-toggle__arrow">
            {showReviews ? '−' : '+'}
          </span>
        </button>

        {showReviews && (
          <div className="review-panel">

            <div className="review-panel__header">
              <div>
                <span className="review-panel__eyebrow">
                  {t('CUSTOMER REVIEWS')}
                </span>
                <h4>{t('Customer Reviews')}</h4>
              </div>

              <div className="review-panel__average">
                <span>★</span>
                {averageRating || '—'}
              </div>
            </div>

            {reviewsLoading ? (
              <div className="review-loading">
                <span className="review-spinner"></span>
                <p>{t('Loading reviews...')}</p>
              </div>
            ) : reviews.length === 0 ? (
              <div className="review-empty">
                <span className="review-empty__icon">💬</span>
                <strong>{t('No reviews yet')}</strong>
                <p>
                  {t('Be the first to share your feedback!')}
                </p>
              </div>
            ) : (
              <div className="review-list">
                {reviews.map((review) => (
                  <div
                    className="review-item"
                    key={review.id}
                  >
                    <div className="review-item__top">
                      <div className="review-avatar">
                        {(review.user?.name || 'U')
                          .charAt(0)
                          .toUpperCase()}
                      </div>

                      <div className="review-item__user">
                        <strong>
                          {review.user?.name || t('Customer')}
                        </strong>

                        <div className="review-stars">
                          {'★'.repeat(
                            Number(review.rating)
                          )}
                          <span>
                            {'☆'.repeat(
                              5 - Number(review.rating)
                            )}
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="review-item__comment">
                      {review.comment || t('No comment left')}
                    </p>
                  </div>
                ))}
              </div>
            )}

            <form
              className="review-form"
              onSubmit={handleSubmitReview}
            >
              <div className="review-form__heading">
                <h4>{t('Write your review')}</h4>
                <span>{t('Your feedback is important to us!')}</span>
              </div>

              <label className="review-form__label">
                {t('Rate the product')}
              </label>

              <div className="review-rating">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className={
                      star <= rating ? 'active' : ''
                    }
                    onClick={() => setRating(star)}
                    aria-label={`${star} ${t('stars')}`}
                  >
                    ★
                  </button>
                ))}
              </div>

              <textarea
                placeholder={t('Write your thoughts about the product...')}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                maxLength={1000}
                rows={3}
              />

              <div className="review-form__footer">
                <span>{comment.length}/1000</span>

                <button
                  type="submit"
                  className="review-submit"
                  disabled={loading || reviewsLoading}
                >
                  {loading ? t('Sending...') : t('Send feedback')}
                  {!loading && <span> →</span>}
                </button>
              </div>

              {error && (
                <p className="review-message error">
                  {error}
                </p>
              )}

              {success && (
                <p className="review-message success">
                  {success}
                </p>
              )}
            </form>

          </div>
        )}
      </div>

    </article>
  )
}