# Investor IQ

A comprehensive real estate underwriting platform for analyzing, evaluating, and submitting investment properties to banks.

## Features

- **Property Analysis**: Input property details and get instant underwriting metrics
- **DSCR Calculations**: Automatic Debt Service Coverage Ratio calculations with bank-ready indicators
- **NOI Analysis**: Net Operating Income projections with detailed expense breakdowns
- **Rent Estimation**: AI-powered rent estimates based on location, property type, and amenities
- **Deal Scoring**: 0-100 scoring system to evaluate deal quality
- **PDF Reports**: Generate professional bank submission reports
- **Lender Management**: Track submissions and responses from multiple lenders

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL with Prisma ORM
- **API**: tRPC for type-safe APIs
- **State Management**: Zustand
- **PDF Generation**: React-PDF
- **Email**: Resend
- **Authentication**: NextAuth.js

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd investor-iq
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Configure your `.env` file with your database URL and other settings.

5. Set up the database:
```bash
npx prisma db push
npx prisma generate
```

6. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Key Formulas

### DSCR (Debt Service Coverage Ratio)
```
DSCR = NOI / Annual Debt Service
```
Bank-ready threshold: >= 1.25

### NOI (Net Operating Income)
```
NOI = Effective Gross Income - Operating Expenses
```
Note: Does NOT include debt service

### Cap Rate
```
Cap Rate = NOI / Purchase Price
```

### Cash on Cash Return
```
Cash on Cash = Annual Net Cash Flow / Total Cash Invested
```

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
├── components/
│   ├── deals/              # Deal-specific components
│   ├── export/             # PDF export components
│   ├── layout/             # Layout components
│   ├── providers/          # Context providers
│   └── ui/                 # Reusable UI components
├── engine/
│   ├── underwriting.ts     # DSCR, NOI calculations
│   ├── rent-estimation.ts  # Rent estimation logic
│   └── deal-scoring.ts     # Deal scoring algorithm
├── lib/                    # Utilities and clients
├── server/                 # tRPC routers
├── services/               # Business logic services
├── store/                  # Zustand stores
└── types/                  # TypeScript interfaces
```

## Scripts

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run start     # Start production server
npm run lint      # Run ESLint
npm run db:push   # Push Prisma schema to database
npm run db:studio # Open Prisma Studio
npm run db:generate # Generate Prisma client
```

## License

MIT
