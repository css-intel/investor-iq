# Investor IQ - Copilot Instructions

## Project Overview
Investor IQ is a comprehensive real estate underwriting platform built with Next.js 14, designed to help investors analyze, evaluate, and submit investment properties to banks.

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

## Key Features
- Property data intake with auto-fill from external APIs
- DSCR (Debt Service Coverage Ratio) calculations
- NOI (Net Operating Income) analysis
- Rent estimation engine with room-based calculations
- Deal scoring system (0-100)
- PDF report generation for bank submissions
- Notification system with custom rules

## Project Structure
```
src/
├── app/                    # Next.js App Router pages
│   ├── deals/             # Deal management pages
│   ├── api/               # API routes
│   └── page.tsx           # Dashboard
├── components/
│   ├── deals/            # Deal-specific components
│   ├── export/           # PDF export components
│   ├── layout/           # Layout components
│   ├── providers/        # Context providers
│   └── ui/               # Reusable UI components
├── engine/
│   ├── underwriting.ts   # DSCR, NOI calculations
│   ├── rent-estimation.ts
│   └── deal-scoring.ts
├── lib/                   # Utilities and clients
├── server/               # tRPC routers
├── services/             # Business logic services
├── store/                # Zustand stores
└── types/                # TypeScript interfaces
```

## Coding Conventions
- Use TypeScript strict mode
- Prefer functional components with hooks
- Use `cn()` utility for conditional classnames
- Follow the existing component patterns in `src/components/ui/`
- Use tRPC procedures for API calls
- Keep business logic in `engine/` and `services/`

## Key Formulas

### DSCR Calculation
```typescript
DSCR = NOI / Annual Debt Service
// Bank-ready threshold: >= 1.25
```

### NOI Calculation
```typescript  
NOI = Annual Gross Income - Annual Operating Expenses
// Does NOT include debt service
```

### Cap Rate
```typescript
Cap Rate = NOI / Purchase Price
```

### Cash on Cash Return
```typescript
Cash on Cash = Annual Net Cash Flow / Total Cash Invested
```

## Development Commands
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run lint     # Run ESLint
npx prisma studio # Open Prisma database UI
npx prisma db push # Push schema changes to database
```
