CREATE TABLE "users" (
    "userId" SERIAL PRIMARY KEY,
    "username" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL UNIQUE,
    "isAdmin" BOOLEAN DEFAULT FALSE,
    "carrotCount" INTEGER DEFAULT 0
);