import { useState } from 'react'
import { Link } from 'react-router-dom'
import Burgers from '../images/images.jpg'
import { createContact } from '../../api/api.js'
import { useToast } from '../Toast/useToast.js'
import {
  FacebookIcon,
  InstagramIcon,
  TelegramIcon,
  TiktokIcon,
} from '../../assets/icons'
import { useLanguage } from '../../i18n/useLanguage.js'
import '../../assets/style/Footer.css'

const socials = [
  { label: 'Instagram', href: 'https://instagram.com', Icon: InstagramIcon },
  { label: 'Facebook', href: 'https://facebook.com', Icon: FacebookIcon },
  { label: 'TikTok', href: 'https://tiktok.com', Icon: TiktokIcon },
  { label: 'Telegram', href: 'https://telegram.org', Icon: TelegramIcon },
]

export default function Footer() {
  const { t } = useLanguage()
  const { showError } = useToast()
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })

  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })

    setSent(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSending(true)
    try {
      await createContact(form)
      setSent(true)
      setForm({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      })
    } catch (error) {
      setSent(false)
      showError(error.message || t('Could not send your message. Please try again.'))
    } finally {
      setSending(false)
    }
  }

  return (
    <footer id="contact" className="footer">
      <div className="container footer__inner">

        <Link to="/" className="footer__logo">
          <img src={Burgers} className='footer__logo-icon' alt={t('Burger')} /> Burger
        </Link>

        <p className="footer__description">
          {t('Fresh burgers. Great taste. Happy moments.')}
        </p>

        <div className="footer__contact-section">

          <div className="footer__contact-info">
            <span className="footer__tag">{t('GET IN TOUCH')}</span>

            <h2>
              {t("Let's talk about")}
              <span>{t(' your next order!')}</span>
            </h2>

            <p className="footer__info-text">
              {t("Have a question or want to order something delicious? Send us a message. We'd love to hear from you!")}
            </p>

            <div className="footer__info-item">
              <div className="footer__info-icon">☎</div>
              <div>
                <h3>{t('Phone Number')}</h3>
                <a href="tel:+998901234567">
                  +998 90 123 45 67
                </a>
              </div>
            </div>

            <div className="footer__info-item">
              <div className="footer__info-icon">⌖</div>
              <div>
                <h3>{t('Our Location')}</h3>
                <p>Namangan, Langar</p>
              </div>
            </div>

            <div className="footer__info-item">
              <div className="footer__info-icon">◷</div>
              <div>
                <h3>{t('Working Hours')}</h3>
                <p>{t('Every day: 08:00 – 23:00')}</p>
              </div>
            </div>
          </div>

          <form
            className="footer__contact-form"
            onSubmit={handleSubmit}
          >
            <h3>{t('Send Us a Message')}</h3>

            <p className="footer__form-description">
              {t('Fill in the details below.')}
            </p>

            <div className="footer__form-row">
              <div className="footer__field">
                <label htmlFor="contact-name">{t('Your Name')}</label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  minLength="3"
                  placeholder={t('Enter your name')}
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="footer__field">
                <label htmlFor="contact-phone">{t('Phone Number')}</label>
                <input
                  id="contact-phone"
                  name="phone"
                  type="tel"
                  placeholder="+998 90 123 45 67"
                  value={form.phone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="footer__field">
              <label htmlFor="contact-email">{t('Email Address')}</label>
              <input
                id="contact-email"
                name="email"
                type="email"
                placeholder="your@email.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="footer__field">
              <label htmlFor="contact-subject">{t('Subject')}</label>
              <select
                id="contact-subject"
                name="subject"
                value={form.subject}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  {t('Choose a subject')}
                </option>
                <option value="order">{t('Food Order')}</option>
                <option value="delivery">{t('Delivery')}</option>
                <option value="feedback">{t('Feedback')}</option>
                <option value="other">{t('Other Questions')}</option>
              </select>
            </div>

            <div className="footer__field">
              <label htmlFor="contact-message">{t('Your Message')}</label>
              <textarea
                id="contact-message"
                name="message"
                placeholder={t('Write your message here...')}
                value={form.message}
                onChange={handleChange}
                rows="4"
                required
              />
            </div>

            <button className="footer__submit" type="submit" disabled={sending}>
              {sending ? t('Sending contact message...') : t('Send Message')} <span>→</span>
            </button>

            {sent && (
              <p className="footer__success">
                {t('✓ Thank you! Your message has been received.')}
              </p>
            )}
          </form>

        </div>

        <div className="footer__newsletter">
          <div>
            <h3>{t('Stay in the loop 🍔')}</h3>
            <p>{t('Subscribe to get our latest offers and news.')}</p>
          </div>

          <form
            className="footer__newsletter-form"
            onSubmit={(e) => {
              e.preventDefault()
              e.currentTarget.reset()
            }}
          >
            <input
              type="email"
              placeholder={t('Enter your email address')}
              aria-label={t('Newsletter email')}
              required
            />
            <button type="submit">{t('Subscribe →')}</button>
          </form>
        </div>

        <div className="footer__bottom">
          <div className="footer__social">
            {socials.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
              >
                <Icon size={21} />
              </a>
            ))}
          </div>

          <p className="footer__copy">
            © Burger {new Date().getFullYear()}. {t('All rights reserved.')}
          </p>
        </div>

      </div>
    </footer>
  )
}
