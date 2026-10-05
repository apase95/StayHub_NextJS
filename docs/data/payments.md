# Payments


| Column | Type | Constraint | Description |
|---|---|---|---|
| `id` | TEXT | PK, `cuid()` | Payment identifier |
| `booking_id` | TEXT | FK, UNIQUE | Related booking |
| `payment_method` | VARCHAR(20) | NOT NULL | `MOCK`, `VNPAY`, `MOMO` |
| `status` | VARCHAR(20) | NOT NULL | Payment state |
| `amount` | NUMERIC(12,2) | NOT NULL | Payment amount |
| `currency` | VARCHAR(3) | NOT NULL | `VND` |
| `provider_txn_ref` | VARCHAR(100) | UNIQUE | VNPay `vnp_TxnRef` |
| `provider_transaction_no` | VARCHAR(100) | NULL | VNPay `vnp_TransactionNo` |
| `raw_response` | JSONB | NULL | Raw gateway response for audit/debugging |
| `paid_at` | TIMESTAMPTZ | NULL | Success time |
| `created_at` | TIMESTAMPTZ | NOT NULL | Creation timestamp |

## Payment states

```text
PENDING
SUCCESS
FAILED
CANCELLED
EXPIRED
REFUNDED
```

## Payment Lifecycle

**Câu hỏi:** Payment status nào có transition được triển khai trong code?

```mermaid
%%{init: {"theme":"base","themeVariables":{"primaryColor":"#1E293B","primaryTextColor":"#F8FAFC","primaryBorderColor":"#94A3B8","secondaryColor":"#DBEAFE","secondaryTextColor":"#172554","secondaryBorderColor":"#2563EB","tertiaryColor":"#FEF3C7","tertiaryTextColor":"#451A03","tertiaryBorderColor":"#D97706","lineColor":"#94A3B8","textColor":"#F8FAFC","stateBkg":"#1E293B","stateBorder":"#94A3B8","stateLabelColor":"#F8FAFC","transitionColor":"#94A3B8","transitionLabelColor":"#0F172A","labelBackground":"#F8FAFC","edgeLabelBackground":"#F8FAFC"}}}%%
stateDiagram-v2
    [*] --> PENDING : create booking payment
    PENDING --> SUCCESS : verified VNPay success
    PENDING --> FAILED : verified VNPay non-success
    SUCCESS --> SUCCESS : repeated success IPN
    SUCCESS --> [*]
    FAILED --> [*]
```

`CANCELLED`, `EXPIRED` và `REFUNDED` có trong enum nhưng chưa có transition được
triển khai. Interaction đầy đủ nằm tại
[VNPay IPN](../architecture/sequences/booking-and-payment.md#vnpay-ipn).

### Recommended business sequence

```text
1. Validate request
2. Check property availability
3. Calculate subtotal
4. Validate discount again on backend
5. Create booking with PENDING_PAYMENT
6. Create payment with PENDING and provider_txn_ref
7. Redirect to VNPay checkout URL
8. VNPay calls IPN/webhook
9. Verify secure hash and amount
10. If payment SUCCESS:
      payment = SUCCESS
      booking = CONFIRMED
      increment discount usage if applicable
11. Integrate the existing status endpoint into the result page (not wired yet)
```

## VNPay verification rules

- Treat IPN/webhook as the source of truth; return URL is for user experience only.
- Always verify `vnp_SecureHash` using `VNPAY_HASH_SECRET`.
- Always compare `vnp_Amount / 100` against `payments.amount`.
- Updates must be idempotent because VNPay can retry IPN.
- Never log `VNPAY_HASH_SECRET`.
- Do not mark booking confirmed from frontend-only success URL.
