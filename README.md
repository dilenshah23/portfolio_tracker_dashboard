# Portfolio Tracker Dashboard

A modern investment portfolio tracker built with Next.js, demonstrating key concepts.

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Data Fetching**: React Query (TanStack Query v5)
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL with Prisma ORM
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod validation
- **Stock Data**: Alpha Vantage API

## Features

- Dashboard showing portfolio summary (total value, gains/losses, day change)
- Real-time stock price updates with caching
- Interactive performance chart with time range selector (1W, 1M, 3M, 1Y, ALL)
- Holdings table with current prices and gain/loss calculations
- Add/remove holdings with form validation
- Responsive design

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Alpha Vantage API key (free at https://www.alphavantage.co/support/#api-key)

### Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file from the example:
   ```bash
   cp .env.example .env
   ```

3. Update `.env` with your database URL and API key:
   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/portfolio_tracker"
   ALPHA_VANTAGE_API_KEY="your-api-key"
   ```

4. Generate Prisma client and push schema to database:
   ```bash
   npm run db:generate
   npm run db:push
   ```

5. (Optional) Seed the database with sample data:
   ```bash
   npm run db:seed
   ```

6. Start the development server:
   ```bash
   npm run dev
   ```

7. Open http://localhost:3000 in your browser

## Project Structure

```
├── app/
│   ├── layout.tsx              # Root layout with providers
│   ├── page.tsx                # Dashboard page
│   ├── holdings/page.tsx       # Holdings management page
│   └── api/
│       ├── holdings/           # Holdings CRUD endpoints
│       ├── prices/             # Stock price endpoint
│       ├── portfolio/          # Portfolio history endpoint
│       └── search/             # Symbol search endpoint
├── components/
│   ├── dashboard/              # Dashboard components
│   ├── holdings/               # Holdings form components
│   └── ui/                     # Reusable UI components
├── hooks/
│   ├── useHoldings.ts          # Holdings CRUD hooks
│   ├── usePrices.ts            # Price fetching hooks
│   └── usePortfolio.ts         # Portfolio calculation hooks
├── lib/
│   ├── db.ts                   # Prisma client singleton
│   ├── alpha-vantage.ts        # Stock API client
│   ├── providers.tsx           # React Query provider
│   └── utils.ts                # Utility functions
├── prisma/
│   ├── schema.prisma           # Database schema
│   └── seed.ts                 # Database seeder
└── types/
    └── index.ts                # TypeScript types
```

## Key Technical Decisions

### 1. React Query for Server State
- Handles caching, background refetching, and stale-while-revalidate pattern
- Automatic cache invalidation on mutations
- 5-minute refetch interval for price updates

### 2. Prisma ORM
- Type-safe database queries
- Easy schema migrations
- Great developer experience with auto-completion

### 3. App Router Architecture
- API routes for backend logic
- Client components for interactivity
- Server-side rendering where beneficial

### 4. API Rate Limiting Strategy
- Alpha Vantage free tier: 25 requests/day
- In-memory caching with 5-minute TTL
- Mock data fallback when API limits are reached

### 5. Optimistic Updates
- Immediate UI feedback on add/remove operations
- Cache invalidation for data consistency

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:push` | Push schema to database |
| `npm run db:migrate` | Run database migrations |
| `npm run db:studio` | Open Prisma Studio |
| `npm run db:seed` | Seed database with sample data |

## Interview Discussion Points

1. **Why React Query over SWR?**
   - More powerful devtools for debugging
   - Better mutation handling with optimistic updates
   - Wider adoption in production applications

2. **Why Prisma over raw SQL?**
   - Type safety prevents runtime errors
   - Auto-generated types from schema
   - Easy migrations and schema versioning

3. **Handling API Rate Limits**
   - Server-side caching reduces API calls
   - Fallback to mock data for development
   - Could extend with Redis for production

4. **Error Handling Strategy**
   - Zod validation for API inputs
   - React Query error states for UI feedback
   - Graceful degradation with loading states
