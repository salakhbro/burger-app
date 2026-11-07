const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {
  createResetCredentials,
  hashResetToken,
  isEmailDeliveryConfigured,
  sendPasswordResetEmail,
} = require('../utils/passwordReset');
const { categories, products } = require('./seedData');
const { validateProduct } = require('../validations/productValidation');
const { validateContact } = require('../validations/contactValidation');
const {
  canonicalCategories,
  getCanonicalCategory,
  normalizeCategoryName,
} = require('./categoryUtils');

const DB_FILE = path.join(__dirname, 'db.json');
const JWT_SECRET = process.env.JWT_SECRET || 'burger_shop_secret_2026_secure_key';

function getInitialData() {
  const adminHash = bcrypt.hashSync('admin123', 10);
  const userHash = bcrypt.hashSync('user123', 10);

  const initialUsers = [
    { id: 1, name: 'admin', email: 'admin@burger.uz', password: adminHash, role: 'admin', customer_id: 1 },
    { id: 2, name: 'salakh.bro', email: 'salakh.bro@example.com', password: adminHash, role: 'admin', customer_id: 2 },
    { id: 3, name: 'demo', email: 'demo@burger.uz', password: userHash, role: 'user', customer_id: 3 },
  ];

  const initialCustomers = [
    { id: 1, name: 'admin', email: 'admin@burger.uz', phone: '+998901234567', address: 'Tashkent, Amir Temur 10' },
    { id: 2, name: 'salakh.bro', email: 'salakh.bro@example.com', phone: '+998909876543', address: 'Tashkent, Chilonzor 5' },
    { id: 3, name: 'demo', email: 'demo@burger.uz', phone: '+998935554433', address: 'Tashkent, Yunusobod 12' },
  ];

  const initialOrders = [
    {
      id: 101,
      user_id: 3,
      total_price: '115000.00',
      status: 'completed',
      address: 'Tashkent, Yunusobod 12, kv 45',
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      items: [
        { id: 1, order_id: 101, product_id: 1, quantity: 1, unit_price: 85000, product: products[0] },
        { id: 2, order_id: 101, product_id: 36, quantity: 3, unit_price: 10000, product: products[35] },
      ],
      user: { id: 3, name: 'demo', email: 'demo@burger.uz' },
    },
    {
      id: 102,
      user_id: 3,
      total_price: '75000.00',
      status: 'preparing',
      address: 'Tashkent, Yunusobod 12, kv 45',
      createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
      items: [
        { id: 3, order_id: 102, product_id: 2, quantity: 1, unit_price: 75000, product: products[1] },
      ],
      user: { id: 3, name: 'demo', email: 'demo@burger.uz' },
    },
    {
      id: 103,
      user_id: 3,
      total_price: '46000.00',
      status: 'pending',
      address: 'Tashkent, Yunusobod 12, kv 45',
      createdAt: new Date(Date.now() - 1800000).toISOString(),
      items: [
        { id: 4, order_id: 103, product_id: 15, quantity: 1, unit_price: 28000, product: products[14] },
        { id: 5, order_id: 103, product_id: 38, quantity: 1, unit_price: 10000, product: products[37] },
      ],
      user: { id: 3, name: 'demo', email: 'demo@burger.uz' },
    },
  ];

  const initialReviews = [
    { id: 1, user_id: 3, product_id: 1, rating: 5, comment: 'Juda ajoyib pitsa! Issiq va mazali yetkazib berildi.', createdAt: new Date(Date.now() - 86400000).toISOString() },
    { id: 2, user_id: 3, product_id: 24, rating: 5, comment: 'Eng yoqtirgan burgerim. Har doim yangi go‘sht.', createdAt: new Date(Date.now() - 43200000).toISOString() },
  ];

  const initialFavorites = [
    { id: 1, user_id: 3, product_id: 1 },
    { id: 2, user_id: 3, product_id: 24 },
  ];

  return {
    categories: [...categories],
    products: [...products],
    users: initialUsers,
    customers: initialCustomers,
    orders: initialOrders,
    reviews: initialReviews,
    favorites: initialFavorites,
  };
}

class JsonDb {
  constructor() {
    this.data = this.load();
    if (!Array.isArray(this.data.contacts)) {
      this.data.contacts = [];
    }
    this.normalizeCategories();
  }

  normalizeCategories() {
    const normalizedCategories = Array.isArray(this.data.categories)
      ? [...this.data.categories]
      : [];
    let changed = false;

    for (const canonical of canonicalCategories) {
      const matching = normalizedCategories.filter(
        (category) => getCanonicalCategory(category.name) === canonical.name
      );
      let primary = matching.find(
        (category) =>
          normalizeCategoryName(category.name) ===
          normalizeCategoryName(canonical.name)
      ) || matching[0];

      if (!primary) {
        const id = normalizedCategories.length
          ? Math.max(...normalizedCategories.map((category) => Number(category.id) || 0)) + 1
          : 1;
        primary = { id, ...canonical };
        normalizedCategories.push(primary);
        changed = true;
      } else {
        if (primary.name !== canonical.name) changed = true;
        primary.name = canonical.name;
      }

      for (const duplicate of matching) {
        if (Number(duplicate.id) === Number(primary.id)) continue;

        for (const product of this.data.products) {
          if (Number(product.category_id) === Number(duplicate.id)) {
            product.category_id = primary.id;
            changed = true;
          }
        }

        normalizedCategories.splice(
          normalizedCategories.indexOf(duplicate),
          1
        );
        changed = true;
      }
    }

    this.data.categories = normalizedCategories;
    if (changed) this.save();
  }

  load() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.products) && parsed.products.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('JSON DB yuklashda ogohlantirish, yangi boshlang‘ich baza yaratilmoqda:', e.message);
    }
    const fresh = getInitialData();
    this.save(fresh);
    return fresh;
  }

  save(dataToSave) {
    try {
      const data = dataToSave || this.data;
      fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.error('JSON DB saqlashda xatolik:', err);
    }
  }

  createRouter() {
    const express = require('express');
    const router = express.Router();

    // Health
    router.get('/health', (req, res) => {
      res.json({ status: 'ok', engine: 'json-fallback-db', items: this.data.products.length });
    });

    // Categories
    router.get('/categories', (req, res) => {
      res.json(this.data.categories);
    });

    router.post('/categories', (req, res) => {
      const { name, description } = req.body;
      const id = this.data.categories.length ? Math.max(...this.data.categories.map(c => c.id)) + 1 : 1;
      const cat = { id, name, description: description || '' };
      this.data.categories.push(cat);
      this.save();
      res.status(201).json(cat);
    });

    router.put('/categories/:id', (req, res) => {
      const id = Number(req.params.id);
      const cat = this.data.categories.find(c => c.id === id);
      if (cat) {
        if (req.body.name) cat.name = req.body.name;
        if (req.body.description !== undefined) cat.description = req.body.description;
        this.save();
        return res.json(cat);
      }
      res.status(404).json({ message: 'Category not found' });
    });

    // Products
    router.get('/products', (req, res) => {
      const list = this.data.products.map(p => {
        const cat = this.data.categories.find(c => c.id === p.category_id);
        return { ...p, category: cat || null };
      });
      res.json(list);
    });

    router.get('/products/:id', (req, res) => {
      const p = this.data.products.find(item => item.id === Number(req.params.id));
      if (!p) return res.status(404).json({ message: 'Product not found' });
      const cat = this.data.categories.find(c => c.id === p.category_id);
      res.json({ ...p, category: cat || null });
    });

    router.post('/products', (req, res) => {
      const { error } = validateProduct(req.body);
      if (error) return res.status(400).json({ message: error.details[0].message });
      const categoryId = Number(req.body.category_id);
      if (!this.data.categories.some(category => Number(category.id) === categoryId)) {
        return res.status(404).json({ message: 'Category not found' });
      }
      const id = this.data.products.length ? Math.max(...this.data.products.map(p => p.id)) + 1 : 1;
      const newProduct = {
        id,
        name: req.body.name.trim(),
        description: req.body.description || '',
        price: Number(req.body.price),
        category_id: categoryId,
        stock: Number(req.body.stock),
        image: req.body.image || '',
      };
      this.data.products.push(newProduct);
      this.save();
      res.status(201).json(newProduct);
    });

    router.put('/products/:id', (req, res) => {
      const p = this.data.products.find(item => item.id === Number(req.params.id));
      if (!p) return res.status(404).json({ message: 'Product not found' });
      const { error } = validateProduct(req.body);
      if (error) return res.status(400).json({ message: error.details[0].message });
      const categoryId = Number(req.body.category_id);
      if (!this.data.categories.some(category => Number(category.id) === categoryId)) {
        return res.status(404).json({ message: 'Category not found' });
      }
      Object.assign(p, {
        name: req.body.name.trim(),
        description: req.body.description || '',
        price: Number(req.body.price),
        category_id: categoryId,
        stock: Number(req.body.stock),
        image: req.body.image || '',
      });
      this.save();
      res.json(p);
    });

    router.delete('/products/:id', (req, res) => {
      const index = this.data.products.findIndex(item => item.id === Number(req.params.id));
      if (index === -1) return res.status(404).json({ message: 'Product not found' });
      const removed = this.data.products.splice(index, 1)[0];
      this.save();
      res.json(removed);
    });

    // Contact messages
    router.post('/contacts', (req, res) => {
      const { error, value } = validateContact(req.body);
      if (error) return res.status(400).json({ message: error.details[0].message });
      const contact = {
        id: this.data.contacts.length
          ? Math.max(...this.data.contacts.map(item => Number(item.id) || 0)) + 1
          : 1,
        ...value,
        status: 'new',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      this.data.contacts.push(contact);
      this.save();
      res.status(201).json(contact);
    });

    router.get('/contacts', (req, res) => {
      res.json([...this.data.contacts].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      ));
    });

    router.get('/contacts/:id', (req, res) => {
      const contact = this.data.contacts.find(item => item.id === Number(req.params.id));
      if (!contact) return res.status(404).json({ message: 'Contact not found' });
      res.json(contact);
    });

    router.put('/contacts/:id', (req, res) => {
      const contact = this.data.contacts.find(item => item.id === Number(req.params.id));
      if (!contact) return res.status(404).json({ message: 'Contact not found' });
      const { error, value } = validateContact(req.body);
      if (error) return res.status(400).json({ message: error.details[0].message });
      Object.assign(contact, value, { updatedAt: new Date().toISOString() });
      this.save();
      res.json(contact);
    });

    router.delete('/contacts/:id', (req, res) => {
      const index = this.data.contacts.findIndex(item => item.id === Number(req.params.id));
      if (index === -1) return res.status(404).json({ message: 'Contact not found' });
      const [removed] = this.data.contacts.splice(index, 1);
      this.save();
      res.json(removed);
    });

    // Users & Auth
    router.post('/users/forgot-password', async (req, res) => {
      const email = typeof req.body.email === 'string'
        ? req.body.email.trim().toLowerCase()
        : '';
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ message: 'Enter a valid email address.' });
      }

      if (process.env.NODE_ENV === 'production' && !isEmailDeliveryConfigured()) {
        return res.status(503).json({
          message: 'Password reset email service is not configured.',
        });
      }

      const user = this.data.users.find(
        (candidate) => candidate.email.trim().toLowerCase() === email
      );
      if (user) {
        const credentials = createResetCredentials();
        user.reset_password_token = credentials.tokenHash;
        user.reset_password_expires = credentials.expiresAt.toISOString();
        this.save();

        try {
          await sendPasswordResetEmail(user.email, credentials.token);
        } catch (error) {
          user.reset_password_token = null;
          user.reset_password_expires = null;
          this.save();
          console.error('Password reset email delivery failed:', error);
        }
      }

      return res.status(200).json({
        message: 'If an account exists for this email, password reset instructions will be sent.',
      });
    });

    router.post('/users/reset-password', (req, res) => {
      const { token, password } = req.body;
      if (typeof token !== 'string' || !/^[a-f0-9]{64}$/i.test(token)) {
        return res.status(400).json({
          message: 'This password reset link is invalid or has expired.',
        });
      }
      if (typeof password !== 'string' || password.length < 6) {
        return res.status(400).json({
          message: 'Password must be at least 6 characters.',
        });
      }

      const tokenHash = hashResetToken(token);
      const user = this.data.users.find(
        (candidate) =>
          candidate.reset_password_token === tokenHash &&
          Date.parse(candidate.reset_password_expires) > Date.now()
      );
      if (!user) {
        return res.status(400).json({
          message: 'This password reset link is invalid or has expired.',
        });
      }

      user.password = bcrypt.hashSync(password, 10);
      user.reset_password_token = null;
      user.reset_password_expires = null;
      this.save();

      return res.status(200).json({ message: 'Password reset successfully.' });
    });

    router.post('/users', (req, res) => {
      const { name, email, password, role } = req.body;
      if (!name || !email || !password) {
        return res.status(400).json({ message: 'Name, email va password talab qilinadi' });
      }
      const existing = this.data.users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
      if (existing) {
        return res.status(409).json({ message: 'Bu email allaqachon mavjud!' });
      }
      const id = this.data.users.length ? Math.max(...this.data.users.map(u => u.id)) + 1 : 1;
      const custId = this.data.customers.length ? Math.max(...this.data.customers.map(c => c.id)) + 1 : 1;
      const hashedPassword = bcrypt.hashSync(password, 10);

      const user = {
        id,
        name: name.trim(),
        email: email.trim(),
        password: hashedPassword,
        role: role === 'admin' ? 'admin' : 'user',
        customer_id: custId,
      };

      const customer = {
        id: custId,
        name: name.trim(),
        email: email.trim(),
        phone: '',
        address: '',
      };

      this.data.users.push(user);
      this.data.customers.push(customer);
      this.save();

      const userSafe = { ...user };
      delete userSafe.password;
      delete userSafe.reset_password_token;
      delete userSafe.reset_password_expires;

      res.status(201).json({
        message: "Ro'yxatdan o'tish muvaffaqiyatli!",
        user: userSafe,
      });
    });

    router.post('/users/login', (req, res) => {
      const { name, password } = req.body;
      if (!name || !password) {
        return res.status(400).json({ message: 'Username va password kiriting' });
      }
      const q = name.trim().toLowerCase();
      const user = this.data.users.find(u => u.name.toLowerCase() === q || u.email.toLowerCase() === q);
      if (!user) {
        return res.status(401).json({ message: "Login yoki parol noto'g'ri" });
      }
      const valid = bcrypt.compareSync(password, user.password);
      if (!valid) {
        return res.status(401).json({ message: "Login yoki parol noto'g'ri" });
      }

      const token = jwt.sign(
        { id: user.id, role: user.role },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.json({
        message: 'Login muvaffaqiyatli!',
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          customer_id: user.customer_id,
        },
      });
    });

    router.get('/users', (req, res) => {
      const safe = this.data.users.map(u => {
        const copy = { ...u };
        delete copy.password;
        delete copy.reset_password_token;
        delete copy.reset_password_expires;
        return copy;
      });
      res.json(safe);
    });

    router.get('/users/:id', (req, res) => {
      const u = this.data.users.find(user => user.id === Number(req.params.id));
      if (!u) return res.status(404).json({ message: 'User not found' });
      const copy = { ...u };
      delete copy.password;
      delete copy.reset_password_token;
      delete copy.reset_password_expires;
      res.json(copy);
    });

    router.put('/users/:id', (req, res) => {
      const u = this.data.users.find(user => user.id === Number(req.params.id));
      if (!u) return res.status(404).json({ message: 'User not found' });
      if (req.body.name) u.name = req.body.name.trim();
      if (req.body.email) u.email = req.body.email.trim();
      const cust = this.data.customers.find(c => c.id === u.customer_id);
      if (cust) {
        if (req.body.name) cust.name = req.body.name.trim();
        if (req.body.email) cust.email = req.body.email.trim();
      }
      this.save();
      const copy = { ...u };
      delete copy.password;
      delete copy.reset_password_token;
      delete copy.reset_password_expires;
      res.json(copy);
    });

    // Orders
    router.get('/orders', (req, res) => {
      let list = [...this.data.orders];
      const userId = req.query.userId || req.query.user_id;
      if (userId) {
        list = list.filter(o => Number(o.user_id) === Number(userId));
      }
      list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      res.json(list);
    });

    router.get('/orders/:id', (req, res) => {
      const order = this.data.orders.find(o => o.id === Number(req.params.id));
      if (!order) return res.status(404).json({ message: 'Order not found' });
      res.json(order);
    });

    router.post('/orders', (req, res) => {
      const { user_id, address, items } = req.body;
      if (!user_id || !address || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ message: 'user_id, address va kamida 1 ta item talab qilinadi' });
      }

      const user = this.data.users.find(u => u.id === Number(user_id));
      const orderId = this.data.orders.length ? Math.max(...this.data.orders.map(o => o.id)) + 1 : 101;

      let subtotal = 0;
      const orderItems = items.map((it, idx) => {
        const prod = this.data.products.find(p => p.id === Number(it.product_id));
        const price = prod ? prod.price : 20000;
        const qty = Number(it.quantity) || 1;
        subtotal += price * qty;
        return {
          id: idx + 1,
          order_id: orderId,
          product_id: it.product_id,
          quantity: qty,
          unit_price: price,
          product: prod || { id: it.product_id, name: 'Burger', price },
        };
      });

      const total = (subtotal + 1.5).toFixed(2);

      const order = {
        id: orderId,
        user_id: Number(user_id),
        total_price: total,
        status: 'pending',
        address: String(address).trim(),
        createdAt: new Date().toISOString(),
        items: orderItems,
        user: user ? { id: user.id, name: user.name, email: user.email } : { id: user_id, name: 'Customer' },
      };

      this.data.orders.unshift(order);
      this.save();

      res.status(201).json({ message: 'Buyurtma qabul qilindi!', data: order, id: order.id });
    });

    router.patch('/orders/:id', (req, res) => {
      const order = this.data.orders.find(o => o.id === Number(req.params.id));
      if (!order) return res.status(404).json({ message: 'Order not found' });
      if (req.body.status) {
        order.status = req.body.status;
        order.updatedAt = new Date().toISOString();
      }
      this.save();
      res.json(order);
    });

    // Favorites
    router.get('/favorites', (req, res) => {
      let favs = [...this.data.favorites];
      const userId = req.query.user_id || req.query.userId;
      if (userId) {
        favs = favs.filter(f => Number(f.user_id) === Number(userId));
      }
      res.json(favs);
    });

    router.post('/favorites', (req, res) => {
      const { user_id, product_id } = req.body;
      if (!user_id || !product_id) {
        return res.status(400).json({ message: 'user_id va product_id talab qilinadi' });
      }
      const existing = this.data.favorites.find(
        f => Number(f.user_id) === Number(user_id) && Number(f.product_id) === Number(product_id)
      );
      if (existing) {
        return res.status(409).json({ message: 'Bu mahsulot Favoritesda mavjud', data: existing });
      }
      const id = this.data.favorites.length ? Math.max(...this.data.favorites.map(f => f.id)) + 1 : 1;
      const fav = { id, user_id: Number(user_id), product_id: Number(product_id) };
      this.data.favorites.push(fav);
      this.save();
      res.status(201).json({ message: 'Favorite created successfully', data: fav });
    });

    router.delete('/favorites/:id', (req, res) => {
      const id = Number(req.params.id);
      const index = this.data.favorites.findIndex(f => f.id === id);
      if (index === -1) return res.status(404).json({ message: 'Favorite not found' });
      const removed = this.data.favorites.splice(index, 1)[0];
      this.save();
      res.json({ message: 'Favorite deleted successfully', data: removed });
    });

    // Reviews
    router.get('/reviews', (req, res) => {
      res.json(this.data.reviews);
    });

    router.post('/reviews', (req, res) => {
      const { user_id, product_id, rating, comment } = req.body;
      if (!user_id || !product_id) {
        return res.status(400).json({ message: 'user_id va product_id talab qilinadi' });
      }
      const id = this.data.reviews.length ? Math.max(...this.data.reviews.map(r => r.id)) + 1 : 1;
      const rev = {
        id,
        user_id: Number(user_id),
        product_id: Number(product_id),
        rating: Number(rating) || 5,
        comment: comment ? String(comment).trim() : '',
        createdAt: new Date().toISOString(),
      };
      this.data.reviews.unshift(rev);
      this.save();
      res.status(201).json({ message: 'Review created successfully', data: rev });
    });

    // Customer profile / settings
    router.get('/customers/user/:userId', (req, res) => {
      const userId = Number(req.params.userId);
      const user = this.data.users.find(u => u.id === userId);
      const cust = user ? this.data.customers.find(c => c.id === user.customer_id) : null;
      res.json({
        id: cust ? cust.id : null,
        phone: cust ? cust.phone : '',
        address: cust ? cust.address : '',
      });
    });

    router.put('/customers/user/:userId', (req, res) => {
      const userId = Number(req.params.userId);
      const user = this.data.users.find(u => u.id === userId);
      if (!user) return res.status(404).json({ message: 'User not found' });
      let cust = this.data.customers.find(c => c.id === user.customer_id);
      if (!cust) {
        const newId = this.data.customers.length ? Math.max(...this.data.customers.map(c => c.id)) + 1 : 1;
        cust = { id: newId, name: user.name, email: user.email, phone: '', address: '' };
        user.customer_id = newId;
        this.data.customers.push(cust);
      }
      if (req.body.phone !== undefined) cust.phone = String(req.body.phone).trim();
      if (req.body.address !== undefined) cust.address = String(req.body.address).trim();
      this.save();
      res.json(cust);
    });

    return router;
  }
}

const instance = new JsonDb();
module.exports = instance;
