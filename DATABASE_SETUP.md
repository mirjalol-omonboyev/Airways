# Database Setup Guide - Airways Backend

Loyiha PostgreSQL database bilan ishlash uchun mo'ljallangan. Quyidagi yo'riqnoma orqali database sozlashingiz mumkin.

## 🗄 Database Requirements

- **PostgreSQL 13+**
- **Database Name**: `airways` (yoki istalgan nom)
- **Port**: `5432` (default)

## 🚀 Quick Setup Options

### Option 1: Docker ile Database (Tavsiya etiladi)

```bash
# PostgreSQL Docker container ishga tushirish
docker run --name airways-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=Mirjalol2006 \
  -e POSTGRES_DB=airways \
  -p 5432:5432 \
  -d postgres:15

# Container ishlab turganini tekshirish
docker ps
```

### Option 2: Local PostgreSQL

1. **PostgreSQL o'rnatish** (agar o'rnatilmagan bo'lsa):
   - Windows: [PostgreSQL Downloads](https://www.postgresql.org/download/windows/)
   - Yoki [pgAdmin](https://www.pgadmin.org/) bilan

2. **Database yaratish**:
   ```sql
   CREATE DATABASE airways;
   CREATE USER postgre WITH PASSWORD 'Mirjalol2006';
   GRANT ALL PRIVILEGES ON DATABASE airways TO postgre;
   ```

## 🔧 Environment Configuration

`.env` faylingizni tekshiring:

```env
# Database
DATABASE_URL="postgresql://postgre:Mirjalol2006@localhost:5432/airways?schema=public"
```

**Format**: `postgresql://USERNAME:PASSWORD@HOST:PORT/DATABASE_NAME?schema=public`

## 📦 Database Migration

Database tayyorlagach, quyidagilarni bajaring:

```bash
# 1. Prisma client generate qilish
npx prisma generate

# 2. Migration qilish (database schema yaratish)
npx prisma migrate dev --name init

# 3. Sample data yuklash
npx prisma db seed
```

## ✅ Tekshirish

```bash
# Server ishga tushirish
npm run start:dev

# Database ulanganini tekshirish
# Log'larda "✅ Database connected successfully" yozuvi ko'rinishi kerak
```

## 🐛 Troubleshooting

### 1. Authentication Failed

**Error**: `Authentication failed against database server`
**Solution**:

- Username/password to'g'riligini tekshiring
- PostgreSQL server ishlab turganini tekshiring

### 2. Database Not Found

**Error**: `database "airways" does not exist`
**Solution**:

```sql
CREATE DATABASE airways;
```

### 3. Connection Refused

**Error**: `connect ECONNREFUSED 127.0.0.1:5432`
**Solution**:

- PostgreSQL service ishga tushiring
- Port 5432 ochiq ekanligini tekshiring

### 4. Docker Issues

```bash
# Container logs ko'rish
docker logs airways-postgres

# Container qayta ishga tushirish
docker restart airways-postgres

# Container o'chirish va qayta yaratish
docker rm -f airways-postgres
# Keyin yuqoridagi docker run buyrug'ini qayta bajaring
```

## 🔍 Database Management

### Prisma Studio (Database GUI)

```bash
npx prisma studio
# Browser'da http://localhost:5555 ochiladi
```

### Manual Query

```bash
# Database ga ulanish
psql -h localhost -U postgre -d airways

# Tables ko'rish
\dt

# Exit
\q
```

## 📊 Sample Data

Database seed'landi bo'lsa, quyidagilar mavjud bo'ladi:

- **Admin user**: `admin@airways.com` / `admin123`
- **Airlines**: American Airlines, Delta Air Lines
- **Airports**: JFK, LAX, LHR
- **Sample Flights**: AA100, DL200

## 🔄 Database Reset

Agar database'ni qayta sozlash kerak bo'lsa:

```bash
# Development environment'da FAQAT!
npx prisma migrate reset
```

Bu buyruq:

1. Database'ni tozalaydi
2. Barcha migration'larni qayta qo'llaydi
3. Seed data'ni qayta yuklaydi

---

**Eslatma**: Production environment'da migration reset qilmang!

## 🚀 Production Setup

Production uchun:

1. Secure password ishlating
2. SSL connection yoqing
3. Database backup sozlang
4. Connection pooling o'rrating

```env
# Production example
DATABASE_URL="postgresql://username:secure_password@your-db-host:5432/airways_prod?schema=public&sslmode=require"
```
