# Authentication Sequences

## Local Registration And OTP

**Câu hỏi:** Backend tạo và xác minh tài khoản local như thế nào?

**Trạng thái:** API đã triển khai; form đăng ký và OTP trên UI chưa triển khai.

```mermaid
%%{init: {"theme":"base","themeVariables":{"primaryColor":"#1E293B","primaryTextColor":"#F8FAFC","primaryBorderColor":"#94A3B8","secondaryColor":"#DBEAFE","secondaryTextColor":"#172554","secondaryBorderColor":"#2563EB","tertiaryColor":"#FEF3C7","tertiaryTextColor":"#451A03","tertiaryBorderColor":"#D97706","lineColor":"#94A3B8","textColor":"#F8FAFC","actorBkg":"#1E293B","actorTextColor":"#F8FAFC","actorBorder":"#94A3B8","signalColor":"#F8FAFC","signalTextColor":"#F8FAFC","labelBoxBkgColor":"#1E293B","labelTextColor":"#F8FAFC","noteBkgColor":"#FEF3C7","noteTextColor":"#451A03","noteBorderColor":"#D97706","edgeLabelBackground":"#F8FAFC"}}}%%
sequenceDiagram
    autonumber
    actor guest as Guest
    participant register as POST /api/auth/register
    participant db as PostgreSQL
    participant mail as SMTP
    participant verify as POST /api/auth/verify-otp

    guest->>register: email, password, fullName
    register->>db: Check unique email
    register->>db: Create User + hashed OTP token
    register->>mail: Send plain OTP
    register-->>guest: Registration accepted
    guest->>verify: email, OTP
    verify->>db: Load latest valid unused token
    verify->>verify: Compare OTP hash
    verify->>db: Mark token used + email verified
    verify-->>guest: Verification result
```

## Google Login

**Câu hỏi:** Google identity được ánh xạ vào StayHub session như thế nào?

```mermaid
%%{init: {"theme":"base","themeVariables":{"primaryColor":"#1E293B","primaryTextColor":"#F8FAFC","primaryBorderColor":"#94A3B8","secondaryColor":"#DBEAFE","secondaryTextColor":"#172554","secondaryBorderColor":"#2563EB","tertiaryColor":"#FEF3C7","tertiaryTextColor":"#451A03","tertiaryBorderColor":"#D97706","lineColor":"#94A3B8","textColor":"#F8FAFC","actorBkg":"#1E293B","actorTextColor":"#F8FAFC","actorBorder":"#94A3B8","signalColor":"#F8FAFC","signalTextColor":"#F8FAFC","labelBoxBkgColor":"#1E293B","labelTextColor":"#F8FAFC","noteBkgColor":"#FEF3C7","noteTextColor":"#451A03","noteBorderColor":"#D97706","edgeLabelBackground":"#F8FAFC"}}}%%
sequenceDiagram
    autonumber
    actor guest as Guest
    participant auth as Auth.js
    participant google as Google OAuth
    participant db as PostgreSQL

    guest->>auth: Sign in with Google
    auth->>google: OAuth authorization
    google-->>auth: Verified profile
    auth->>db: Upsert User by email
    db-->>auth: User id and role
    auth-->>guest: JWT session
```

**Known gap:** Google callback hiện không từ chối user có status `LOCKED`.
