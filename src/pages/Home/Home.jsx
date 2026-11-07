import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import { A11y, Autoplay, Pagination } from 'swiper/modules'

import 'swiper/css'
import 'swiper/css/pagination'

import { ChevronLeft, ChevronRight } from '../../assets/icons'
import ProductCard from '../../components/ProductCard/ProductCard.jsx'
import FoodImage from '../../components/FoodImage/FoodImage.jsx'

import AjoyibPlus from '../images/ajoyib-plus.png'
import MiniiLavash from '../images/mini-lavash.png'
import KFCtwo from '../images/kfc-two.png'
import PizzaMenu from '../images/pizza-menu.png'

import { syncCategories } from '../../features/syncCategories.js'
import { formatPrice } from '../../features/formatPrice.js'
import { useStore } from '../../store/useStore.js'
import { useLanguage } from '../../i18n/useLanguage.js'
import { useToast } from '../../components/Toast/useToast.js'

import '../../assets/style/Home.css'
import '../../assets/style/swiper.css'

const banners = [
  AjoyibPlus,
  MiniiLavash,
  KFCtwo,
  PizzaMenu,
]

export default function Home() {
  const [swiper, setSwiper] = useState(null)

  const {
    addToCart,
    catalogCategories,
    catalogProducts,
    getBackendProduct,
  } = useStore()
  const { t, localizeProduct } = useLanguage()
  const { showSuccess } = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    syncCategories().catch((error) => {
      console.warn('Category sync skipped (offline or not needed):', error.message)
    })
  }, [])

  const categoryCards = catalogCategories
    .filter((category) => category.slug !== 'all')
    .map((category) => ({
      ...category,
      image: catalogProducts.find((product) => product.category === category.slug)?.image,
      count: catalogProducts.filter((product) => product.category === category.slug).length,
    }))

  const orderNow = (id) => {
    addToCart(id)
    showSuccess(t('Added to cart.'))
    navigate('/cart')
  }

  return (
    <>
      {/* Hero Banner Slider */}
      <section className="hero">
        <Swiper
          className="hero-swiper"
          modules={[A11y, Autoplay, Pagination]}
          slidesPerView={1.5}
          spaceBetween={20}
          loop
          speed={750}
          autoplay={{
            delay: 900,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          pagination={{
            clickable: true,
          }}
          breakpoints={{
            640: {
              slidesPerView: 1.2,
              spaceBetween: 16,
            },
            900: {
              slidesPerView: 1.5,
              spaceBetween: 20,
            },
          }}
        >
          {banners.map((image, index) => (
            <SwiperSlide key={index}>
              <div className="hero-slide">
                <img
                  src={image}
                  alt={`${t('Food promotion')} ${index + 1}`}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      <section className="home-categories" aria-labelledby="home-categories-title">
        <div className="container">
          <div className="home-categories__heading">
            <div>
              <span className="home-categories__eyebrow">{t('FIND YOUR FAVORITE')}</span>
              <h2 id="home-categories-title">{t('Shop by category')}</h2>
            </div>
            <Link to="/category/all" className="home-categories__all">
              {t('View all menu')}
            </Link>
          </div>

          <div className="home-categories__grid">
            {categoryCards.map((category, index) => (
              <Link
                key={category.slug}
                to={`/category/${category.slug}`}
                className={`home-category-card home-category-card--${index + 1}`}
              >
                <span className="home-category-card__copy">
                  <strong>{t(category.label)}</strong>
                  <span>{category.count} {t('delicious choices')}</span>
                  <span className="home-category-card__cta">{t('Explore menu')} <span aria-hidden="true">→</span></span>
                </span>
                <span className="home-category-card__image">
                  {category.image ? (
                    <img src={category.image} alt="" loading="lazy" />
                  ) : (
                    <span className="home-category-card__fallback" aria-hidden="true">
                      🍔
                    </span>
                  )}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Our Awesome Food */}
      <section id="menu" className="menu">
        <div className="container">
          <div className="section-head">
            <h2>{t('Our Awesome Food')}</h2>

            <p>
              {t('Want delicious meal, but no time we will deliver it hot and yummy. Foodies will love our food.')}
            </p>
          </div>

          <div className="food-grid">
            {catalogProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Popular Menus */}
      <section className="popular">
        <div className="container">
          <h2 className="popular__heading">
            {t('Popular Menus')}
          </h2>

          <div className="popular__stage">
            <button
              type="button"
              className="popular__arrow popular__arrow--prev"
              aria-label={t('Previous product')}
              onClick={() => swiper?.slidePrev()}
            >
              <ChevronLeft size={22} />
            </button>

            <button
              type="button"
              className="popular__arrow popular__arrow--next"
              aria-label={t('Next product')}
              onClick={() => swiper?.slideNext()}
            >
              <ChevronRight size={22} />
            </button>

            <Swiper
              modules={[A11y]}
              slidesPerView={1}
              spaceBetween={24}
              breakpoints={{
                900: {
                  slidesPerView: 1.15,
                },
              }}
              onSwiper={setSwiper}
            >
              {catalogProducts.map((product) => (
                <SwiperSlide key={product.id}>
                  <div className="popular__slide">
                    <h3 className="popular__title">
                      {localizeProduct(product).name.toUpperCase()}
                    </h3>

                    <div className="popular__visual">
                      <FoodImage product={product} />
                    </div>

                    <div className="popular__info">
                      <p>{localizeProduct(product).desc}</p>

                      <button
                        type="button"
                        className="btn btn--light"
                        onClick={() => orderNow(product.id)}
                      >
                        {t('Order Now')}
                      </button>

                      <span className="popular__price">
                        {formatPrice(getBackendProduct(product)?.price ?? product.price)}
                      </span>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </section>

      {/* Delivery */}
      <section id="delivery" className="delivery">
        <div className="delivery__container">

          <div className="delivery__badge">
            <span className="delivery__badge-icon">
              🚀
            </span>
            {t('FAST & FRESH DELIVERY')}
          </div>

          <h2 className="delivery__title">
            {t('Delicious food,')}
            <br />
            <span>{t('delivered to your door.')}</span>
          </h2>

          <p className="delivery__subtitle">
            {t('Order your favorite burgers, pizzas and meals. Freshly prepared, quickly delivered, always delicious.')}
          </p>

          <div className="delivery__inner">

            {/* Phone mockup */}
            <div className="delivery__visual">

              <div className="delivery__circle delivery__circle--one" />
              <div className="delivery__circle delivery__circle--two" />

              <div className="delivery__floating delivery__floating--burger">
                🍔
              </div>

              <div className="delivery__floating delivery__floating--star">
                ⭐
              </div>

              <div className="phone">
                <div className="phone__notch" />

                <div className="phone__content">

                  <div className="phone__top">
                    <div>
                      <small>{t('Delivering to')}</small>
                      <b>📍 {t('Your location')}</b>
                    </div>

                    <div className="phone__avatar">
                      👤
                    </div>
                  </div>

                  <div className="phone__search">
                    <span>🔍</span>
                    <span>
                      {t('Search your favorite food...')}
                    </span>
                  </div>

                  <div className="phone__promo">
                    <div className="phone__promo-copy">
                      <small>{t('LIMITED OFFER')}</small>
                      <b>{t('25% OFF')}</b>
                      <span>{t('Your first order!')}</span>

                      <div className="phone__promo-btn">
                        {t('Order now →')}
                      </div>
                    </div>

                    <div className="phone__promo-img">
                      🍔
                    </div>
                  </div>

                  <div className="phone__row">
                    <b>{t('Categories')}</b>
                    <span>{t('See all')}</span>
                  </div>

                  <div className="phone__chips">
                    <div className="phone__chip phone__chip--active">
                      🍔 {t('Burger')}
                    </div>

                    <div className="phone__chip">
                      🍕 Pizza
                    </div>

                    <div className="phone__chip">
                      🍟 Snacks
                    </div>
                  </div>

                  <div className="phone__row">
                    <b>{t('Popular food')}</b>
                    <span>{t('See all')}</span>
                  </div>

                  <div className="phone__food">
                    <div className="phone__food-image">
                      🍔
                    </div>

                    <div className="phone__food-info">
                      <b>{t('Classic Burger')}</b>
                      <small>⭐ 4.9 · {t('15 min')}</small>
                      <strong>$8.99</strong>
                    </div>

                    <div className="phone__add">
                      +
                    </div>
                  </div>

                  <div className="phone__food">
                    <div className="phone__food-image phone__food-image--pizza">
                      🍕
                    </div>

                    <div className="phone__food-info">
                      <b>{t('Cheese Pizza')}</b>
                      <small>⭐ 4.8 · {t('20 min')}</small>
                      <strong>$12.99</strong>
                    </div>

                    <div className="phone__add">
                      +
                    </div>
                  </div>

                  <div className="phone__bottom">
                    <span>🏠</span>
                    <span>🔍</span>
                    <span>❤️</span>
                    <span>🛒</span>
                  </div>

                </div>
              </div>

              <div className="delivery__floating delivery__floating--delivery">
                <span>🛵</span>

                <div>
                  <b>{t('Fast delivery')}</b>
                  <small>{t('At your doorstep')}</small>
                </div>
              </div>

            </div>

            {/* Delivery information */}
            <div className="delivery__copy">

              <div className="delivery__eyebrow">
                <span />
                {t('FOOD AT YOUR FINGERTIPS')}
              </div>

              <h3>
                {t('Your next favorite')}
                <br />
                {t('meal is just')}
                <span>{t(' one tap away!')}</span>
              </h3>

              <p>
                {t('Craving something delicious? Get your favorite burgers, crispy fries and refreshing drinks delivered straight to your door.')}
              </p>

              <div className="delivery__features">

                <div className="delivery__feature">
                  <div className="delivery__feature-icon">
                    ⚡
                  </div>

                  <div>
                    <b>{t('Fast delivery')}</b>
                    <small>{t('Fresh food in no time')}</small>
                  </div>
                </div>

                <div className="delivery__feature">
                  <div className="delivery__feature-icon">
                    🍔
                  </div>

                  <div>
                    <b>{t('Fresh & delicious')}</b>
                    <small>{t('Made with quality ingredients')}</small>
                  </div>
                </div>

                <div className="delivery__feature">
                  <div className="delivery__feature-icon">
                    🎁
                  </div>

                  <div>
                    <b>{t('Special offers')}</b>
                    <small>{t('Exclusive deals for you')}</small>
                  </div>
                </div>

              </div>

              <div className="delivery__stores">

                <a
                  href="https://play.google.com/store"
                  target="_blank"
                  rel="noreferrer"
                  className="delivery__store"
                >
                  <span className="delivery__store-icon">
                    ▶
                  </span>

                  <span>
                    <small>{t('GET IT ON')}</small>
                    <b>{t('Google Play')}</b>
                  </span>
                </a>

                <a
                  href="https://www.apple.com/app-store/"
                  target="_blank"
                  rel="noreferrer"
                  className="delivery__store"
                >
                  <span className="delivery__store-icon">
                    🍎
                  </span>

                  <span>
                    <small>{t('Download on the')}</small>
                    <b>{t('App Store')}</b>
                  </span>
                </a>

              </div>

              <div className="delivery__note">
                <span>✨</span>

                <span>
                  {t('Good food. Great mood. Delivered with love.')}
                </span>
              </div>

            </div>

          </div>
        </div>
      </section>
    </>
  )
}