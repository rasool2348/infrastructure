<div dir="rtl" lang="fa">

# Infrastructure API — راهنمای Docker و Neon

این پروژه یک API مبتنی بر Node.js/Express است که با **Neon Postgres** کار می‌کند. برای توسعه از **Neon Local** داخل Docker استفاده می‌شود و در production مستقیماً به **Neon Cloud (Serverless)** وصل می‌شود.

## تفاوت Development و Production

| موضوع | Development | Production |
|--------|-------------|------------|
| دیتابیس | Neon Local (پروکسی Docker) | Neon Cloud URL |
| فایل env | `.env.development` | `.env.production` |
| Compose | `docker-compose.dev.yml` | `docker-compose.prod.yml` |
| `DATABASE_URL` | `postgres://neon:npg@neon-local:5432/neondb` | `postgresql://...@....neon.tech/...` |
| برنچ DB | ephemeral (با استاپ کانتینر پاک می‌شود) | برنچ پایدار در Neon |

> **نکته مهم:** نام کاربری/رمز Neon Local همیشه `neon` / `npg` است (ثابت در پروکسی). این با یوزر/پسورد واقعی Neon Cloud فرق دارد.

---

## پیش‌نیازها

- Docker و Docker Compose
- حساب [Neon](https://console.neon.tech) + `NEON_API_KEY` و `NEON_PROJECT_ID`
- (اختیاری) Node.js 22+ برای اجرای بدون Docker

---

## راه‌اندازی محلی با Neon Local

### ۱) فایل محیط را آماده کنید

```bash
cp .env.development.example .env.development
```

مقادیر زیر را در `.env.development` پر کنید:

- `NEON_API_KEY` — از Neon Console → Account → API Keys
- `NEON_PROJECT_ID` — از Project Settings → General
- `PARENT_BRANCH_ID` — اختیاری؛ اگر خالی باشد از default branch پروژه ساخته می‌شود
- `ARCJET_KEY` و `JWT_SECRET`

### ۲) استک توسعه را بالا بیاورید

```bash
npm run docker:dev
# معادل:
# docker compose -f docker-compose.dev.yml --env-file .env.development up --build
```

این دستور دو سرویس را اجرا می‌کند:

1. **`neon-local`** — پروکسی محلی که یک **ephemeral branch** می‌سازد
2. **`app`** — اپلیکیشن با hot-reload (`npm run dev`)

### ۳) اتصال اپ به دیتابیس در Dev

داخل شبکه Compose:

```text
DATABASE_URL=postgres://neon:npg@neon-local:5432/neondb
NEON_LOCAL=true
NEON_LOCAL_HOST=neon-local
```

اگر اپ را روی میزبان (خارج از Docker) اجرا می‌کنید:

```text
DATABASE_URL=postgres://neon:npg@localhost:5432/neondb
NEON_LOCAL=true
NEON_LOCAL_HOST=localhost
```

سپس مایگریشن‌ها:

```bash
docker compose -f docker-compose.dev.yml --env-file .env.development exec app npm run db:migrate
```

### ۴) خاموش کردن

```bash
npm run docker:dev:down
```

با توقف کانتینر Neon Local، برنچ ephemeral به‌صورت پیش‌فرض حذف می‌شود (`DELETE_BRANCH=true`).

---

## استقرار Production با Neon Cloud

### ۱) فایل محیط را آماده کنید

```bash
cp .env.production.example .env.production
```

`DATABASE_URL` را از Neon Console (Connection string) کپی کنید — چیزی شبیه:

```text
postgresql://USER:PASSWORD@ep-xxxx.region.aws.neon.tech/neondb?sslmode=require
```

**هرگز** Neon Local را در production اجرا نکنید و `NEON_LOCAL` را ست نکنید.

### ۲) اجرا

```bash
npm run docker:prod
# معادل:
# docker compose -f docker-compose.prod.yml --env-file .env.production up --build -d
```

در production فقط سرویس `app` اجرا می‌شود؛ دیتابیس روی Neon Cloud (serverless) است و داخل Docker نیست.

### ۳) تزریق امن Secretها

بهتر است به‌جای commit کردن `.env.production`، متغیرها را از CI/CD یا Secret Manager تزریق کنید:

```bash
export DATABASE_URL="postgresql://..."
export ARCJET_KEY="..."
export JWT_SECRET="..."
docker compose -f docker-compose.prod.yml up --build -d
```

---

## سوئیچ `DATABASE_URL`

بارگذاری env از طریق `src/config/env.js`:

1. اول `.env.${NODE_ENV}` (مثلاً `.env.development` یا `.env.production`)
2. سپس fallback به `.env`

| محیط | منبع `DATABASE_URL` |
|------|---------------------|
| Dev (Compose) | override در `docker-compose.dev.yml` → `neon-local` |
| Prod (Compose) | از `.env.production` یا env سیستم → Neon Cloud |
| بدون Docker | فایل `.env.development` / `.env.production` |

در Dev، درایور `@neondatabase/serverless` با `NEON_LOCAL=true` روی HTTP به پروکسی وصل می‌شود (`http://neon-local:5432/sql`).

---

## ساختار فایل‌های Docker

```text
Dockerfile                 # multi-stage: development / production
docker-compose.dev.yml     # app + neon-local
docker-compose.prod.yml    # فقط app → Neon Cloud
.env.development           # تنظیمات محلی (gitignore)
.env.production            # تنظیمات prod (gitignore)
.env.*.example             # قالب‌های قابل commit
```

---

## Healthcheck

بعد از بالا آمدن سرویس:

```bash
curl http://localhost:3000/health
```

</div>
