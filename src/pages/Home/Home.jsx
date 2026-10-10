import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import { A11y } from 'swiper/modules'
import 'swiper/css'
import { ChevronLeft, ChevronRight } from '../../assets/icons'
import ProductCard from '../../components/ProductCard/ProductCard.jsx'
import FoodImage from '../../components/FoodImage/FoodImage.jsx'
import { products } from '../../features/products.js'
import { formatPrice } from '../../features/formatPrice.js'
import { useStore } from '../../store/useStore.js'
import '../../assets/style/Home.css'
import '../../assets/style/swiper.css'

export default function Home() {
  const [swiper, setSwiper] = useState(null)
  const [active, setActive] = useState(0)
  const { addToCart } = useStore()
  const navigate = useNavigate()

  const orderNow = (id) => {
    addToCart(id)
    navigate('/cart')
  }

  return (
    <>
      {/* Hero */}
      <section className="hero">
        <div className="container hero__inner">
          <div>
            <h1 className="hero__title">
              <span>Special Food</span> Every Time For You
            </h1>
            <p className="hero__text">
              Best cooks and best delivery guys all at your service. Hot testy food will reach you in 60 minutes.
            </p>
          </div>
          <div className="hero__plate" aria-hidden="true">
            <span className="hero__emoji hero__emoji--drink">🥤</span>
            <span className="hero__emoji hero__emoji--fries">🍟</span>
            <span className="hero__emoji hero__emoji--nuggets">🍗</span>
            <span className="hero__emoji hero__emoji--pizza">🍕</span>
            <span className="hero__emoji hero__emoji--hotdog">🌭</span>
            <span className="hero__emoji hero__emoji--burger">🍔</span>
          </div>
        </div>
      </section>

      {/* Our Awesome Food */}
      <section id="menu" className="menu">
        <div className="container">
          <div className="section-head">
            <h2>Our Awesome Food</h2>
            <p>Want delicious meal, but no time we will deliver it hot and yummy. Foodies will love our food.</p>
          </div>
          <div className="food-grid">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Popular Menus */}
      <section className="popular">
        <div className="container">
          <h2 className="popular__heading">Popular Menus</h2>

          <div className="popular__stage">
            <button
              type="button"
              className="popular__arrow popular__arrow--prev"
              aria-label="Previous"
              onClick={() => swiper?.slidePrev()}
            >
              <ChevronLeft size={22} />
            </button>
            <button
              type="button"
              className="popular__arrow popular__arrow--next"
              aria-label="Next"
              onClick={() => swiper?.slideNext()}
            >
              <ChevronRight size={22} />
            </button>

            <Swiper
              modules={[A11y]}
              slidesPerView={1}
              spaceBetween={24}
              breakpoints={{ 900: { slidesPerView: 1.15 } }}
              onSwiper={setSwiper}
              onSlideChange={(s) => setActive(s.activeIndex)}
            >
              {products.map((product) => (
                <SwiperSlide key={product.id}>
                  <div className="popular__slide">
                    <h3 className="popular__title">{product.name.toUpperCase()}</h3>
                    <div className="popular__visual">
                      <FoodImage product={product} />
                    </div>
                    <div className="popular__info">
                      <p>{product.desc}</p>
                      <button type="button" className="btn btn--light" onClick={() => orderNow(product.id)}>
                        Order Now
                      </button>
                      <span className="popular__price">{formatPrice(product.price)}</span>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          <div className="popular__thumbs">
            {products.map((product, index) => (
              <button
                key={product.id}
                type="button"
                className={`thumb ${index === active ? 'is-active' : ''}`}
                aria-label={product.name}
                aria-current={index === active}
                onClick={() => swiper?.slideTo(index)}
              >
                <span aria-hidden="true">{product.emoji}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Delivery */}
      <section id="delivery" className="delivery">
        <div className="container">
          <h2 className="delivery__title">Delivery</h2>
          <div className="delivery__inner">
            <div className="phone" aria-hidden="true">
              <div className="phone__top">
                <div>
                  <small>Delivery To</small>
                  <b>New York Preston Rd...</b>
                </div>
                <span className="phone__bag">🛍️</span>
              </div>
              <div className="phone__search">🔍 Search food</div>
              <div className="phone__promo">
                <div>
                  <b>25% OFF</b>
                  <small>Enjoy Delicious Food</small>
                  <span className="phone__promo-btn">Taste Now</span>
                </div>
                <span className="phone__promo-img">🥗</span>
              </div>
              <div className="phone__row">
                <b>Categories</b>
                <small>View all</small>
              </div>
              <div className="phone__chips">
                <span className="is-active">🍔 Burger</span>
                <span>🍕 Pizza</span>
                <span>🍜 Asian</span>
              </div>
              <div className="phone__row">
                <b>Restaurant Near You</b>
                <small>View all</small>
              </div>
              <div className="phone__card">🍟🥤</div>
            </div>

            <div className="delivery__copy">
              <h3>Download Burger now available on iPhone &amp; Android!</h3>
              <p>Industry experience, MT Food Group will work with products for your business through our.</p>
              <div className="store-btns">
                <button type="button" className="store-btn">
                  <span aria-hidden="true">▶</span>
                  <span>
                    <small>GET IT ON</small>
                    <b>Google Play</b>
                  </span>
                </button>
                <button type="button" className="store-btn">
                  <span aria-hidden="true">🍎</span>
                  <span>
                    <small>Download on the</small>
                    <b>App Store</b>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
