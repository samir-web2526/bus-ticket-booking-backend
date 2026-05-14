# BusHub Backend

A modern, robust REST API for the BusHub platform, enabling seamless bus ticket bookings, route management, and payment processing.

---

## 📖 Table of Contents

- [About The Project](#about-the-project)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation & Setup](#installation--setup)
- [Environment Variables](#environment-variables)
- [Folder Structure](#folder-structure)
- [Dependencies](#dependencies)
- [Live API](#live-api)
- [Contact](#contact)

---

## About The Project

BusHub Backend is a comprehensive RESTful API built to power the BusHub online bus ticket booking platform. It handles secure user authentication, role-based access control, database interactions for passengers and operators, bus and route management, and payment processing through Stripe. The architecture is modular and scalable, utilizing Express.js, TypeScript, and Prisma ORM.

---

## Features

- Role-based authorization (Admin, Operator, Passenger)
- Secure authentication with JWT & HTTP-only cookies
- Advanced database management using Prisma ORM with PostgreSQL
- Secure payment integration via Stripe Webhooks
- Comprehensive bus, route, and schedule management
- Seat booking and lock management
- Centralized error handling and API response formatting
- Request validation using Zod
- Clean architecture and modular folder structure

---

## Tech Stack

### Core
- Node.js
- Express.js
- TypeScript

### Database & ORM
- PostgreSQL
- Prisma

### Authentication & Security
- JSON Web Tokens (JWT)
- bcrypt (Password Hashing)
- cors
- cookie-parser

### Utilities & Validation
- Zod
- Stripe

---

## Installation & Setup

### Clone the repository

```bash
git clone https://github.com/samir-web2526/bus-ticket-booking-backend.git
```

### Navigate to the project folder

```bash
cd bus-ticket-booking-backend
```

### Install dependencies

```bash
npm install
```

### Setup environment variables

Create a `.env` file in the root directory and add the required environment variables (see [Environment Variables](#environment-variables) section).

### Generate Prisma Client & Run Migrations

```bash
npm run generate
npm run migrate
```

### Run the development server

```bash
npm run dev
```

---

## Environment Variables

Create a `.env` file and configure the following variables:

```env
# Server
NODE_ENV="development"
PORT=5000
FRONTEND_URL="http://localhost:3000"

# Database
DATABASE_URL="postgresql://your_username:your_password@localhost:5432/your_database_name"

# JWT Auth
ACCESS_TOKEN_SECRET="your_access_token_secret"
ACCESS_TOKEN_EXPIRES_IN="86400000"
REFRESH_TOKEN_SECRET="your_refresh_token_secret"
REFRESH_TOKEN_EXPIRES_IN="604800000"

# Admin Seed Info
ADMIN_EMAIL="admin@gmail.com"
ADMIN_PASSWORD="securepassword"
ADMIN_NAME="Admin"
ADMIN_PHONE="0123456789"

# Stripe Payment
STRIPE_SECRET_KEY="your_stripe_secret_key"
STRIPE_WEBHOOK_SECRET="your_stripe_webhook_secret"
```

| Variable Name             | Description                                    |
| ------------------------- | ---------------------------------------------- |
| NODE_ENV                  | Environment (development/production)           |
| PORT                      | Port number for the server                     |
| DATABASE_URL              | PostgreSQL database connection URL             |
| FRONTEND_URL              | Allowed frontend origin for CORS               |
| ACCESS_TOKEN_SECRET       | Secret key for signing access tokens           |
| REFRESH_TOKEN_SECRET      | Secret key for signing refresh tokens          |
| STRIPE_SECRET_KEY         | Secret key for Stripe API                      |
| STRIPE_WEBHOOK_SECRET     | Secret key for verifying Stripe webhooks       |

*(Only key variables described, see `.env` block for full list)*

---

## Folder Structure

```plaintext
bus-ticket-booking-backend/
│
├── prisma/
│   ├── schema/
│   └── migrations/
│
├── src/
│   ├── app/
│   │   ├── errorHelpers/
│   │   ├── middlewares/
│   │   ├── modules/
│   │   │   ├── Auth/
│   │   │   ├── Booking/
│   │   │   ├── Bus/
│   │   │   ├── Payment/
│   │   │   ├── Route/
│   │   │   ├── Schedule/
│   │   │   ├── Seat/
│   │   │   ├── SeatLock/
│   │   │   └── User/
│   │   ├── routes/
│   │   └── utils/
│   │
│   ├── config/
│   ├── seedAdmin/
│   └── server.ts
│
├── .env
├── package.json
└── tsconfig.json
```

---

## Dependencies

```json
"dependencies": {
    "@prisma/adapter-pg": "^7.5.0",
    "@prisma/client": "^7.5.0",
    "bcrypt": "^6.0.0",
    "cookie-parser": "^1.4.7",
    "cors": "^2.8.6",
    "dotenv": "^17.3.1",
    "express": "^5.2.1",
    "http-status": "^2.1.0",
    "jsonwebtoken": "^9.0.3",
    "pg": "^8.20.0",
    "stripe": "^22.1.0",
    "zod": "^4.3.6"
}
```

---

## Live API

🔗 Base URL: https://bus-ticket-booking-backend-six.vercel.app/

---

## Contact

- Portfolio: https://portfolio-kappa-weld-92.vercel.app/
- Email: baishnabsamir26@gmail.com
