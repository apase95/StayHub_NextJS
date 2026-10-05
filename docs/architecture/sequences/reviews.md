# Review Sequence

## Create Review

**Câu hỏi:** Hệ thống bảo đảm review hợp lệ và cập nhật rating nguyên tử thế nào?

**Trạng thái:** API đã triển khai; UI và transition booking sang `COMPLETED` chưa
triển khai.

```mermaid
%%{init: {"theme":"base","themeVariables":{"primaryColor":"#1E293B","primaryTextColor":"#F8FAFC","primaryBorderColor":"#94A3B8","secondaryColor":"#DBEAFE","secondaryTextColor":"#172554","secondaryBorderColor":"#2563EB","tertiaryColor":"#FEF3C7","tertiaryTextColor":"#451A03","tertiaryBorderColor":"#D97706","lineColor":"#94A3B8","textColor":"#F8FAFC","actorBkg":"#1E293B","actorTextColor":"#F8FAFC","actorBorder":"#94A3B8","signalColor":"#F8FAFC","signalTextColor":"#F8FAFC","labelBoxBkgColor":"#1E293B","labelTextColor":"#F8FAFC","noteBkgColor":"#FEF3C7","noteTextColor":"#451A03","noteBorderColor":"#D97706","edgeLabelBackground":"#F8FAFC"}}}%%
sequenceDiagram
    autonumber
    actor guest as Guest
    participant api as POST /api/reviews
    participant review as Review service
    participant db as PostgreSQL

    guest->>api: bookingId, rating, comment?
    api->>api: Require session and validate rating
    api->>review: createReview(input, guestId)
    review->>db: Load owned COMPLETED booking + review
    alt Ineligible or already reviewed
        review-->>guest: Reject request
    else Eligible
        review->>db: Transaction: create Review
        review->>db: Recalculate and update Property.ratingAvg
        review-->>guest: Created review
    end
```
