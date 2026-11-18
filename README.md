
# Foolad Technic - Complaint Management

## روش اول: اجرای پروژه بدون Docker

### 1. اجرای Backend 

```
cd backend
composer install
```

ساخت فایل تنظیمات:

```
copy .env.example .env
```

تولید کلید برنامه:

```
php artisan key:generate
```


```bash
php artisan migrate --seed
php artisan serve
```

Backend:
http://127.0.0.1:8000

### 2. اجرای Frontend 

```
cd frontend
npm install
npm run dev
```

Frontend:
http://localhost:5173

---

## روش دوم: اجرای پروژه با Docker


### 1. اجرای تمام سرویس‌ها

از مسیر اصلی پروژه:

```
docker compose up -d --build
```

### 2. اجرای Migration و Seeder

```
docker compose exec backend php artisan migrate --seed
```

### 3. متوقف کردن پروژه

```
docker compose down
```

### آدرس‌های پروژه

- Frontend: http://localhost:5173
- Backend: http://localhost:8000
- MySQL: localhost:3307
