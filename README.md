# 🚌 BusHub — Backend API

RESTful API server for the BusHub online bus ticket booking platform. Built with Node.js, Express, Prisma, and PostgreSQL.

---

## 🌐 Live URLs

| Service | URL |
|--------|-----|
| Backend API | https://bus-ticket-booking-backend-six.vercel.app |
| Frontend App | https://bus-ticket-booking-frontend-six.vercel.app |

---

## ✨ Features

- JWT-based authentication with access & refresh tokens (HTTP-only cookies)
- Role-based access control — ADMIN, OPERATOR, PASSENGER
- Bus management — operators can create and manage their own buses
- Route management — admin creates routes, operators assign schedules
- Schedule management — operators create schedules for their own buses only
- Booking system — passengers can book seats on available schedules
- Stripe payment integration
- Automatic past schedule filtering (only future schedules shown publicly)
- Request validation with Zod
- Pagination, filtering, and sorting on all list endpoints

---

## 🛠️ Technologies Used

| Technology | Purpose |
|-----------|---------|
| Node.js | Runtime environment |
| Express.js | Web framework |
| TypeScript | Type safety |
| Prisma ORM | Database ORM |
| PostgreSQL | Relational database |
| JWT | Authentication tokens |
| bcrypt | Password hashing |
| Stripe | Payment processing |
| Zod | Request validation |
| node-cron | Scheduled tasks (auto-complete past schedules) |
| cookie-parser | HTTP-only cookie handling |
| cors | Cross-origin resource sharing |

---

## 🗂️ Project Structure

```
src/
├── app/
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.route.ts
│   │   │   └── auth.validation.ts
│   │   ├── user/
│   │   ├── bus/
│   │   ├── route/
│   │   ├── schedule/
│   │   └── booking/
│   ├── middlewares/
│   │   ├── auth.ts           # Role-based auth guard
│   │   ├── validateRequest.ts
│   │   └── globalErrorHandler.ts
│   ├── utils/
│   │   ├── AppError.ts
│   │   ├── catchAsync.ts
│   │   ├── sendResponse.ts
│   │   └── paginationHelper.ts
│   └── routes/
│       └── index.ts          # All routes registered here
├── prisma/
│   └── schema.prisma         # Database schema
├── app.ts
└── server.ts
```

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js v18+
- PostgreSQL database

### Installation

```bash
# 1. Clone the repository
git clone <your-backend-repo-url>
cd backend

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env
```

### Environment Variables

Create a `.env` file in the root:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/bushub"

# JWT
JWT_ACCESS_SECRET="your_access_secret_key"
JWT_REFRESH_SECRET="your_refresh_secret_key"
JWT_ACCESS_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# App
PORT=5000
CLIENT_URL="http://localhost:3000"
NODE_ENV="development"
```

### Database Setup

```bash
# Run migrations
npx prisma migrate dev

# Generate Prisma client
npx prisma generate

# (Optional) Seed database
npx prisma db seed
```

### Running the Server

```bash
# Development
npm run dev

# Production build
npm run build
npm start
```

Server will run at `http://localhost:5000`

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/v1/auth/register` | Public | Register new user |
| POST | `/api/v1/auth/login` | Public | Login and get tokens |
| POST | `/api/v1/auth/logout` | Auth | Logout and clear cookies |
| POST | `/api/v1/auth/refresh-token` | Public | Refresh access token |

### Users
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/v1/users` | Admin | Get all users |
| GET | `/api/v1/users/me` | Auth | Get current user profile |
| PATCH | `/api/v1/users/me` | Auth | Update profile |

### Buses
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/v1/buses` | Public | Get all buses |
| GET | `/api/v1/buses/my` | Operator | Get operator's own buses |
| GET | `/api/v1/buses/:id` | Public | Get bus by ID |
| POST | `/api/v1/buses` | Operator | Create a bus |
| PATCH | `/api/v1/buses/:id` | Operator | Update a bus |
| DELETE | `/api/v1/buses/:id` | Operator/Admin | Delete a bus |

### Routes
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/v1/routes` | Public | Get routes with future schedules |
| GET | `/api/v1/routes/dropdown` | Operator | Get all routes for dropdown |
| GET | `/api/v1/routes/:id` | Public | Get route by ID |
| POST | `/api/v1/routes` | Admin | Create a route |
| PATCH | `/api/v1/routes/:id` | Admin | Update a route |
| DELETE | `/api/v1/routes/:id` | Admin | Delete a route |

### Schedules
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/v1/schedules` | Public | Search schedules with filters |
| GET | `/api/v1/schedules/:id` | Public | Get schedule by ID |
| POST | `/api/v1/schedules` | Operator | Create a schedule (own bus only) |
| PATCH | `/api/v1/schedules/:id` | Operator | Update a schedule |
| DELETE | `/api/v1/schedules/:id` | Operator/Admin | Delete a schedule |

### Bookings
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/v1/bookings/my` | Passenger | Get own bookings |
| GET | `/api/v1/bookings` | Admin | Get all bookings |
| POST | `/api/v1/bookings` | Passenger | Create a booking |
| PATCH | `/api/v1/bookings/:id` | Admin | Update booking status |

### Payments
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/v1/payments/create-session` | Passenger | Create Stripe checkout session |
| POST | `/api/v1/payments/webhook` | Stripe | Handle Stripe webhook events |

---

## 🔐 Authentication

This API uses **JWT with HTTP-only cookies**.

- `accessToken` — expires in 15 minutes
- `refreshToken` — expires in 7 days

All protected routes require a valid `accessToken` cookie. Use the `/auth/refresh-token` endpoint to get a new access token when it expires.

### Role Hierarchy

```
ADMIN      → Full access to everything
OPERATOR   → Manage own buses and schedules
PASSENGER  → Search, book, and pay for tickets
```

---

## 🛡️ Business Rules

- Operators can **only** create schedules for **their own buses**
- Departure time must be **in the future**
- Arrival time must be **after departure time**
- Past schedules are **automatically hidden** from public routes
- Schedules are marked `completed` automatically after arrival time passes (via cron job)

---

## 🚀 Deployment

Deployed on **Vercel** with a cloud PostgreSQL database.

### Required for deployment
- Set all environment variables in Vercel dashboard
- Add `postinstall` script for Prisma client generation:

```json
"scripts": {
  "postinstall": "prisma generate"
}
```

---

## 👨‍💻 Author

Developed as part of a full-stack web development assignment.

---

## 📄 License

This project is for educational purposes only.
