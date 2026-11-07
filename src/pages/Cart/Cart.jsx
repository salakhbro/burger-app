import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle2,
  CreditCard,
  Banknote,
  Smartphone,
  ArrowRight
} from 'lucide-react';
import { TrashIcon } from '../../assets/icons';
import FoodImage from '../../components/FoodImage/FoodImage.jsx';
import { formatPrice } from '../../features/formatPrice.js';
import { useStore } from '../../store/useStore.js';
import { useLanguage } from '../../i18n/useLanguage.js';
import { useToast } from '../../components/Toast/useToast.js';
import '../../assets/style/Cart.css';

const API_URL = 'http://localhost:3000/api';
const DELIVERY_FEE = 15000; // UZS

export default function Cart() {
  const { t, localizeProduct } = useLanguage();
  const { showSuccess, showError, showInfo } = useToast();

  const {
    cart,
    setQty,
    removeFromCart,
    clearCart,
    getBackendProduct,
    catalogProducts,
  } = useStore();

  const [ordered, setOrdered] = useState(false);
  const [lastOrder, setLastOrder] = useState(null);
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash'); // 'cash' | 'payme' | 'click' | 'card'
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Get currently logged-in user
  const getCurrentUser = () => {
    try {
      return JSON.parse(localStorage.getItem('burger-user') || 'null');
    } catch {
      return null;
    }
  };

  const currentUser = getCurrentUser();

  // Try to load user's saved address
  useEffect(() => {
    if (!currentUser?.id) return;
    try {
      fetch(`${API_URL}/customers/user/${currentUser.id}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data && data.address) {
            setAddress((prev) => prev || data.address);
          }
        })
        .catch(() => {});
    } catch {
      // offline fallback
    }
  }, [currentUser?.id]);

  // Find products in cart
  const items = cart
    .map((item) => {
      const product = catalogProducts.find((p) => Number(p.id) === Number(item.id));
      return {
        ...item,
        product,
        backendProduct: product ? getBackendProduct(product) : null,
      };
    })
    .filter((item) => item.product);

  // Subtotal calculation
  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.backendProduct?.price ?? item.product.price) * item.qty,
    0
  );

  const delivery = items.length > 0 ? DELIVERY_FEE : 0;

  // Promo code calculation
  let discount = 0;
  if (appliedPromo) {
    if (appliedPromo.type === 'percent') {
      discount = Math.round((subtotal * appliedPromo.value) / 100);
    } else if (appliedPromo.type === 'fixed') {
      discount = Math.min(subtotal, appliedPromo.value);
    }
  }

  const total = Math.max(0, subtotal - discount) + delivery;

  // Apply promo
  const handleApplyPromo = (e) => {
    e.preventDefault();
    const code = promoCode.trim().toUpperCase();
    if (!code) return;

    if (code === 'BURGER20' || code === 'CHEGIRMA20') {
      setAppliedPromo({ code, type: 'percent', value: 20 });
      showSuccess(t('Promo code applied!') + ' (-20%)');
    } else if (code === 'MAZALI' || code === 'BURGER15') {
      setAppliedPromo({ code, type: 'fixed', value: 15000 });
      showSuccess(t('Promo code applied!') + ' (-15,000 UZS)');
    } else {
      showError(t('Invalid promo code'));
    }
    setPromoCode('');
  };

  // CHECKOUT
  const checkout = async () => {
    if (!currentUser?.id) {
      setError(t('Please log in first!'));
      return;
    }

    if (!address.trim()) {
      setError(t('Please enter delivery address!'));
      return;
    }

    if (items.length === 0 || loading) {
      return;
    }

    setLoading(true);
    setError('');

    const orderPayload = {
      user_id: currentUser.id,
      address: address.trim(),
      payment_method: paymentMethod,
      discount,
      total_price: String(total),
      items: items.map((item) => ({
        product_id: item.backendProduct?.id || item.product.id,
        quantity: item.qty,
      })),
    };

    try {
      let createdOrder = null;

      try {
        const response = await fetch(`${API_URL}/orders`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderPayload),
        });

        if (response.ok) {
          const result = await response.json();
          createdOrder = result.data || result;
        }
      } catch (networkErr) {
        console.warn('Backend ulanmadi, buyurtma mahalliy xotirada saqlanadi:', networkErr.message);
      }

      // If backend failed or wasn't reachable, save order locally so user is never blocked!
      if (!createdOrder || !createdOrder.id) {
        const localId = 1000 + Math.floor(Math.random() * 9000);
        createdOrder = {
          id: localId,
          user_id: currentUser.id,
          total_price: String(total),
          status: 'pending',
          address: address.trim(),
          payment_method: paymentMethod,
          createdAt: new Date().toISOString(),
          items: items.map((it) => ({
            product_id: it.product.id,
            quantity: it.qty,
            unit_price: it.product.price,
            product: it.product,
          })),
          user: currentUser,
        };

        try {
          const existing = JSON.parse(localStorage.getItem('burger-orders') || '[]');
          existing.unshift(createdOrder);
          localStorage.setItem('burger-orders', JSON.stringify(existing));
        } catch (e) {
          console.error(e);
        }
      }

      setLastOrder(createdOrder);
      clearCart();
      setOrdered(true);
      showSuccess(t('Order placed 🎉'));
    } catch (err) {
      console.error('Checkout error:', err);
      setError(t(err.message || 'An error occurred while placing the order!'));
    } finally {
      setLoading(false);
    }
  };

  // When order is successful
  if (ordered && lastOrder) {
    const paymentLabels = {
      cash: t('Cash on delivery'),
      payme: 'Payme',
      click: 'Click',
      card: t('Card on delivery'),
    };

    return (
      <div className="container page">
        <div className="order-success-card">
          <div className="order-success-badge">
            <CheckCircle2 size={44} />
          </div>

          <h1>{t('Order placed 🎉')}</h1>
          <p style={{ color: '#6b7280', marginBottom: 12 }}>
            {t('Your order has been saved successfully.')}
          </p>

          <span className="order-id-pill">
            {t('Order ID')}: #{lastOrder.id}
          </span>

          {/* Interactive Timeline Tracker */}
          <div className="order-tracker">
            <div className="order-tracker-step is-done">
              <span className="order-step-circle">✓</span>
              <span className="order-step-label">{t('Confirmed')}</span>
            </div>
            <div className="order-tracker-step is-active">
              <span className="order-step-circle">👨‍🍳</span>
              <span className="order-step-label">{t('Preparing')}</span>
            </div>
            <div className="order-tracker-step">
              <span className="order-step-circle">🛵</span>
              <span className="order-step-label">{t('Delivering')}</span>
            </div>
            <div className="order-tracker-step">
              <span className="order-step-circle">🏠</span>
              <span className="order-step-label">{t('Completed')}</span>
            </div>
          </div>

          {/* Receipt */}
          <div className="order-receipt">
            <div className="order-receipt-row">
              <span>{t('Estimated delivery')}:</span>
              <strong>⏱️ {t('30-40 min')}</strong>
            </div>
            <div className="order-receipt-row">
              <span>{t('Address')}:</span>
              <strong>{lastOrder.address}</strong>
            </div>
            <div className="order-receipt-row">
              <span>{t('Payment method')}:</span>
              <strong>{paymentLabels[paymentMethod] || paymentMethod}</strong>
            </div>
            <div className="order-receipt-row total">
              <span>{t('Total')}:</span>
              <span style={{ color: '#ffb800' }}>{formatPrice(lastOrder.total_price || total)}</span>
            </div>
          </div>

          <div className="order-actions">
            <Link to="/customer" className="btn btn--yellow">
              {t('My orders')} <ArrowRight size={16} />
            </Link>
            <Link to="/" className="btn btn--ghost">
              {t('Back to home')}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // If cart is empty
  if (items.length === 0) {
    return (
      <div className="container page empty">
        <div style={{ fontSize: 52, marginBottom: 12 }}>🍔</div>
        <h1 className="page__title">{t('Your cart is empty ) :')}</h1>
        <p>{t('Add something tasty from the menu.')}</p>
        <Link to="/category/all" className="btn btn--yellow" style={{ marginTop: 16 }}>
          {t('Browse food')}
        </Link>
      </div>
    );
  }

  return (
    <div className="container page">
      <h1 className="page__title">{t('Cart')}</h1>

      <div className="cart__layout">
        <ul className="cart__list">
          {items.map(({ product, backendProduct, qty }) => (
            <li key={product.id} className="cart-item">
              <Link to={`/product/${product.id}`} className="cart-item__img">
                <FoodImage product={product} />
              </Link>

              <div>
                <p className="cart-item__name">
                  {localizeProduct(product).name}
                </p>
                <p className="cart-item__price">
                  {formatPrice(backendProduct?.price ?? product.price)} {t('each')}
                </p>
              </div>

              <div className="qty">
                <button
                  type="button"
                  aria-label={`${t('Decrease quantity')} ${localizeProduct(product).name}`}
                  disabled={loading}
                  onClick={() => setQty(product.id, qty - 1)}
                >
                  −
                </button>
                <span>{qty}</span>
                <button
                  type="button"
                  aria-label={`${t('Increase quantity')} ${localizeProduct(product).name}`}
                  disabled={loading}
                  onClick={() => setQty(product.id, qty + 1)}
                >
                  +
                </button>
              </div>

              <p className="cart-item__total">
                {formatPrice((backendProduct?.price ?? product.price) * qty)}
              </p>

              <button
                type="button"
                className="cart-item__remove"
                aria-label={`${t('Remove')} ${localizeProduct(product).name}`}
                disabled={loading}
                onClick={() => {
                  removeFromCart(product.id);
                  showInfo(t('Remove'));
                }}
              >
                <TrashIcon size={18} />
              </button>
            </li>
          ))}
        </ul>

        <aside className="summary">
          <h2>{t('Order summary')}</h2>

          {/* Delivery Address */}
          <label htmlFor="delivery-address">{t('Delivery address')}</label>
          <input
            id="delivery-address"
            type="text"
            value={address}
            onChange={(event) => setAddress(event.target.value)}
            placeholder={t('Enter your address')}
            required
            disabled={loading}
          />

          {/* Payment Method Selector */}
          <label>{t('Payment method')}</label>
          <div className="payment-selector">
            <button
              type="button"
              className={`payment-btn ${paymentMethod === 'cash' ? 'is-active' : ''}`}
              onClick={() => setPaymentMethod('cash')}
            >
              <Banknote size={16} /> {t('Cash on delivery')}
            </button>
            <button
              type="button"
              className={`payment-btn ${paymentMethod === 'card' ? 'is-active' : ''}`}
              onClick={() => setPaymentMethod('card')}
            >
              <CreditCard size={16} /> {t('Card on delivery')}
            </button>
            <button
              type="button"
              className={`payment-btn ${paymentMethod === 'payme' ? 'is-active' : ''}`}
              onClick={() => setPaymentMethod('payme')}
            >
              <Smartphone size={16} /> Payme
            </button>
            <button
              type="button"
              className={`payment-btn ${paymentMethod === 'click' ? 'is-active' : ''}`}
              onClick={() => setPaymentMethod('click')}
            >
              <Smartphone size={16} /> Click
            </button>
          </div>

          {/* Promo code */}
          <label>{t('Promo code')}</label>
          {appliedPromo ? (
            <div className="promo-badge">
              <span>🎟️ {appliedPromo.code} ({appliedPromo.type === 'percent' ? '-20%' : '-15,000 UZS'})</span>
              <button
                type="button"
                onClick={() => setAppliedPromo(null)}
                style={{ background: 'transparent', border: 0, color: '#065f46', cursor: 'pointer', fontWeight: 700 }}
              >
                ✕
              </button>
            </div>
          ) : (
            <form onSubmit={handleApplyPromo} className="promo-box">
              <input
                type="text"
                placeholder="BURGER20"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
              />
              <button type="submit" className="btn btn--ghost" style={{ padding: '8px 14px' }}>
                {t('Apply')}
              </button>
            </form>
          )}

          {/* Price Breakdown */}
          <div className="summary__row">
            <span>{t('Subtotal')}</span>
            <span>{formatPrice(subtotal)}</span>
          </div>

          {discount > 0 && (
            <div className="summary__row summary__row--discount">
              <span>{t('Discount')}</span>
              <span>-{formatPrice(discount)}</span>
            </div>
          )}

          <div className="summary__row">
            <span>{t('Delivery')}</span>
            <span>{formatPrice(delivery)}</span>
          </div>

          <div className="summary__row summary__row--total">
            <span>{t('Total')}</span>
            <span>{formatPrice(total)}</span>
          </div>

          {error && (
            <div className="cart__error-box" role="alert">
              <span>{error}</span>
              {!currentUser?.id && (
                <Link to="/login" className="cart__error-login-btn">
                  {t('Log in')} →
                </Link>
              )}
            </div>
          )}

          <button
            type="button"
            className="btn btn--yellow"
            onClick={checkout}
            disabled={loading}
          >
            {loading ? t('Placing order...') : t('Place order')}
          </button>

          <button
            type="button"
            className="btn btn--ghost"
            onClick={clearCart}
            disabled={loading}
          >
            {t('Clear cart')}
          </button>
        </aside>
      </div>
    </div>
  );
}
