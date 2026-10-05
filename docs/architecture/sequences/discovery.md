# Discovery Sequences

## Search API

**Câu hỏi:** Backend tìm property khả dụng như thế nào?

**Trạng thái:** API đã triển khai; search page hiện lọc mock data và chưa gọi API.

```mermaid
%%{init: {"theme":"base","themeVariables":{"primaryColor":"#1E293B","primaryTextColor":"#F8FAFC","primaryBorderColor":"#94A3B8","secondaryColor":"#DBEAFE","secondaryTextColor":"#172554","secondaryBorderColor":"#2563EB","tertiaryColor":"#FEF3C7","tertiaryTextColor":"#451A03","tertiaryBorderColor":"#D97706","lineColor":"#94A3B8","textColor":"#F8FAFC","actorBkg":"#1E293B","actorTextColor":"#F8FAFC","actorBorder":"#94A3B8","signalColor":"#F8FAFC","signalTextColor":"#F8FAFC","labelBoxBkgColor":"#1E293B","labelTextColor":"#F8FAFC","noteBkgColor":"#FEF3C7","noteTextColor":"#451A03","noteBorderColor":"#D97706","edgeLabelBackground":"#F8FAFC"}}}%%
sequenceDiagram
    autonumber
    actor visitor as Visitor
    participant api as GET /api/search
    participant search as Search service
    participant property as Property service
    participant db as PostgreSQL

    visitor->>api: filters, dates, page
    api->>api: Validate query
    api->>search: searchProperties(filters)
    search->>search: Build property and overlap predicates
    search->>property: listProperties(where, page)
    property->>db: Query ACTIVE properties + relations
    db-->>property: Properties and total count
    property-->>visitor: Paginated result
```

`sort` được schema chấp nhận nhưng service chưa áp dụng; amenity filter hiện có
nghĩa “có ít nhất một amenity được chọn”.
