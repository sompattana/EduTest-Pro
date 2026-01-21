# EduTest Pro - Tezkor Boshlash Qo'llanmasi

## 🚀 5 daqiqada ishga tushirish

### 1. Backend o'rnatish

```bash
# Dependencies o'rnatish
npm install

# PostgreSQL database yaratish
createdb edutest_pro

# .env fayl yaratish va to'ldirish
# Minimal sozlamalar:
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=edutest_pro
JWT_SECRET=your-secret-key-here
PORT=3000
FRONTEND_URL=http://localhost:3001

# Server ishga tushirish
npm run start:dev
```

### 2. Frontend o'rnatish

```bash
cd frontend

# Dependencies o'rnatish
npm install

# Development server
npm run dev
```

### 3. Birinchi admin yaratish

Backend ishga tushgandan keyin, database ga to'g'ridan-to'g'ri admin yaratish:

```sql
-- PostgreSQL da bajarish
INSERT INTO users (id, email, password, "firstName", "lastName", role, "isActive", "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  'admin@example.com',
  '$2b$10$...', -- bcrypt hash (parol: admin123)
  'Admin',
  'User',
  'admin',
  true,
  NOW(),
  NOW()
);
```

Yoki backend kodini o'zgartirib, birinchi foydalanuvchini admin qilish.

### 4. Test yaratish

Admin panel orqali yoki API orqali test yaratish:

```bash
POST /api/admin/exams
Authorization: Bearer <admin-token>

{
  "title": "Matematika testi",
  "subject": "Matematika",
  "price": 5000,
  "duration": 30,
  "passingScore": 60,
  "questions": [
    {
      "text": "2 + 2 = ?",
      "points": 1,
      "order": 1,
      "answers": [
        {"text": "3", "isCorrect": false, "order": 1},
        {"text": "4", "isCorrect": true, "order": 2},
        {"text": "5", "isCorrect": false, "order": 3}
      ]
    }
  ]
}
```

## 📝 Asosiy ishlar

1. **Foydalanuvchi ro'yxatdan o'tadi** → `/register`
2. **Balans to'ldiradi** → `/wallet` (Click/Payme)
3. **Test sotib oladi** → `/exams/:id` → "Testni boshlash"
4. **Test topshiradi** → Vaqt chegaralangan
5. **Natijani ko'radi** → Ball, foiz, to'g'ri/javoblar

## 🔧 To'lov integratsiyasi

### Click:
1. [Click.uz](https://my.click.uz) da merchant ochish
2. Merchant ID, Service ID, Secret Key olish
3. `.env` ga qo'shish
4. Webhook: `https://yourdomain.com/api/payment/click/webhook`

### Payme:
1. [Payme.uz](https://payme.uz) da merchant ochish
2. Merchant ID va Key olish
3. `.env` ga qo'shish
4. Webhook: `https://yourdomain.com/api/payment/payme/webhook`

## 🐛 Muammolarni hal qilish

### Database xatosi:
```bash
# PostgreSQL ishlayaptimi?
pg_isready

# Database mavjudmi?
psql -l | grep edutest_pro
```

### Port band:
```bash
# 3000 port band bo'lsa
PORT=3001 npm run start:dev

# Frontend uchun
# vite.config.ts da port o'zgartirish
```

### CORS xatosi:
```env
# .env da
FRONTEND_URL=http://localhost:3001
```

## 📚 Qo'shimcha ma'lumot

To'liq dokumentatsiya: [README.md](./README.md)
API dokumentatsiya: http://localhost:3000/api/docs
