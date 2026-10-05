# Logical Domain Model

**Câu hỏi:** Những concept cốt lõi nào tạo thành domain StayHub và chúng sở hữu
nhau như thế nào?

Diagram này chỉ thể hiện identity, composition và dependency quan trọng; field
vật lý nằm trong [Relational model](relational-model.md).

```mermaid
%%{init: {"theme":"base","themeVariables":{"primaryColor":"#E2E8F0","primaryTextColor":"#0F172A","primaryBorderColor":"#64748B","secondaryColor":"#DBEAFE","secondaryTextColor":"#172554","secondaryBorderColor":"#2563EB","tertiaryColor":"#FEF3C7","tertiaryTextColor":"#451A03","tertiaryBorderColor":"#D97706","lineColor":"#64748B","textColor":"#0F172A","edgeLabelBackground":"#F8FAFC"}}}%%
classDiagram
    direction LR

    class User {
        +String id
        +String email
        +UserRole role
        +UserStatus status
    }
    class Property {
        +String id
        +PropertyType type
        +PropertyStatus status
        +Decimal pricePerNight
        +Decimal ratingAvg
    }
    class Booking {
        +String id
        +Date checkInDate
        +Date checkOutDate
        +Decimal totalPrice
        +BookingStatus status
    }
    class DiscountCode {
        +String code
        +DiscountType type
        +Decimal value
    }
    class Payment {
        +Decimal amount
        +PaymentMethod paymentMethod
        +PaymentStatus status
    }
    class Review {
        +Int rating
        +String comment
    }
    class Amenity {
        +String id
        +String name
    }
    class PropertyImage {
        +String imageUrl
        +Int displayOrder
        +Boolean isCover
    }

    User "1" --> "0..*" Property : hosts
    User "1" --> "0..*" Booking : books
    Property "1" *-- "0..*" PropertyImage : contains
    Property "0..*" --> "0..*" Amenity : offers
    Property "1" --> "0..*" Booking : receives
    DiscountCode "0..1" --> "0..*" Booking : discounts
    Booking "1" *-- "0..1" Payment : payment
    Booking "1" *-- "0..1" Review : review
```

Booking giữ financial snapshot tại thời điểm tạo. Payment và Review là optional
theo schema, dù booking service hiện tạo Payment trong cùng transaction.

**Evidence:** `prisma/schema.prisma`, `src/services/booking.service.ts`,
`src/services/review.service.ts`.
