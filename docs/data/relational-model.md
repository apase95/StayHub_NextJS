# Physical Relational Model

**Câu hỏi:** Các bảng hiện tại liên kết với nhau bằng key và cardinality nào?

Các field được giới hạn ở identity, foreign key, status và constraint ảnh hưởng
đến quan hệ. Xem data dictionary để biết toàn bộ column.

```mermaid
%%{init: {"theme":"base","themeVariables":{"primaryColor":"#E2E8F0","primaryTextColor":"#0F172A","primaryBorderColor":"#64748B","secondaryColor":"#DBEAFE","secondaryTextColor":"#172554","secondaryBorderColor":"#2563EB","tertiaryColor":"#FEF3C7","tertiaryTextColor":"#451A03","tertiaryBorderColor":"#D97706","lineColor":"#64748B","textColor":"#0F172A","edgeLabelBackground":"#F8FAFC"}}}%%
erDiagram
    USERS {
        TEXT id PK
        VARCHAR email UK
        UserRole role
        UserStatus status
    }
    VERIFICATION_TOKENS {
        TEXT id PK
        TEXT user_id FK
        TIMESTAMPTZ expires_at
        TIMESTAMPTZ used_at
    }
    PROPERTIES {
        TEXT id PK
        TEXT host_id FK
        PropertyStatus status
        NUMERIC price_per_night
        NUMERIC rating_avg
    }
    PROPERTY_IMAGES {
        TEXT id PK
        TEXT property_id FK
        INT display_order
        BOOLEAN is_cover
    }
    AMENITIES {
        TEXT id PK
        VARCHAR name UK
    }
    PROPERTY_AMENITIES {
        TEXT property_id PK,FK
        TEXT amenity_id PK,FK
    }
    DISCOUNT_CODES {
        TEXT id PK
        VARCHAR code UK
        DiscountType type
        INT used_count
    }
    BOOKINGS {
        TEXT id PK
        TEXT property_id FK
        TEXT guest_id FK
        TEXT discount_code_id FK
        DATE check_in_date
        DATE check_out_date
        BookingStatus status
        NUMERIC total_price
    }
    PAYMENTS {
        TEXT id PK
        TEXT booking_id FK,UK
        VARCHAR provider_txn_ref UK
        PaymentStatus status
        NUMERIC amount
    }
    REVIEWS {
        TEXT id PK
        TEXT booking_id FK,UK
        TEXT property_id FK
        TEXT guest_id FK
        SMALLINT rating
    }

    USERS ||--o{ VERIFICATION_TOKENS : owns
    USERS ||--o{ PROPERTIES : hosts
    USERS ||--o{ BOOKINGS : books
    USERS ||--o{ REVIEWS : writes
    PROPERTIES ||--o{ PROPERTY_IMAGES : contains
    PROPERTIES ||--o{ PROPERTY_AMENITIES : maps
    AMENITIES ||--o{ PROPERTY_AMENITIES : maps
    PROPERTIES ||--o{ BOOKINGS : receives
    PROPERTIES ||--o{ REVIEWS : receives
    DISCOUNT_CODES o|--o{ BOOKINGS : applied_to
    BOOKINGS ||--o| PAYMENTS : has
    BOOKINGS ||--o| REVIEWS : produces
```

## Physical constraints not obvious in Prisma

- `bookings.check_out_date > bookings.check_in_date`.
- `reviews.rating BETWEEN 1 AND 5`.
- Mỗi property có tối đa một cover image bằng partial unique index.
- `(property_id, display_order)` và `(property_id, amenity_id)` là unique.
- Database chưa có exclusion constraint để chặn booking overlap.

**Evidence:** `prisma/schema.prisma` và toàn bộ `prisma/migrations`.
