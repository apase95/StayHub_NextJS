# Booking And Payment Sequences

## Create Booking And Checkout

**Câu hỏi:** Backend tạo price snapshot và VNPay checkout như thế nào?

**Trạng thái:** Backend đã triển khai; booking page hiện chưa gọi flow này.

```mermaid
%%{init: {"theme":"base","themeVariables":{"primaryColor":"#1E293B","primaryTextColor":"#F8FAFC","primaryBorderColor":"#94A3B8","secondaryColor":"#DBEAFE","secondaryTextColor":"#172554","secondaryBorderColor":"#2563EB","tertiaryColor":"#FEF3C7","tertiaryTextColor":"#451A03","tertiaryBorderColor":"#D97706","lineColor":"#94A3B8","textColor":"#F8FAFC","actorBkg":"#1E293B","actorTextColor":"#F8FAFC","actorBorder":"#94A3B8","signalColor":"#F8FAFC","signalTextColor":"#F8FAFC","labelBoxBkgColor":"#1E293B","labelTextColor":"#F8FAFC","noteBkgColor":"#FEF3C7","noteTextColor":"#451A03","noteBorderColor":"#D97706","edgeLabelBackground":"#F8FAFC"}}}%%
sequenceDiagram
    autonumber
    actor guest as Guest
    participant api as POST /api/bookings
    participant booking as Booking service
    participant discount as Discount service
    participant db as PostgreSQL
    participant vnpay as VNPay helper

    guest->>api: propertyId, dates, guests, discountCode?
    api->>api: Require session and validate input
    api->>booking: createBooking(input, guestId)
    booking->>db: Load ACTIVE property and blocking bookings
    alt Invalid or unavailable
        booking-->>guest: 400 / 404 / 409
    else Available
        booking->>booking: Calculate server-side price snapshot
        opt Discount supplied
            booking->>discount: Revalidate code and subtotal
            discount->>db: Load DiscountCode
        end
        booking->>db: Transaction: create Booking + Payment
        booking->>vnpay: Sign checkout parameters
        vnpay-->>guest: bookingId + checkout URL
    end
```

Availability check nằm trước transaction và database chưa có exclusion
constraint, vì vậy concurrent requests vẫn có nguy cơ double booking.

## VNPay IPN

**Câu hỏi:** Callback nào quyết định kết quả payment và booking?

```mermaid
%%{init: {"theme":"base","themeVariables":{"primaryColor":"#1E293B","primaryTextColor":"#F8FAFC","primaryBorderColor":"#94A3B8","secondaryColor":"#DBEAFE","secondaryTextColor":"#172554","secondaryBorderColor":"#2563EB","tertiaryColor":"#FEF3C7","tertiaryTextColor":"#451A03","tertiaryBorderColor":"#D97706","lineColor":"#94A3B8","textColor":"#F8FAFC","actorBkg":"#1E293B","actorTextColor":"#F8FAFC","actorBorder":"#94A3B8","signalColor":"#F8FAFC","signalTextColor":"#F8FAFC","labelBoxBkgColor":"#1E293B","labelTextColor":"#F8FAFC","noteBkgColor":"#FEF3C7","noteTextColor":"#451A03","noteBorderColor":"#D97706","edgeLabelBackground":"#F8FAFC"}}}%%
sequenceDiagram
    autonumber
    participant vnpay as VNPay
    participant ipn as GET /api/payments/vnpay/ipn
    participant db as PostgreSQL
    participant mail as SMTP

    vnpay->>ipn: Callback parameters + secure hash
    ipn->>db: Find Payment by providerTxnRef
    alt Missing payment
        ipn-->>vnpay: RspCode 01
    else Invalid checksum or amount
        ipn-->>vnpay: RspCode 97
    else Already SUCCESS
        ipn-->>vnpay: RspCode 00
    else Verified success
        ipn->>db: Transaction: Payment SUCCESS + Booking CONFIRMED
        ipn->>db: Increment discount usage if present
        ipn->>mail: Send confirmation
        ipn-->>vnpay: RspCode 00
    else Verified non-success
        ipn->>db: Payment FAILED + Booking CANCELLED
        ipn-->>vnpay: RspCode 00
    end
```

IPN là source of truth. Return page hiện tin query string và luôn hiển thị thành
công; status endpoint đã tồn tại nhưng chưa được page gọi.

## Cancel Booking

**Câu hỏi:** Cancellation hiện thay đổi dữ liệu nào?

```mermaid
%%{init: {"theme":"base","themeVariables":{"primaryColor":"#1E293B","primaryTextColor":"#F8FAFC","primaryBorderColor":"#94A3B8","secondaryColor":"#DBEAFE","secondaryTextColor":"#172554","secondaryBorderColor":"#2563EB","tertiaryColor":"#FEF3C7","tertiaryTextColor":"#451A03","tertiaryBorderColor":"#D97706","lineColor":"#94A3B8","textColor":"#F8FAFC","actorBkg":"#1E293B","actorTextColor":"#F8FAFC","actorBorder":"#94A3B8","signalColor":"#F8FAFC","signalTextColor":"#F8FAFC","labelBoxBkgColor":"#1E293B","labelTextColor":"#F8FAFC","noteBkgColor":"#FEF3C7","noteTextColor":"#451A03","noteBorderColor":"#D97706","edgeLabelBackground":"#F8FAFC"}}}%%
sequenceDiagram
    autonumber
    actor caller as Guest or Admin
    participant api as PATCH /api/bookings/[id]/cancel
    participant booking as Booking service
    participant db as PostgreSQL

    caller->>api: Cancel booking
    api->>api: Authenticate caller
    api->>booking: cancelBooking(id, caller)
    booking->>db: Load booking
    alt Not owner/admin or state is ineligible
        booking-->>caller: Reject request
    else PENDING_PAYMENT or CONFIRMED
        booking->>db: Set Booking CANCELLED + cancelledAt
        booking-->>caller: Updated booking
    end
```

Hiện tại flow không cập nhật Payment, không refund qua VNPay và không gửi email.
