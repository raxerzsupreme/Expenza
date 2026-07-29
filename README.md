# Expenza

A modern, offline-first expense tracker and management app built with Next.js.

![Expenza](public/vercel.svg)

## Features

- **Track Expenses** - Add, edit, and delete expenses with categories and notes
- **Visualize Spending** - Interactive charts showing spending by category and time trends
- **Manage Categories** - Custom categories with colors, icons, and optional budgets
- **Export Data** - Download your data as CSV, JSON, or Excel (3-sheet workbook)
- **Offline-First** - All data stored locally in IndexedDB, no account required
- **Beautiful UI** - Modern design with smooth animations using Motion

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS + shadcn/ui
- **State**: Zustand
- **Database**: Dexie.js (IndexedDB)
- **Charts**: Recharts
- **Animations**: Motion (Framer Motion)
- **Export**: xlsx (Excel), native CSV/JSON

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page with features and how-it-works |
| `/dashboard` | Summary stats, charts, recent transactions |
| `/expenses` | Expense list with filters, search, and CRUD |
| `/categories` | Category management with budgets |
| `/settings` | Export/Import data, app info |

## Data Storage

All data is stored locally in your browser using IndexedDB. No data is sent to any server. Your financial data stays on your device.

## License

View-Only License - See [LICENSE](LICENSE) for details.
