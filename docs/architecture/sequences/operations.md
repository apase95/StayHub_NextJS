# Operations Sequences

## Manage Property

**Câu hỏi:** Host hoặc Admin thay đổi listing như thế nào?

```mermaid
%%{init: {"theme":"base","themeVariables":{"primaryColor":"#1E293B","primaryTextColor":"#F8FAFC","primaryBorderColor":"#94A3B8","secondaryColor":"#DBEAFE","secondaryTextColor":"#172554","secondaryBorderColor":"#2563EB","tertiaryColor":"#FEF3C7","tertiaryTextColor":"#451A03","tertiaryBorderColor":"#D97706","lineColor":"#94A3B8","textColor":"#F8FAFC","actorBkg":"#1E293B","actorTextColor":"#F8FAFC","actorBorder":"#94A3B8","signalColor":"#F8FAFC","signalTextColor":"#F8FAFC","labelBoxBkgColor":"#1E293B","labelTextColor":"#F8FAFC","noteBkgColor":"#FEF3C7","noteTextColor":"#451A03","noteBorderColor":"#D97706","edgeLabelBackground":"#F8FAFC"}}}%%
sequenceDiagram
    autonumber
    actor operator as Host or Admin
    participant api as Property Route Handler
    participant property as Property service
    participant db as PostgreSQL
    participant media as Cloudinary or local storage

    operator->>api: Create, update, archive, or manage image
    api->>api: Check role and ownership
    alt Image operation
        api->>media: Upload or delete binary
        api->>db: Create, delete, or select image row
    else Property operation
        api->>property: Apply validated mutation
        property->>db: Create, update, or set INACTIVE
    end
    api-->>operator: Updated resource
```

Property được tạo ở `DRAFT`; chưa có workflow chuyển sang `ACTIVE`. Delete endpoint
thực hiện archive sang `INACTIVE`, không xóa vật lý.

## Change User Status

**Câu hỏi:** Admin khóa hoặc mở khóa user như thế nào?

```mermaid
%%{init: {"theme":"base","themeVariables":{"primaryColor":"#1E293B","primaryTextColor":"#F8FAFC","primaryBorderColor":"#94A3B8","secondaryColor":"#DBEAFE","secondaryTextColor":"#172554","secondaryBorderColor":"#2563EB","tertiaryColor":"#FEF3C7","tertiaryTextColor":"#451A03","tertiaryBorderColor":"#D97706","lineColor":"#94A3B8","textColor":"#F8FAFC","actorBkg":"#1E293B","actorTextColor":"#F8FAFC","actorBorder":"#94A3B8","signalColor":"#F8FAFC","signalTextColor":"#F8FAFC","labelBoxBkgColor":"#1E293B","labelTextColor":"#F8FAFC","noteBkgColor":"#FEF3C7","noteTextColor":"#451A03","noteBorderColor":"#D97706","edgeLabelBackground":"#F8FAFC"}}}%%
sequenceDiagram
    autonumber
    actor admin as Admin
    participant api as PATCH /api/admin/users/[id]/status
    participant db as PostgreSQL

    admin->>api: ACTIVE or LOCKED
    api->>api: Require ADMIN and validate status
    api->>db: Update User.status
    db-->>admin: Updated user projection
```

JWT đã phát hành không bị thu hồi ngay; role/status trong token có thể stale.
