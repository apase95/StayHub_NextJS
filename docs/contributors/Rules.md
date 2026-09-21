# QUY CHUẨN LÀM VIỆC CHUNG CỦA DỰ ÁN STAYHUB (PROJECT RULES & CONVENTIONS)

## 1. GIT WORKFLOW & BRANCHING

Dự án áp dụng Github Flow cơ bản:

- **`main` branch:** Source code sạch để deploy Production. Chỉ Leader/PM được phép merge vào.
- **`dev` branch:** Môi trường Staging. Tất cả dev ghép code vào đây để review và test trước khi release. Cấm push thẳng (direct push).
- **Nhánh cá nhân:** Bắt buộc rẽ từ `dev`.
    - `feature/TSK-010` — làm tính năng mới
    - `fixbug/TSK-010` — sửa bug
    - `chore/TSK-001` — setup, config, viết docs
    - `refactor/TSK-015` — refactor, không thay đổi tính năng

---

## 2. QUY TẮC COMMIT MESSAGE (CONVENTIONAL COMMITS)

Bắt buộc có tiền tố và mã task:

```
feat: [TSK-010] tạo trang search results với filter và pagination
fix: [TSK-020] sửa lỗi tính sai tổng tiền khi có discount
chore: [TSK-002] cài đặt shadcn/ui và cấu hình Tailwind v4
refactor: [TSK-015] tách booking price logic ra BookingService
docs: [TSK-029] thêm hướng dẫn setup môi trường local
```

---

## 3. GIT STEP-BY-STEP (QUY TRÌNH HÀNG NGÀY)

```bash
# 1. Về dev, cập nhật code mới nhất
git checkout dev
git pull origin dev

# 2. Tạo nhánh cho task
git checkout -b feature/TSK-010

# 3. Code, commit
git add .
git commit -m "feat: [TSK-010] implement search API với filter và pagination"

# 4. Push lên Github, lần đầu dùng -u
git push -u origin feature/TSK-010
```

Sau khi push: tạo Pull Request từ `feature/TSK-010` → `dev`, tag reviewer. Reviewer approve xong mới được merge.

---

## 4. API STANDARDS (NEXT.JS ROUTE HANDLERS)

### Cấu trúc JSON Response

Mọi Route Handler đều trả về `ApiResponse<T>` thống nhất:

```typescript
// src/lib/api-response.ts
export type ApiResponse<T = null> = {
  success: boolean;
  message: string;
  data: T | null;
  errorCode: string | null;
};

export function ok<T>(data: T, message = "Thành công"): ApiResponse<T> {
  return { success: true, message, data, errorCode: null };
}

export function fail(message: string, errorCode: string | null = null): ApiResponse<null> {
  return { success: false, message, data: null, errorCode };
}
```

Ví dụ response thành công:
```json
{
  "success": true,
  "message": "Lấy danh sách property thành công",
  "data": { "properties": [...], "total": 120, "page": 1 },
  "errorCode": null
}
```

Ví dụ response lỗi:
```json
{
  "success": false,
  "message": "Chỗ ở không còn trống trong khoảng ngày này",
  "data": null,
  "errorCode": "ERR_ROOM_NOT_AVAILABLE"
}
```

### Quy tắc đặt tên Route

Dùng danh từ số nhiều, `kebab-case`, tiền tố `/api/`:

- ✅ `GET /api/properties`
- ✅ `GET /api/properties/[id]`
- ✅ `POST /api/bookings`
- ✅ `POST /api/bookings/check-availability`
- ✅ `POST /api/discounts/validate`
- ✅ `GET /api/payments/vnpay/ipn`
- ❌ `GET /api/getProperty`
- ❌ `POST /api/CreateBooking`

Route Handlers đặt tại `src/app/api/<resource>/route.ts` hoặc `src/app/api/<resource>/[id]/route.ts`.

Các trang (Server Components, page.tsx) dùng route thân thiện không có `/api`:
- ✅ `/search`, `/properties/[id]`, `/host/dashboard`, `/admin/bookings`

### HTTP Status Codes

| Code | Khi nào dùng |
|---|---|
| `200 OK` | GET thành công, PUT/DELETE thành công |
| `201 Created` | POST tạo resource mới thành công |
| `400 Bad Request` | Input sai, thiếu field, validation fail |
| `401 Unauthorized` | Chưa đăng nhập |
| `403 Forbidden` | Đã đăng nhập nhưng không đủ quyền (Guest vào `/admin`) |
| `404 Not Found` | Resource không tồn tại |
| `409 Conflict` | Conflict nghiệp vụ (trùng ngày đặt phòng) |
| `500 Internal Server Error` | Lỗi server không handle được |

### Xử lý lỗi tập trung trong Route Handler

Không `try-catch` rồi nuốt lỗi. Dùng pattern chuẩn:

```typescript
// src/app/api/bookings/route.ts
import { NextResponse } from "next/server";
import { ok, fail } from "@/lib/api-response";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // validate với Zod
    const parsed = createBookingSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(fail("Dữ liệu không hợp lệ"), { status: 400 });
    }
    // xử lý business logic
    const booking = await bookingService.create(parsed.data);
    return NextResponse.json(ok(booking, "Đặt phòng thành công"), { status: 201 });
  } catch (error) {
    if (error instanceof BookingConflictError) {
      return NextResponse.json(fail(error.message, "ERR_ROOM_NOT_AVAILABLE"), { status: 409 });
    }
    console.error("[POST /api/bookings]", error);
    return NextResponse.json(fail("Lỗi hệ thống"), { status: 500 });
  }
}
```

---

## 5. CODE STYLE & CONVENTIONS

### TypeScript / Next.js

- **Files & Folders:** `kebab-case` cho file component (`property-card.tsx`, `booking-summary.tsx`); `camelCase` cho file utility (`formatPrice.ts`); `PascalCase` cho tên component/type/interface bên trong file.
- **Types & Interfaces:** `PascalCase` — `BookingStatus`, `CreateBookingRequest`, `PropertyResponse`.
- **Constants:** `UPPER_SNAKE_CASE` — `MAX_IMAGES_PER_PROPERTY`, `MIN_BOOKING_NIGHTS`.
- **Enums:** Dùng `const` object thay vì TypeScript `enum` để tránh bundle overhead:
  ```typescript
  // ✅
  export const BookingStatus = {
    PENDING_PAYMENT: "PENDING_PAYMENT",
    CONFIRMED: "CONFIRMED",
    CANCELLED: "CANCELLED",
    COMPLETED: "COMPLETED",
  } as const;
  export type BookingStatus = (typeof BookingStatus)[keyof typeof BookingStatus];
  ```

- **Server Component vs Client Component:**
    - Mặc định mọi component đều là Server Component.
    - Chỉ thêm `"use client"` khi thực sự cần: `useState`, `useEffect`, event handlers, React Query hooks, shadcn/ui interactive components.
    - Không `"use client"` ở layout hoặc page nếu không cần thiết.

- **Import order:** external libraries → internal `@/lib` → internal `@/components` → internal `@/types`. Dùng `@/` alias thay vì relative path `../../`.

- **Cấm:**
    - `any` type (dùng `unknown` rồi narrow, hoặc định nghĩa type rõ ràng)
    - `console.log()` trong code khi tạo PR (dùng `console.error()` cho lỗi thật)
    - Return trực tiếp Prisma model ra API response (phải map qua DTO/response type để tránh leak field nhạy cảm như `passwordHash`)

### React / Component

- **Naming:** Component luôn là named export (`export function PropertyCard()`), không dùng default export cho component (ngoại trừ `page.tsx` và `layout.tsx` theo yêu cầu Next.js).
- **Props:** Khai báo type ngay trong file:
  ```typescript
  type PropertyCardProps = {
    property: PropertyListItem;
    showWishlist?: boolean;
  };
  export function PropertyCard({ property, showWishlist = true }: PropertyCardProps) { ... }
  ```
- **shadcn/ui:** Không sửa trực tiếp file trong `src/components/ui/`. Nếu cần custom, tạo wrapper component mới trong `src/components/common/` hoặc `src/components/<feature>/`.
- **Tailwind:** Dùng `cn()` (từ `src/lib/utils.ts`) để merge class conditional. Không viết CSS inline trừ trường hợp đặc biệt (VD: dynamic color từ DB).

### Database & Prisma

- **Schema naming:** `snake_case` cho tên model field trong database (Prisma map tự động sang `camelCase` trong TypeScript):
  ```prisma
  model Booking {
    id          String   @id @default(cuid())
    checkInDate DateTime @map("check_in_date")
    guestId     String   @map("guest_id")
    @@map("bookings")
  }
  ```
- **Migration:** Mọi thay đổi schema phải qua `prisma migrate dev --name <tên_ngắn_gọn>`. File migration tự sinh trong `prisma/migrations/` — commit vào Git, không sửa tay.
- **Prisma Client:** Dùng singleton trong `src/lib/prisma.ts`, không tạo `new PrismaClient()` ở nơi khác.
- **Không trả Prisma model trực tiếp ra API:** Luôn pick/omit field hoặc map qua response type.
  ```typescript
  // ❌ Sai — trả cả passwordHash
  return NextResponse.json(ok(user));
  
  // ✅ Đúng
  const { passwordHash, ...userResponse } = user;
  return NextResponse.json(ok(userResponse));
  ```

### Validation với Zod

- Schema đặt trong `src/schemas/`, tái sử dụng ở cả FE (React Hook Form) và API Route Handler.
- Luôn dùng `.safeParse()` trong Route Handler (không throw trực tiếp), `resolver` của RHF ở phía form.

---

## 6. PHÂN QUYỀN & BẢO VỆ ROUTE

### Middleware (Next.js)

Dùng `middleware.ts` ở root để protect route trước khi render:

```typescript
// middleware.ts
import { auth } from "@/lib/auth";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;

  if (pathname.startsWith("/host") && session?.user.role !== "HOST" && session?.user.role !== "ADMIN") {
    return Response.redirect(new URL("/login", req.url));
  }
  if (pathname.startsWith("/admin") && session?.user.role !== "ADMIN") {
    return Response.redirect(new URL("/", req.url));
  }
  if (["/bookings", "/properties"].some(p => pathname.startsWith(p)) && !session) {
    return Response.redirect(new URL("/login", req.url));
  }
});

export const config = {
  matcher: ["/host/:path*", "/admin/:path*", "/bookings/:path*"],
};
```

### Phân quyền trong Route Handler

```typescript
import { auth } from "@/lib/auth";

export async function POST(request: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json(fail("Chưa đăng nhập"), { status: 401 });
  }
  if (session.user.role !== "HOST") {
    return NextResponse.json(fail("Không có quyền"), { status: 403 });
  }
  // ...
}
```

### Bảng phân quyền

| Khu vực | Role yêu cầu |
|---|---|
| Trang chủ, Search, Property Detail | Public (không cần đăng nhập) |
| Đặt phòng, My Bookings, Viết review | Đăng nhập (bất kỳ role) |
| Host Dashboard, Quản lý property | HOST hoặc ADMIN |
| Admin Portal | ADMIN |

---

## 7. DATA FETCHING PATTERN

### Server Components (mặc định)

Dùng `fetch` hoặc gọi trực tiếp `prisma` trong Server Component / Server Action:

```typescript
// src/app/(public)/search/page.tsx — Server Component
export default async function SearchPage({ searchParams }: { searchParams: SearchParams }) {
  const properties = await searchService.findAvailable(searchParams);
  return <PropertyList properties={properties} />;
}
```

### React Query (Client Components)

Chỉ dùng khi cần:
- Data thay đổi theo user action (availability check, discount validate)
- Polling (payment status)
- Invalidate cache sau mutation (cancel booking, submit review)

```typescript
// src/components/booking/AvailabilityChecker.tsx — "use client"
const { data, isLoading } = useQuery({
  queryKey: ["availability", propertyId, checkIn, checkOut],
  queryFn: () => fetchAvailability(propertyId, checkIn, checkOut),
  enabled: !!(checkIn && checkOut),
});
```

QueryClient Provider đặt ở `src/app/providers.tsx`, import vào `src/app/layout.tsx`.

---