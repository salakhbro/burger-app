import { Link, Navigate, Route, Routes } from 'react-router-dom'
import Header from './components/Header/Header.jsx'
import Footer from './components/Footer/Footer.jsx'
import ScrollToHash from './features/ScrollToHash.jsx'
import Home from './pages/Home/Home.jsx'
import Category from './pages/Category/Category.jsx'
import Product from './pages/Product/Product.jsx'
import Cart from './pages/Cart/Cart.jsx'
import './App.css'

function NotFound() {
  return (
    <div className="container page empty">
      <h1 className="page__title">Page not found</h1>
      <p>The page you are looking for does not exist.</p>
      <Link to="/" className="btn btn--yellow">
        Back to home
      </Link>
    </div>
  )
}

export default function App() {
  return (
    <div className="app">
      <ScrollToHash />
      <Header />
      <main className="app__main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/category" element={<Navigate to="/category/all" replace />} />
          <Route path="/category/:slug" element={<Category />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
