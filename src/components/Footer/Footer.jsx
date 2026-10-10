import { useState } from 'react'
import { Link } from 'react-router-dom'
import Burgers from '../images/images.jpg'
import {
  FacebookIcon,
  InstagramIcon,
  TelegramIcon,
  TiktokIcon,
} from '../../assets/icons'
import '../../assets/style/Footer.css'

const socials = [
  { label: 'Instagram', href: 'https://instagram.com', Icon: InstagramIcon },
  { label: 'Facebook', href: 'https://facebook.com', Icon: FacebookIcon },
  { label: 'TikTok', href: 'https://tiktok.com', Icon: TiktokIcon },
  { label: 'Telegram', href: 'https://telegram.org', Icon: TelegramIcon },
]

export default function Footer() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })

  const [sent, setSent] = useState(false)

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })

    setSent(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    setSent(true)

    setForm({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
    })
  }

  return (
    <footer id="contact" className="footer">
      <div className="container footer__inner">

        <Link to="/" className="footer__logo">
          <img src={Burgers} className='footer__logo-icon' alt="burger" /> Burger
        </Link>

        <p className="footer__description">
          Fresh burgers. Great taste. Happy moments.
        </p>

        <div className="footer__contact-section">

          <div className="footer__contact-info">
            <span className="footer__tag">GET IN TOUCH</span>

            <h2>
              Let's talk about
              <span> your next order!</span>
            </h2>

            <p className="footer__info-text">
              Have a question or want to order something delicious?
              Send us a message. We'd love to hear from you!
            </p>

            <div className="footer__info-item">
              <div className="footer__info-icon">☎</div>
              <div>
                <h3>Phone Number</h3>
                <a href="tel:+998901234567">
                  +998 90 123 45 67
                </a>
              </div>
            </div>

            <div className="footer__info-item">
              <div className="footer__info-icon">⌖</div>
              <div>
                <h3>Our Location</h3>
                <p>Namangan, Langar</p>
              </div>
            </div>

            <div className="footer__info-item">
              <div className="footer__info-icon">◷</div>
              <div>
                <h3>Working Hours</h3>
                <p>Every day: 08:00 – 23:00</p>
              </div>
            </div>
          </div>

          <form
            className="footer__contact-form"
            onSubmit={handleSubmit}
          >
            <h3>Send Us a Message</h3>

            <p className="footer__form-description">
              Fill in the details below.
            </p>

            <div className="footer__form-row">
              <div className="footer__field">
                <label htmlFor="contact-name">Your Name</label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  placeholder="Enter your name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="footer__field">
                <label htmlFor="contact-phone">Phone Number</label>
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
              <label htmlFor="contact-email">Email Address</label>
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
              <label htmlFor="contact-subject">Subject</label>
              <select
                id="contact-subject"
                name="subject"
                value={form.subject}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Choose a subject
                </option>
                <option value="order">Food Order</option>
                <option value="delivery">Delivery</option>
                <option value="feedback">Feedback</option>
                <option value="other">Other Questions</option>
              </select>
            </div>

            <div className="footer__field">
              <label htmlFor="contact-message">Your Message</label>
              <textarea
                id="contact-message"
                name="message"
                placeholder="Write your message here..."
                value={form.message}
                onChange={handleChange}
                rows="4"
                required
              />
            </div>

            <button className="footer__submit" type="submit">
              Send Message <span>→</span>
            </button>

            {sent && (
              <p className="footer__success">
                ✓ Thank you! Your message has been received.
              </p>
            )}
          </form>

        </div>

        <div className="footer__newsletter">
          <div>
            <h3>Stay in the loop 🍔</h3>
            <p>Subscribe to get our latest offers and news.</p>
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
              placeholder="Enter your email address"
              aria-label="Newsletter email"
              required
            />
            <button type="submit">Subscribe →</button>
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
            © Burger {new Date().getFullYear()}. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  )
}
