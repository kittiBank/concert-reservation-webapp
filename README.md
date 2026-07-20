# Concert Reservation Webapp



A full-stack concert seat reservation system built with **Next.js**, **NestJS**, and **PostgreSQL**.

<img width="500" height="250" alt="Screenshot 2569-07-20 at 23 46 42" src="https://github.com/user-attachments/assets/52e96f10-74fd-40ed-a21c-ee5c30659683" />

## Roles

- **USER** — Browse concerts, reserve/cancel seats, view booking history
- **ADMIN** — Manage concerts, view dashboard statistics, access full reservation audit history

Authentication uses **JWT**. User and Admin portals maintain separate login sessions until the token expires.

---

# Features

| Role | Description |
|------|-------------|
| Public | Landing page to choose User or Admin portal |
| Authentication | Register, Login, Logout |
| Admin | Create/Delete concerts, Dashboard statistics, Reservation history |
| User | Browse concerts (including sold out), Reserve one seat, Cancel reservation, View own bookings |

---

# Tech Stack

| Layer | Technology |
|--------|------------|
| Frontend | Next.js 16, React 19, TypeScript, Tailwind CSS |
| Backend | NestJS 11, JWT, class-validator, Cache Manager |
| Database | PostgreSQL 16, Prisma ORM |
| Development | Docker Compose, pnpm |

---

# API

**Base URL**

```
http://localhost:3001
```

**Authorization**

```
Authorization: Bearer <token>
```


## Endpoints

| Method | Endpoint | Access | Request Body |
|--------|----------|--------|--------------|
| POST | `/auth/register` | Public | `{ fullName, email, password }` |
| POST | `/auth/login` | Public | `{ email, password }` |
| GET | `/concerts` | User, Admin | — |
| GET | `/concerts/:id` | User, Admin | — |
| GET | `/concerts/stats` | Admin | — |
| POST | `/concerts` | Admin | `{ name, description, totalSeats }` |
| DELETE | `/concerts/:id` | Admin | — |
| POST | `/reservations` | User | `{ concertId }` |
| DELETE | `/reservations/:id` | User | — |
| GET | `/reservations/me` | User | — |
| GET | `/reservations` | Admin | — |


---

# How to run

## Requirements

- Node.js 20+
- pnpm
- Docker

## 1. Install dependencies

```bash
pnpm install --dir backend
pnpm install --dir frontend
```

## 2. Configure environment variables

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

## 3. Start PostgreSQL

```bash
docker compose up -d postgres
```

## 4. Run migrations & seed

```bash
cd backend

pnpm prisma:migrate
pnpm prisma:seed
```

## 5. Start Backend

```bash
cd backend

pnpm start:dev
```

```
http://localhost:3001
```

## 6. Start Frontend

```bash
cd frontend

pnpm dev
```

```
http://localhost:3000
```

---

# Test Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@example.com | password |
| User | user@example.com | password |

---

# Testing

```bash
cd backend

pnpm test
```
