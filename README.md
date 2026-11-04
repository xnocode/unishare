# UniShare · Campus Sharing & Ride-Pooling Platform

<p align="center">
  <img src="public/logo.svg" width="96" height="96" alt="UniShare Logo" />
</p>

<p align="center">
  <strong>The complete peer-to-peer campus marketplace, rental network, and ride-pooling platform for university students.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16.1-black?logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19-blue?logo=react" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5-blue?logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/TailwindCSS-v4-38B2AC?logo=tailwind-css" alt="Tailwind CSS v4" />
  <img src="https://img.shields.io/badge/Prisma-6-2D3748?logo=prisma" alt="Prisma ORM" />
  <img src="https://img.shields.io/badge/Database-SQLite-003B57?logo=sqlite" alt="SQLite" />
</p>

---

## 🌟 Overview

**UniShare** is an all-in-one student-driven campus utility platform engineered specifically for university communities. It empowers students to rent items, share daily campus commutes, exchange internal tokens, and safely navigate student life within an authentic university verification framework.

### Core Modules

1. **Campus Marketplace & Rentals**
   - Peer-to-peer rentals for academic gear (calculators, laptops, chargers, lab equipment, books) and sports equipment.
   - Deposit escrow with automated returns, handover checklists, and rental dispute workflows.
   - Item search, categories, favorites, recommendations, and recent views.

2. **Campus Rides & Pooling**
   - Split rides, rickshaws, and campus commutes with fellow verified students.
   - Search by pickup, destination, time, and seat availability.
   - Ride status tracker (upcoming, active, completed) and mutual student ratings.

3. **Token Wallet & Economy**
   - Campus token ecosystem eliminating awkward cash transactions.
   - Token packages, manual transaction receipt submissions, peer token transfers, and complete ledger history.

4. **Institutional Student Verification**
   - University email verification with 6-digit OTP confirmation.
   - Student identity card submissions (department, academic session, student ID).
   - Admin review queue with approve/reject auditing.

5. **Campus Safety & SOS Assistance**
   - One-tap student SOS trigger with live emergency status updates.
   - Dedicated admin emergency queue with real-time dispatch details.

6. **Admin & Moderation Suite**
   - Listing moderation for products and rides.
   - Rental dispute mediation and evidence review.
   - Payment verification review and student identity KYC.

---

## 🏗️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Server & Client Components)
- **Language**: [TypeScript 5](https://www.typescriptlang.org/)
- **UI & Styling**: [Tailwind CSS v4](https://tailwindcss.com/), Radix UI primitives, Lucide Icons, Framer Motion
- **ORM & Database**: [Prisma ORM](https://www.prisma.io/) with [SQLite](https://www.sqlite.org/)
- **Package Manager**: [Bun](https://bun.sh/) or [npm](https://www.npmjs.com/) / [pnpm](https://pnpm.io/)

---

## 📁 Project Structure

```text
unishare/
├── prisma/
│   ├── schema.prisma        # Prisma data models (Accounts, Sessions, Requests, Codes)
│   └── dev.db               # SQLite database file
├── public/
│   ├── logo.svg             # UniShare official SVG logo
│   └── robots.txt           # Search engine crawlers policy
├── scripts/
│   └── check-routes.py      # Route availability & health check test script
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── (85 screen routes)/ # Individual screen routes (e.g. /marketplace, /create-ride)
│   │   ├── api/             # Backend API routes (/api/auth, /api/verification, /api/views)
│   │   ├── screens/         # Interactive screen gallery & catalog modal viewer
│   │   ├── globals.css      # Design tokens and theme styling
│   │   ├── layout.tsx       # Root application layout
│   │   ├── not-found.tsx    # Styled 404 page
│   │   └── page.tsx         # UniShare landing page
│   ├── components/
│   │   ├── design/          # Design engine & auth event interceptors
│   │   ├── ui/              # Reusable UI component library (Shadcn/Radix)
│   │   └── unishare/        # UniShare-specific branded components (Logo, PageViewer)
│   ├── data/
│   │   └── pages.ts         # Screen directory manifest (85 screens, 11 categories)
│   ├── design-content/      # Typed design modules for all screens
│   ├── hooks/               # Custom React hooks (useToast, useMobile)
│   └── lib/                 # Core utilities (auth, db, utils)
├── .env                     # Local environment configuration
├── .env.example             # Example environment template
├── .gitignore               # Git ignore rules
├── components.json          # Shadcn component configuration
├── package.json             # Project dependencies and npm scripts
└── tsconfig.json            # TypeScript configuration
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 18.18.0 or **Bun** >= 1.0.0
- **Git**

### Installation

1. Clone the repository:
   ```bash
   git clone git@github.com:xnocode/unishare.git
   cd unishare
   ```

2. Install dependencies:
   ```bash
   bun install
   # or
   npm install
   ```

3. Prepare the database:
   ```bash
   # Initialize SQLite database using Prisma
   bun run db:push
   # or
   npx prisma db push
   ```

4. Start the development server:
   ```bash
   bun run dev
   # or
   npm run dev
   ```

5. Open your browser:
   - **Landing Page**: [http://localhost:3000](http://localhost:3000)
   - **Screen Catalog (All 85 Screens)**: [http://localhost:3000/screens](http://localhost:3000/screens)

---

## 📜 Available Scripts

| Command | Description |
| :--- | :--- |
| `bun run dev` | Starts the Next.js development server |
| `bun run build` | Compiles the production build |
| `bun run start` | Runs the compiled production server |
| `bun run lint` | Runs ESLint checks across the codebase |
| `bun run db:push` | Synchronizes the Prisma schema with the SQLite database |
| `bun run db:generate` | Generates the Prisma Client |
| `bun run db:migrate` | Runs Prisma database migrations |
| `bun run db:studio` | Opens Prisma Studio GUI in browser |

---

## 📱 Screen Catalog (85 Screens)

The project includes 85 complete, interactive screens across 11 functional categories:

| Category | Key Screens |
| :--- | :--- |
| **Getting Started** | `home` |
| **Account & Verification** | `create-account`, `confirm-email`, `student-verification`, `verification-pending`, `log-in`, `verification-approved`, `verification-rejected`, `login-2fa-6-digit-otp`, `forgot-password`, `reset-password` |
| **Marketplace** | `campus-home`, `marketplace`, `product-details` |
| **Rentals** | `rental-request-review`, `rental-confirmation`, `my-rentals`, `active-rental`, `completed-rental`, `cancelled-rental`, `rental-dispute`, `favorites`, `recently-viewed` |
| **Discovery** | `recommendations`, `marketplace-search-results`, `notifications`, `recent-activity`, `global-search` |
| **Selling** | `my-products`, `add-product`, `edit-product`, `product-availability` |
| **Rides** | `ride-home-and-search`, `ride-details`, `create-ride`, `ride-request-review`, `ride-request-status`, `my-created-rides`, `my-booked-rides`, `upcoming-ride`, `active-ride`, `completed-ride`, `ride-rating-and-review` |
| **Wallet & Tokens** | `wallet-overview`, `token-packages`, `buy-tokens-order-review`, `payment-method`, `transaction-id-submit`, `payment-verification-pending`, `purchase-success`, `transaction-history`, `select-recipient`, `transfer-tokens`, `transfer-confirmation`, `transfer-success` |
| **Admin** | `student-sos-assistance`, `restricted-admin-dashboard`, `admin-student-verification-review`, `admin-payment-verification-review`, `admin-product-and-ride-moderation`, `admin-rental-disputes-review`, `admin-sos-incident-queue-and-detail` |
| **States & Feedback** | `sos-request-failed`, `sos-request-submitted`, `favorites-empty`, `my-products-empty`, `my-rentals-empty`, `marketplace-no-results`, `ride-now-full`, `item-unavailable`, `invalid-receipt-upload`, `transfer-recovery`, `insufficient-tokens`, `payment-needs-more-information`, `external-checkout-blocked` |
| **Social & Profile** | `deposit-released`, `return-confirmation`, `pickup-confirmation`, `owner-request-declined`, `owner-accepted-booking`, `owner-request-review`, `incoming-rental-requests`, `messages`, `other-student-profile`, `my-profile`, `privacy`, `terms`, `sharing-guide`, `get-help` |

---

## 🔒 Security & Campus Policy

- **Student Verification**: Accounts must verify through educational email and valid student ID documentation.
- **Deposit Protection**: Escrowed tokens protect item owners and renters with photo confirmation at pickup and return.
- **Campus Safety**: Built-in SOS emergency reporting and strict administrative moderation.

---

## 📄 License

This project is proprietary and intended for university campus operations.

