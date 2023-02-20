
--down utk backwards dan delete tables

CREATE TABLE "users" (
    "id" bigserial PRIMARY KEY,
    "first_name" varchar NOT NULL,
    "last_name" varchar NOT NULL,
    "email" varchar NOT NULL,
    "password" varchar NOT NULL,
    "role" varchar NOT NULL,
    "mobile_phone" varchar NOT NULL,
    "is_subscribe" varchar NOT NULL
)