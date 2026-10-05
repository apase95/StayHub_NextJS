# Bookings

| Column | Type | Constraint | Description |
|---|---|---|---|
| `id` | TEXT | PK, `cuid()` | Booking identifier |
| `property_id` | TEXT | FK → properties.id | Booked property |
| `guest_id` | TEXT | FK → users.id | Guest |
| `check_in_date` | DATE | NOT NULL | Check-in |
| `check_out_date` | DATE | NOT NULL | Check-out |
| `guests` | INT | NOT NULL | Guest count |
| `nightly_price` | NUMERIC(12,2) | NOT NULL | Snapshot of nightly price |
| `cleaning_fee` | NUMERIC(12,2) | NOT NULL | Snapshot fee |
| `service_fee` | NUMERIC(12,2) | NOT NULL | Snapshot fee |
| `subtotal_price` | NUMERIC(12,2) | NOT NULL | Price before discount |
| `discount_code_id` | TEXT | FK → discount_codes.id, NULL | Applied discount code |
| `discount_amount` | NUMERIC(12,2) | NOT NULL | Discount snapshot |
| `total_price` | NUMERIC(12,2) | NOT NULL | Final total after discount |
| `status` | VARCHAR(20) | NOT NULL | Booking status |
| `cancelled_at` | TIMESTAMPTZ | NULL | Cancellation timestamp |
| `created_at` | TIMESTAMPTZ | NOT NULL | Creation timestamp |
| `updated_at` | TIMESTAMPTZ | NOT NULL | Last update timestamp |

## Why store price snapshots?

Do not calculate historical booking totals from the current `properties.price_per_night`.

Example:

```text
January booking:
price_per_night = 1,000,000 VND

March:
Host changes property price to 1,500,000 VND
```

The January booking must still preserve:

```text
nightly_price = 1,000,000
```

Therefore:

```text
properties.price_per_night
        ≠
bookings.nightly_price
```

`bookings` stores the financial snapshot at booking time, including discount information. Discount preview on the frontend is not trusted; the backend recalculates `subtotal_price`, `discount_amount`, and `total_price` when creating the booking/payment.


## Booking Lifecycle

**Câu hỏi:** Event nào thực sự thay đổi trạng thái Booking?

```mermaid
%%{init: {"theme":"base","themeVariables":{"primaryColor":"#1E293B","primaryTextColor":"#F8FAFC","primaryBorderColor":"#94A3B8","secondaryColor":"#DBEAFE","secondaryTextColor":"#172554","secondaryBorderColor":"#2563EB","tertiaryColor":"#FEF3C7","tertiaryTextColor":"#451A03","tertiaryBorderColor":"#D97706","lineColor":"#94A3B8","textColor":"#F8FAFC","stateBkg":"#1E293B","stateBorder":"#94A3B8","stateLabelColor":"#F8FAFC","transitionColor":"#94A3B8","transitionLabelColor":"#0F172A","labelBackground":"#F8FAFC","edgeLabelBackground":"#F8FAFC"}}}%%
stateDiagram-v2
    [*] --> PENDING_PAYMENT : create booking
    PENDING_PAYMENT --> CONFIRMED : verified VNPay success
    PENDING_PAYMENT --> CANCELLED : verified VNPay failure
    PENDING_PAYMENT --> CANCELLED : guest or admin cancels
    CONFIRMED --> CANCELLED : guest or admin cancels
    CANCELLED --> [*]
    COMPLETED --> [*]
```

`COMPLETED` tồn tại trong schema và là điều kiện để review, nhưng hiện chưa có
event hoặc route chuyển `CONFIRMED` sang trạng thái này.

If the project later restores Host approval after payment, insert `PENDING_HOST_CONFIRMATION` between `PENDING_PAYMENT` and `CONFIRMED`.

## State transition matrix

| Current | Action | Next |
|---|---|---|
| `PENDING_PAYMENT` | VNPay confirms success through verified IPN | `CONFIRMED` |
| `PENDING_PAYMENT` | VNPay returns failed/cancelled/expired | `CANCELLED` |
| `CONFIRMED` | Guest cancels | `CANCELLED` |
| `CONFIRMED` | Stay completed | `COMPLETED` |

Invalid transitions should raise a business exception.

For example:

```text
COMPLETED → CANCELLED  ❌
CANCELLED → CONFIRMED  ❌
```
