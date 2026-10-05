# System Context

**Câu hỏi:** StayHub phục vụ actor nào và phụ thuộc vào hệ thống bên ngoài nào?

**Trạng thái:** Hiện trạng, đối chiếu với `src/lib`, `src/app/api` và
`prisma/schema.prisma`.

```mermaid
%%{init: {"theme":"base","themeVariables":{"lineColor":"#64748B","textColor":"#0F172A","edgeLabelBackground":"#F8FAFC"}}}%%
flowchart LR
    classDef actor fill:#E2E8F0,color:#0F172A,stroke:#64748B,stroke-width:1.5px
    classDef system fill:#DBEAFE,color:#172554,stroke:#2563EB,stroke-width:1.5px
    classDef external fill:#FCE7F3,color:#500724,stroke:#DB2777,stroke-width:1.5px

    visitor["Visitor / Guest"]:::actor
    host["Host"]:::actor
    admin["Admin"]:::actor
    stayHub["StayHub"]:::system
    google["Google OAuth"]:::external
    smtp["SMTP Server"]:::external
    vnPay["VNPay"]:::external
    media["Cloudinary / Local Storage"]:::external

    visitor -->|"discover and book"| stayHub
    host -->|"manage listings"| stayHub
    admin -->|"operate platform"| stayHub
    stayHub -->|"OAuth"| google
    stayHub -->|"email"| smtp
    stayHub -->|"checkout and IPN"| vnPay
    stayHub -->|"property images"| media
```

PostgreSQL nằm trong runtime boundary của StayHub và được thể hiện ở
[Runtime architecture](runtime-architecture.md), không phải external actor của
context view này.

**Evidence:** `src/lib/auth.ts`, `src/lib/email.ts`, `src/lib/vnpay.ts`,
`src/lib/cloudinary.ts`.
