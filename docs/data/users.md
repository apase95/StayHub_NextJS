# Users

| Column | Type | Constraint | Description |
|---|---|---|---|
| `id` | TEXT | PK, `cuid()` | User identifier |
| `email` | VARCHAR(255) | NOT NULL, UNIQUE | Login email |
| `password_hash` | TEXT | NULL | BCrypt hash; null for OAuth-only accounts |
| `full_name` | VARCHAR(150) | NOT NULL | User full name |
| `phone` | VARCHAR(30) | NULL | Contact phone |
| `role` | VARCHAR(20) | NOT NULL | `GUEST`, `HOST`, `ADMIN` |
| `status` | VARCHAR(20) | NOT NULL | `ACTIVE`, `LOCKED` |
| `provider` | VARCHAR(20) | NOT NULL | `LOCAL`, `GOOGLE` |
| `email_verified` | TIMESTAMPTZ | NULL | Verification time |
| `created_at` | TIMESTAMPTZ | NOT NULL | Creation timestamp |
| `updated_at` | TIMESTAMPTZ | NOT NULL | Last update timestamp |

### Recommended constraints

```sql
CONSTRAINT chk_users_role
CHECK (role IN ('GUEST', 'HOST', 'ADMIN'));

CONSTRAINT chk_users_status
CHECK (status IN ('ACTIVE', 'LOCKED'));

CONSTRAINT chk_users_provider
CHECK (provider IN ('LOCAL', 'GOOGLE'));
```

### Authentication notes

- Local registration creates the user and verification token before SMTP delivery, then OTP verification sets `email_verified`.
- Google OAuth login creates or updates a `GOOGLE` user by unique email.
- Email is normalized before persistence and remains the primary unique account identifier.

### Relationships

Xem [Physical relational model](relational-model.md). `User` là parent của
verification token, hosted property, guest booking và authored review.
