# HƯỚNG DẪN BƯỚC ĐẦU (FIRST STEP) — DỰ ÁN STAYHUB (Next.js)

---

## BƯỚC 0: CHUẨN BỊ

Đảm bảo máy đã cài:

- **Git**
- **Node.js 20 LTS** trở lên (`node -v` để kiểm tra)
- **pnpm** — bắt buộc, không dùng npm hay yarn
  ```bash
  npm install -g pnpm
  ```
- **Docker + Docker Compose** — chỉ dùng để chạy PostgreSQL local
- **Nhắn username Github** để được add làm Collaborator trước khi clone.

---

## BƯỚC 1: CLONE DỰ ÁN

```bashNext
git clone https://github.com/apase95/StayHub_NextJS.git
cd StayHub
```

---

## BƯỚC 2: CHUYỂN SANG NHÁNH `dev`

```bash
git checkout dev
git pull origin dev
```

---

## BƯỚC 3: TẠO NHÁNH LÀM VIỆC CÁ NHÂN

⚠️ **LUẬT TEAM:** Tuyệt đối không code trực tiếp trên `main` hoặc `dev`. Luôn tạo nhánh riêng từ `dev`.

```bash
# Ví dụ task TSK-010 — trang search results
git checkout -b feature/TSK-010
```

*(feature → tính năng mới · fixbug → sửa bug · chore → setup/config · refactor → cải thiện code)*

---

## BƯỚC 4: CÀI DEPENDENCIES & SETUP MÔI TRƯỜNG

```bash
# Cài toàn bộ package
pnpm install

# Copy file biến môi trường — không commit .env.local
cp .env.example .env.local
```

Mở `.env.local` và điền ít nhất:
```bash
DATABASE_URL="postgresql://stayhub:password@localhost:5432/stayhub_db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="any-random-string-for-dev"
```

*(Các biến Cloudinary, VNPay, Gmail SMTP điền khi làm đến task liên quan)*

---

## BƯỚC 5: KHỞI ĐỘNG DATABASE & CHẠY MIGRATION

```bash
# Khởi động PostgreSQL 16 bằng Docker
docker compose up -d db

# Chạy migration Prisma (tạo bảng trong DB)
pnpm prisma migrate dev

# (Tuỳ chọn) Xem schema trong Prisma Studio
pnpm prisma studio
```

> **Lưu ý:** Mỗi khi pull code mới từ `dev` mà thấy có file mới trong `prisma/migrations/`, chạy lại `pnpm prisma migrate dev` trước khi code tiếp.

---

## BƯỚC 6: CHẠY DỰ ÁN

```bash
pnpm dev
```

Mặc định ứng dụng chạy tại `http://localhost:3000`.

Next.js hỗ trợ Fast Refresh — sửa file TypeScript/TSX là tự reload ngay, không cần restart thủ công.

Để chạy type check và lint trước khi commit:

```bash
pnpm typecheck    # tsc --noEmit
pnpm lint         # eslint
```

Để chạy test:

```bash
pnpm test         # Jest unit tests
pnpm test:e2e     # Playwright E2E tests (cần app đang chạy)
```

Để chạy toàn bộ app (bao gồm DB) bằng Docker:

```bash
docker compose up -d --build
```

---

## BƯỚC 7: CODE, COMMIT, PUSH

```bash
# Kiểm tra những file đã sửa
git status

# Add tất cả
git add .

# Commit với message theo chuẩn
git commit -m "feat: [TSK-010] tạo trang search results với filter sidebar và pagination"

# Push lên Github (lần đầu dùng -u)
git push -u origin feature/TSK-010

# Những lần sau trên cùng nhánh, chỉ cần:
git push
```

---

## BƯỚC 8: TẠO PULL REQUEST

1. Lên Github, bấm **"Compare & pull request"** (nút xanh xuất hiện sau khi push).
2. Đảm bảo **base** là `dev`, **compare** là nhánh của bạn.
3. Viết mô tả ngắn: bạn đã làm gì, có gì cần reviewer chú ý không.
4. Tag một thành viên khác vào **Reviewers**.
5. Bấm **Create pull request** — chờ review xong mới được merge.

---

## CÁC QUY TẮC CẦN NHỚ

**Đồng bộ với `dev` thường xuyên** (đặc biệt nếu task làm nhiều ngày):
```bash
git pull origin dev
```
Nếu có conflict, resolve xong rồi commit tiếp.

**Có migration Prisma mới?** Sau khi pull `dev` thấy file mới trong `prisma/migrations/`:
```bash
pnpm prisma migrate dev
```

**Dọn dẹp nhánh sau khi PR được merge:**
```bash
git checkout dev
git pull origin dev
git branch -d feature/TSK-010
```

**Sửa commit message cuối trước khi push:**
```bash
git commit --amend -m "feat: [TSK-010] tên chính xác hơn"
```

**Không commit các file sau** (đã có trong `.gitignore`):
- `.env.local`
- `node_modules/`
- `.next/`
- `prisma/dev.db` (nếu dùng SQLite khi test)

---

## BOOTSTRAP ADMIN LẦN ĐẦU

Để tạo tài khoản Admin đầu tiên, điền vào `.env.local`:

```bash
ADMIN_BOOTSTRAP_ENABLED=true
ADMIN_EMAIL="admin@stayhub.com"
ADMIN_PASSWORD="your-strong-password"
```

Khởi động app một lần (`pnpm dev`), Admin được tạo tự động. Sau đó tắt flag và xoá 2 biến email/password:

```bash
ADMIN_BOOTSTRAP_ENABLED=false
```

Initializer sẽ không nâng quyền tài khoản GUEST/HOST đã tồn tại.

---