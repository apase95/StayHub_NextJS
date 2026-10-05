# Use Cases

**Câu hỏi:** Actor nào theo đuổi mục tiêu nào trong phạm vi MVP hiện tại?

```mermaid
flowchart LR
    classDef actor fill:#E2E8F0,color:#0F172A,stroke:#64748B,stroke-width:1.5px
    classDef goal fill:#DBEAFE,color:#172554,stroke:#2563EB,stroke-width:1.5px
    classDef partial fill:#FEF3C7,color:#451A03,stroke:#D97706,stroke-width:1.5px

    visitor["Visitor"]:::actor
    guest["Authenticated guest"]:::actor
    host["Host"]:::actor
    admin["Admin"]:::actor

    subgraph stayHub["StayHub"]
        discover(["Discover properties"]):::partial
        authenticate(["Authenticate"]):::goal
        book(["Book and pay"]):::partial
        manageTrips(["Manage own bookings"]):::partial
        review(["Review completed stay"]):::partial
        manageListings(["Manage own listings"]):::goal
        operate(["Manage platform users and resources"]):::partial
    end

    visitor --> discover
    visitor --> authenticate
    guest --> discover
    guest --> book
    guest --> manageTrips
    guest --> review
    host --> manageListings
    admin --> operate
    admin --> manageListings
```

Màu vàng biểu thị capability có backend nhưng UI hoặc lifecycle chưa hoàn chỉnh.
Host approval cho từng booking không thuộc MVP: VNPay IPN xác nhận booking trực
tiếp. Review chưa đạt được qua luồng bình thường vì chưa có transition tự động
sang `COMPLETED`.
