# Discounts

Discounts are applied during booking price calculation and must be revalidated on the backend when creating a payment. The frontend discount preview is only a convenience for the user.

| Column | Type | Constraint | Description |
|---|---|---|---|
| `id` | TEXT | PK, `cuid()` | Discount identifier |
| `code` | VARCHAR(50) | NOT NULL, UNIQUE | Public promo code, stored uppercase |
| `type` | VARCHAR(20) | NOT NULL | `PERCENT`, `FIXED` |
| `value` | NUMERIC(12,2) | NOT NULL | Percentage or fixed amount depending on type |
| `cap` | NUMERIC(12,2) | NULL | Cap for percent discounts |
| `minimum_amount` | NUMERIC(12,2) | NOT NULL, default 0 | Minimum subtotal required |
| `start_date` | TIMESTAMPTZ | NULL | Valid from |
| `end_date` | TIMESTAMPTZ | NULL | Valid until |
| `usage_limit` | INT | NULL | Global usage limit |
| `used_count` | INT | NOT NULL | Successful paid usages |
| `is_active` | BOOLEAN | NOT NULL | Whether code can be used |
| `created_at` | TIMESTAMPTZ | NOT NULL | Creation timestamp |

## Recommended constraints

```sql
CONSTRAINT chk_discount_type
CHECK (type IN ('PERCENT', 'FIXED'));

CONSTRAINT chk_discount_value_positive
CHECK (value > 0);

CONSTRAINT chk_discount_used_count
CHECK (used_count >= 0);
```

## Calculation rules

```text
subtotal_price = nightly_price * nights + cleaning_fee + service_fee

PERCENT:
discount_amount = subtotal_price * value / 100
discount_amount = min(discount_amount, cap) when cap exists

FIXED:
discount_amount = min(value, subtotal_price)

total_price = subtotal_price - discount_amount
```

## Usage rules

- A code is valid only when `is_active = true` and current time is between `start_date` and `end_date` if they are set.
- `subtotal_price` must satisfy `minimum_amount`.
- `used_count` is incremented only after payment becomes `SUCCESS` through a verified payment callback.
- If payment fails/cancels/expires, do not increment `used_count`.
- Backend must revalidate the code when creating booking/payment; never trust discount amount from frontend.

## Discount validation flow

**Câu hỏi:** Một discount code phải vượt qua các điều kiện nào trước khi trả về
discount amount?

```mermaid
%%{init: {"theme":"base","themeVariables":{"lineColor":"#64748B","textColor":"#0F172A","edgeLabelBackground":"#F8FAFC"}}}%%
flowchart TD
    classDef process fill:#DBEAFE,color:#172554,stroke:#2563EB,stroke-width:1.5px
    classDef decision fill:#FEF3C7,color:#451A03,stroke:#D97706,stroke-width:1.5px
    classDef outcome fill:#E2E8F0,color:#0F172A,stroke:#64748B,stroke-width:1.5px
    input(["Validate code and subtotal"]) --> load["Load DiscountCode"]:::process
    load --> valid{"Active, in date range,<br/>under limit and minimum met?"}:::decision
    valid -->|"No"| reject(["Invalid discount"]):::outcome
    valid -->|"Yes"| calculate["Calculate percent or fixed amount"]:::process
    calculate --> result(["Return discount amount"]):::outcome
```

Booking service luôn tính lại subtotal và gọi validation lần nữa; preview từ
client không phải source of truth.
