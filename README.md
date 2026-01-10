# EduTest Pro - Professional Onlayn Imtihon va Sertifikatlash Platformasi

EduTest Pro - bu professional darajadagi onlayn imtihon va sertifikatlash platformasi. Foydalanuvchilar testlar sotib olishadi, to'lov qiladilar va natijalarni ko'radilar. Adminlar testlar yaratadi, foydalanuvchilarni boshqaradi va moliya tahlilini oladilar.

## 🚀 Asosiy xususiyatlar

### Foydalanuvchi qismi:
- ✅ Ro'yxatdan o'tish va tizimga kirish (JWT autentifikatsiya)
- ✅ Balans boshqaruvi (Click/Payme integratsiyasi)
- ✅ Testlar ro'yxati va batafsil ma'lumotlar
- ✅ Vaqt chegaralangan test topshirish
- ✅ Darhol natijalar va reyting jadvali
- ✅ Profil boshqaruvi

### Admin qismi:
- ✅ Testlar yaratish, tahrirlash va boshqarish
- ✅ Foydalanuvchilar ro'yxati va boshqaruvi
- ✅ Moliya tahlili (daromad, tranzaksiyalar)
- ✅ Test statistikasi

## 🛠️ Texnologiyalar

### Backend:
- **NestJS** - Node.js framework
- **TypeORM** - ORM
- **PostgreSQL** - Database
- **JWT** - Autentifikatsiya
- **Swagger** - API dokumentatsiyasi

### Frontend:
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Query** - Data fetching
- **Zustand** - State management

## 📦 O'rnatish

### Talablar:
- Node.js 18+
- PostgreSQL 14+
- npm yoki yarn

### Backend o'rnatish:

```bash
# Dependencies o'rnatish
npm install

# .env fayl yaratish
cp .env.example .env

# .env faylni to'ldirish (PostgreSQL, JWT, Payment sozlamalari)

# Database yaratish
createdb edutest_pro

# Server ishga tushirish
npm run start:dev
```

Backend `http://localhost:3000` da ishlaydi
API dokumentatsiya: `http://localhost:3000/api/docs`

### Frontend o'rnatish:

```bash
cd frontend

# Dependencies o'rnatish
npm install

# Development server ishga tushirish
npm run dev
```

Frontend `http://localhost:3001` da ishlaydi

## 🔧 Konfiguratsiya

### .env fayl (Backend):

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=edutest_pro

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# Server
PORT=3000
NODE_ENV=development

# Payment Gateways
CLICK_MERCHANT_ID=your-click-merchant-id
CLICK_SERVICE_ID=your-click-service-id
CLICK_SECRET_KEY=your-click-secret-key
CLICK_MERCHANT_USER_ID=your-click-merchant-user-id

PAYME_MERCHANT_ID=your-payme-merchant-id
PAYME_KEY=your-payme-key

# Frontend URL
FRONTEND_URL=http://localhost:3001
```

## 📁 Loyiha strukturası

```
EduTest Pro/
├── src/                    # Backend kod
│   ├── auth/              # Autentifikatsiya moduli
│   ├── user/              # Foydalanuvchi moduli
│   ├── wallet/            # Balans moduli
│   ├── exam/              # Test moduli
│   ├── payment/           # To'lov moduli
│   ├── admin/             # Admin moduli
│   └── config/            # Konfiguratsiya
├── frontend/              # Frontend kod
│   ├── src/
│   │   ├── pages/         # Sahifalar
│   │   ├── components/    # Komponentlar
│   │   ├── store/         # State management
│   │   └── services/      # API xizmatlari
└── README.md
```

## 🔐 API Endpoints

### Auth:
- `POST /api/auth/register` - Ro'yxatdan o'tish
- `POST /api/auth/login` - Tizimga kirish
- `GET /api/auth/profile` - Profil ma'lumotlari

### Exam:
- `GET /api/exam/available` - Mavjud testlar
- `POST /api/exam/start` - Testni boshlash
- `GET /api/exam/attempt/:id` - Testni davom ettirish
- `POST /api/exam/submit/:id` - Testni topshirish
- `GET /api/exam/result/:id` - Test natijasi

### Wallet:
- `GET /api/wallet/balance` - Balans
- `GET /api/wallet/transactions` - Tranzaksiyalar

### Payment:
- `POST /api/payment/click/create` - Click to'lov
- `POST /api/payment/payme/create` - Payme to'lov

### Admin:
- `GET /api/admin/users` - Foydalanuvchilar
- `GET /api/admin/finance/stats` - Moliya statistikasi
- `POST /api/admin/exams` - Test yaratish

## 💰 To'lov integratsiyasi

### Click:
1. Click merchant ID va secret key olish
2. `.env` faylga qo'shish
3. Webhook URL ni Click dashboard ga qo'shish: `https://yourdomain.com/api/payment/click/webhook`

### Payme:
1. Payme merchant ID va key olish
2. `.env` faylga qo'shish
3. Webhook URL ni Payme dashboard ga qo'shish: `https://yourdomain.com/api/payment/payme/webhook`

## 🗄️ Database Schema

### Asosiy jadvallar:
- `users` - Foydalanuvchilar
- `wallets` - Balanslar
- `transactions` - Tranzaksiyalar
- `exams` - Testlar
- `questions` - Savollar
- `answers` - Javoblar
- `exam_attempts` - Test topshirishlar
- `exam_answers` - Foydalanuvchi javoblari

## 🚀 Production deployment

1. **Environment variables** ni production qiymatlariga o'zgartiring
2. **Database** ni production PostgreSQL ga ulang
3. **JWT_SECRET** ni kuchli random string bilan almashtiring
4. **CORS** sozlamalarini frontend domain ga moslashtiring
5. **HTTPS** ni yoqing (to'lov integratsiyasi uchun)

```bash
# Production build
npm run build

# Production server
npm run start:prod
```

## 📝 Litsenziya

MIT License

## 👥 Muallif

EduTest Pro - Professional Onlayn Imtihon Platformasi

## 📞 Qo'llab-quvvatlash

Savollar va takliflar uchun issue oching yoki email yuboring.

---

**EduTest Pro** - Bilimni tekshirish va sertifikatlash uchun professional platforma! 🎓

<!-- Update 1 -->

<!-- Update 2 -->

<!-- Update 3 -->

<!-- Update 4 -->

<!-- Update 5 -->

<!-- Update 6 -->

<!-- Update 7 -->

<!-- Update 8 -->

<!-- Update 9 -->

<!-- Update 10 -->

<!-- Update 11 -->

<!-- Update 12 -->

<!-- Update 13 -->

<!-- Update 14 -->

<!-- Update 15 -->

<!-- Update 16 -->

<!-- Update 17 -->

<!-- Update 18 -->

<!-- Update 19 -->

<!-- Update 20 -->

<!-- Update 21 -->

<!-- Update 22 -->

<!-- Update 23 -->

<!-- Update 24 -->

<!-- Update 25 -->

<!-- Update 26 -->

<!-- Update 27 -->

<!-- Update 28 -->

<!-- Update 29 -->

<!-- Update 30 -->

<!-- Update 31 -->

<!-- Update 32 -->

<!-- Update 33 -->

<!-- Update 34 -->

<!-- Update 35 -->

<!-- Update 36 -->

<!-- Update 37 -->

<!-- Update 38 -->

<!-- Update 39 -->
