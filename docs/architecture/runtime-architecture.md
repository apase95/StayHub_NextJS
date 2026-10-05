# Runtime Architecture

**Câu hỏi:** Một request đi qua những boundary và thành phần runtime nào?

**Trạng thái:** Hiện trạng. StayHub là một Next.js application duy nhất, không
phải frontend và backend triển khai độc lập.

```mermaid
%%{init: {"theme":"base","themeVariables":{"lineColor":"#64748B","textColor":"#0F172A","edgeLabelBackground":"#F8FAFC"}}}%%
flowchart TD
    classDef client fill:#E2E8F0,color:#0F172A,stroke:#64748B,stroke-width:1.5px
    classDef service fill:#DBEAFE,color:#172554,stroke:#2563EB,stroke-width:1.5px
    classDef data fill:#FEF3C7,color:#451A03,stroke:#D97706,stroke-width:1.5px
    classDef external fill:#FCE7F3,color:#500724,stroke:#DB2777,stroke-width:1.5px

    browser["Browser"]:::client

    subgraph nextApp["Next.js application"]
        pages["App Router pages"]:::service
        middleware["Auth middleware"]:::service
        routes["Route Handlers /api/*"]:::service
        domain["Domain services"]:::service
        integrations["Integration helpers"]:::service
        prisma["Prisma Client"]:::data

        pages -->|"page navigation"| middleware
        pages -->|"HTTP request"| routes
        routes --> domain
        domain --> prisma
        routes --> integrations
        domain --> integrations
    end

    database[("PostgreSQL")]:::data
    providers["Google / SMTP / VNPay / Cloudinary"]:::external

    browser --> pages
    middleware --> pages
    prisma --> database
    integrations --> providers
```

Middleware chỉ bảo vệ page routes được khai báo trong `middleware.ts`; từng API
route tự kiểm tra session, role và ownership. TanStack Query đã được cấu hình ở
provider nhưng các feature page hiện chưa dùng.

**Evidence:** `src/app/layout.tsx`, `src/app/providers.tsx`, `middleware.ts`,
`src/app/api`, `src/services`, `src/lib/prisma.ts`.

## Current UI Integration

**Câu hỏi:** Những capability backend nào đã được nối tới UI hiện tại?

```mermaid
flowchart LR
    classDef ui fill:#E2E8F0,color:#0F172A,stroke:#64748B,stroke-width:1.5px
    classDef implemented fill:#DBEAFE,color:#172554,stroke:#2563EB,stroke-width:1.5px
    classDef gap fill:#FCE7F3,color:#500724,stroke:#DB2777,stroke-width:1.5px,stroke-dasharray:5 3

    publicUi["Public catalog UI"]:::ui -.->|"mock data"| catalogApi["Property and search APIs"]:::gap
    bookingUi["Booking UI"]:::ui -.->|"simulated success"| bookingApi["Booking and VNPay APIs"]:::gap
    tripsUi["My bookings UI"]:::ui -.->|"local state"| tripsApi["Booking and cancel APIs"]:::gap
    hostUi["Host dashboard"]:::ui -.->|"mock metrics"| hostApi["Partial host APIs"]:::gap
    adminUi["Admin dashboard"]:::ui -.->|"mock metrics"| adminApi["Partial admin APIs"]:::gap
    loginUi["Google login UI"]:::ui --> authApi["Auth.js Google flow"]:::implemented
```

Nét đứt biểu thị capability tồn tại ở server nhưng chưa được UI sử dụng
end-to-end. Đây là mô tả hiện trạng, không phải dependency mục tiêu.
