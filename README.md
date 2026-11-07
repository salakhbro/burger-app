# Burger — React + React Router

Food delivery landing/shop (Vite + React 18 + react-router-dom v6 + Swiper).

## Ishga tushirish

Backend `.env` faylida PostgreSQL va JWT sozlamalarini kiriting (`DB_NAME`,
`DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT`, `JWT_SECRET`). Backend va
frontendni alohida terminallarda ishga tushiring:

```bash
cd src/backend
npm install
npm run dev
```

```bash
npm install
npm run dev
```

Frontend API so'rovlari `http://localhost:3000/api` manziliga yuboriladi.
Mahsulot narxlari backenddagi ma'lumot bilan moslanadi; buyurtmalar backendda
saqlanib, mijoz va admin sahifalarida ko'rsatiladi.

## Mahsulotlar CRUD

Admin panelidagi **Products** bo'limida mahsulotlarni qo'shish, ro'yxatini
ko'rish, tahrirlash va o'chirish mumkin. Forma `/api/products` va
`/api/categories` endpointlariga so'rov yuboradi; backend PostgreSQL ulangan
bo'lsa PostgreSQL'ga, aks holda `src/backend/data/db.json` fayliga saqlaydi.
Admin panelga kirish uchun `admin@burger.uz` / `admin123` demo hisobidan
foydalanish mumkin.

Sayt pastidagi aloqa formasi yuborilgan xabarlarni `/api/contacts` orqali
backenddagi PostgreSQL yoki JSON bazaga saqlaydi.

## Parolni tiklash

Lokal rejimda tiklash havolasi backend terminalida ko'rsatiladi. Ishlab
chiqarish muhitida email orqali yuborish uchun backend `.env` fayliga quyidagi
sozlamalarni kiriting:

```env
FRONTEND_URL=https://your-site.example
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-smtp-user
SMTP_PASS=your-smtp-password
SMTP_FROM="Burger <no-reply@example.com>"
```

Tiklash havolasi 15 daqiqadan so'ng tugaydi va bir marta ishlatiladi.

## Routelar (BrowserRouter)

| Path                | Sahifa                                   |
| ------------------- | ---------------------------------------- |
| `/`                 | Home                                     |
| `/category/:slug`   | Category (`all`, `pizza`, `favorites`…)  |
| `/product/:id`      | Product                                  |
| `/cart`             | Cart                                     |

## Rasm qo'shish

Hozircha taomlar emoji bilan ko'rsatilgan. O'z rasmlaringizni `src/assets/images/` ga
qo'shib, `src/features/products.js` da `image` maydoniga import qiling.
