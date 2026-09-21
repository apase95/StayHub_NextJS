# TECHSTACK — DỰ ÁN STAYHUB (Next.js)

## 1. Tổng quan

StayHub được xây dựng theo mô hình **Fullstack Next.js** — frontend và backend API nằm chung trong một repo duy nhất, deploy như một ứng dụng Node.js.

---

## 2. Core Stack

| Tầng | Công nghệ | Phiên bản / Ghi chú |
|---|---|---|
| **Framework** | Next.js (App Router) | 15.x — dùng Server Components mặc định, Client Components khi cần interactivity |
| **Language** | TypeScript | Strict mode bật (`"strict": true` trong `tsconfig.json`) |
| **Runtime** | Node.js | 20 LTS trở lên |
| **Package Manager** | pnpm | Bắt buộc dùng pnpm, không dùng npm/yarn để tránh lock file conflict |

---

## 3. Frontend

| Hạng mục | Công nghệ | Ghi chú |
|---|---|---|
| **CSS Framework** | Tailwind CSS v4 | Config trong `tailwind.config.ts`; dùng `@layer` khi cần override |
| **Component Library** | shadcn/ui | Cài từng component qua `pnpm dlx shadcn@latest add <component>`, không import toàn bộ |
| **Icons** | Lucide React | Đồng bộ với shadcn/ui |
| **State (server)** | React Query (TanStack Query) v5 | Dùng cho data-fetching client-side (availability check, discount validate, payment polling...); không dùng cho data đã có ở Server Components |
| **State (client)** | Zustand | Chỉ dùng khi cần global UI state phức tạp (search params, filter state); tránh overuse |
| **Form** | React Hook Form + Zod | Form validation, kết hợp Zod schema tái sử dụng được ở cả FE lẫn API route |
| **Animation** | Framer Motion | Dùng hạn chế — chỉ cho transition trang, skeleton loader, microinteraction có ý nghĩa |

---

## 4. Backend (Next.js API Routes)

| Hạng mục | Công nghệ | Ghi chú |
|---|---|---|
| **API Layer** | Next.js Route Handlers | Đặt trong `app/api/**`, trả JSON theo chuẩn `ApiResponse<T>` |
| **Auth** | NextAuth.js v5 (Auth.js) | Session-based (JWT session), hỗ trợ Credentials + Google OAuth provider |
| **ORM** | Prisma ORM | Schema ở `prisma/schema.prisma`, migrate bằng `prisma migrate dev/deploy` |
| **Database** | PostgreSQL 16 | Local dùng Docker; production dùng managed Postgres (Supabase/Railway/Neon) |
| **Validation** | Zod | Schema dùng chung cho FE form + API input validation |
| **Password Hashing** | bcryptjs | Dùng trong Credentials provider của NextAuth |
| **Email** | Nodemailer (Gmail SMTP) | Gửi email OTP đăng ký, email xác nhận booking |
| **File Upload** | Cloudinary SDK | Upload ảnh property; local fallback dùng `/public/uploads` khi dev |
| **Payment** | VNPay (HMAC-SHA512) | Tích hợp thủ công theo VNPay docs; không có SDK chính thức |

---

## 5. Tooling & Dev Experience

| Hạng mục | Công nghệ | Ghi chú |
|---|---|---|
| **Linting** | ESLint + `eslint-config-next` | Thêm rule `@typescript-eslint/no-explicit-any` và `no-console` (warn) |
| **Formatting** | Prettier | Tích hợp với ESLint qua `eslint-config-prettier` |
| **Type check** | `tsc --noEmit` | Chạy trong CI trước khi build |
| **Testing** | Jest + React Testing Library + Playwright | Unit test cho service logic; E2E test cho luồng booking và payment |
| **Container** | Docker + Docker Compose | Chỉ cần container cho PostgreSQL khi dev local; app chạy thẳng bằng `pnpm dev` |
| **Migration** | Prisma Migrate | `prisma/migrations/` thay thế Flyway SQL; commit file migration vào Git |

---

## 6. Cấu trúc thư mục dự án

```
StayHub/
├── .github/
│   └── workflows/          ci.yml (lint + typecheck + test)
├── prisma/
│   ├── schema.prisma        Database schema (single source of truth)
│   └── migrations/          Auto-generated migration files (commit vào Git)
├── src/
│   ├── app/                 Next.js App Router
│   │   ├── (public)/        Route group: homepage, search, property detail (không cần auth)
│   │   │   ├── page.tsx     Homepage
│   │   │   ├── search/      Search results
│   │   │   └── properties/[id]/   Property detail
│   │   ├── (auth)/          Login, register pages
│   │   ├── (guest)/         My bookings, booking flow — cần login
│   │   │   ├── bookings/
│   │   │   └── properties/[id]/book/
│   │   ├── (host)/          Host dashboard — cần role HOST
│   │   │   └── host/
│   │   ├── (admin)/         Admin portal — cần role ADMIN
│   │   │   └── admin/
│   │   ├── api/             Route Handlers (API endpoints)
│   │   │   ├── auth/[...nextauth]/   NextAuth handler
│   │   │   ├── properties/
│   │   │   ├── search/
│   │   │   ├── bookings/
│   │   │   ├── payments/
│   │   │   ├── discounts/
│   │   │   ├── reviews/
│   │   │   └── admin/
│   │   ├── layout.tsx       Root layout (font, providers)
│   │   └── globals.css      Tailwind base + CSS variables
│   ├── components/
│   │   ├── ui/              shadcn/ui components (auto-generated, không sửa tay)
│   │   ├── common/          Navbar, Footer, SearchBox, PropertyCard...
│   │   ├── property/        PropertyGallery, AmenitiesList, ReviewList...
│   │   ├── booking/         BookingSummary, DatePicker, PriceSummary...
│   │   ├── host/            HostStats, PropertyForm, BookingRequestCard...
│   │   └── admin/           AdminStats, BookingTable, UserTable...
│   ├── lib/
│   │   ├── prisma.ts        Prisma client singleton
│   │   ├── auth.ts          NextAuth config (providers, callbacks, session)
│   │   ├── api-response.ts  ApiResponse<T> builder
│   │   ├── vnpay.ts         VNPay URL builder + HMAC verifier
│   │   ├── cloudinary.ts    Cloudinary upload helper
│   │   ├── email.ts         Nodemailer send helpers
│   │   └── utils.ts         cn(), formatPrice(), formatDate()...
│   ├── services/            Business logic thuần (không phụ thuộc Next.js/Prisma trực tiếp)
│   │   ├── booking.service.ts    Overlap check, price calculation
│   │   ├── discount.service.ts   Validate + apply discount
│   │   ├── payment.service.ts    VNPay flow orchestration
│   │   └── review.service.ts
│   ├── types/
│   │   ├── index.ts         Global types (Role, BookingStatus, PaymentStatus...)
│   │   └── next-auth.d.ts   Augment Session type với role
│   └── schemas/             Zod schemas dùng chung FE + API
│       ├── auth.schema.ts
│       ├── booking.schema.ts
│       ├── property.schema.ts
│       └── discount.schema.ts
├── public/
│   ├── uploads/             Local fallback cho upload ảnh khi dev
│   └── images/              Static assets (logo, placeholder...)
├── .env.example
├── .env.local               Biến môi trường local (không commit)
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── docker-compose.yml       Chỉ cần service db (PostgreSQL 16)
├── Dockerfile               Dùng khi deploy production bằng container
└── package.json
```

---

## 7. Biến môi trường (.env.local)

```bash
# Database
DATABASE_URL="postgresql://stayhub:password@localhost:5432/stayhub_db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-here"

# Google OAuth (tuỳ chọn)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# Email (Gmail SMTP)
MAIL_HOST="smtp.gmail.com"
MAIL_PORT=587
MAIL_USER="your@gmail.com"
MAIL_PASS="your-app-password"
MAIL_FROM="StayHub <noreply@stayhub.com>"

# Cloudinary
CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""

# VNPay
VNPAY_TMN_CODE=""
VNPAY_HASH_SECRET=""
VNPAY_PAY_URL="https://sandbox.vnpayment.vn/paymentv2/vpcpay.html"
VNPAY_RETURN_URL="http://localhost:3000/payments/vnpay/return"
VNPAY_IPN_URL="http://localhost:3000/api/payments/vnpay/ipn"

# Upload
UPLOAD_USE_CLOUDINARY=false
UPLOAD_MAX_FILE_SIZE_MB=5
UPLOAD_MAX_IMAGES_PER_PROPERTY=10

# Admin bootstrap (dùng một lần, sau đó tắt)
ADMIN_BOOTSTRAP_ENABLED=false
ADMIN_EMAIL=""
ADMIN_PASSWORD=""
```

---

## 8. So sánh với stack cũ (Java/Spring Boot)

| Hạng mục | Stack cũ (Java) | Stack mới (Next.js) |
|---|---|---|
| Framework BE | Spring Boot 3.3 | Next.js 15 Route Handlers |
| Language | Java 21 | TypeScript |
| Template engine | Thymeleaf | React Server Components |
| ORM | JPA/Hibernate | Prisma ORM |
| Auth | Spring Security (session) | NextAuth.js v5 |
| Migration | Flyway (SQL files) | Prisma Migrate |
| Build tool | Maven (`mvnw`) | pnpm |
| CSS | Tailwind (CLI build riêng) | Tailwind CSS v4 (tích hợp Next.js) |
| JS tương tác | Alpine.js / htmx | React Query + React hooks |
| Test | JUnit + Testcontainers | Jest + RTL + Playwright |
| CSRF | Spring Security CSRF filter | NextAuth CSRF token (tích hợp sẵn) |