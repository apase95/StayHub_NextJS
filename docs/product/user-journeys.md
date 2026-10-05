# User Journeys

## Discovery To Checkout

**Câu hỏi:** Hành trình chính mà Guest muốn hoàn thành là gì?

**Trạng thái:** Thiết kế mục tiêu. UI hiện dùng mock data và chưa nối tới booking
backend; xem [Current UI integration](../architecture/runtime-architecture.md#current-ui-integration).

```mermaid
flowchart LR
    classDef step fill:#DBEAFE,color:#172554,stroke:#2563EB,stroke-width:1.5px
    classDef decision fill:#FEF3C7,color:#451A03,stroke:#D97706,stroke-width:1.5px
    classDef outcome fill:#E2E8F0,color:#0F172A,stroke:#64748B,stroke-width:1.5px

    home["Enter destination and dates"]:::step --> results["Review search results"]:::step
    results --> detail["Inspect property"]:::step
    detail --> available{"Dates available?"}:::decision
    available -->|"No"| results
    available -->|"Yes"| checkout["Review booking and price"]:::step
    checkout --> pay["Complete VNPay checkout"]:::step
    pay --> status{"Payment confirmed by IPN?"}:::decision
    status -->|"No"| failed(["Booking cancelled"]):::outcome
    status -->|"Yes"| confirmed(["Booking confirmed"]):::outcome
```

## Post-booking Journey

**Câu hỏi:** Guest làm gì sau khi booking đã được tạo?

```mermaid
flowchart TD
    classDef step fill:#DBEAFE,color:#172554,stroke:#2563EB,stroke-width:1.5px
    classDef decision fill:#FEF3C7,color:#451A03,stroke:#D97706,stroke-width:1.5px
    classDef outcome fill:#E2E8F0,color:#0F172A,stroke:#64748B,stroke-width:1.5px
    classDef missing fill:#FCE7F3,color:#500724,stroke:#DB2777,stroke-width:1.5px,stroke-dasharray:5 3

    bookings["Open My Bookings"]:::step --> action{"Next action?"}:::decision
    action -->|"View"| detail["View booking detail"]:::step
    action -->|"Cancel"| cancelled(["Booking cancelled"]):::outcome
    detail --> stay["Complete stay"]:::missing
    stay --> review["Submit review"]:::missing
```

Nét đứt biểu thị phần chưa khả dụng end-to-end: UI booking hiện là mock và chưa
có trigger chuyển booking sang `COMPLETED`.
