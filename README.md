# Expenza

A modern, offline-first expense tracker and management app built with Next.js.

![Expenza](public/expenza.png)

## Features

- **Track Expenses** - Add, edit, and delete expenses with categories and notes
- **Visualize Spending** - Interactive charts showing spending by category and time trends
- **Manage Categories** - Custom categories with colors, icons, and optional budgets
- **Export Data** - Download your data as CSV, JSON, or Excel (3-sheet workbook)
- **Offline-First** - All data stored locally in IndexedDB, no account required
- **Beautiful UI** - Modern design with smooth animations using Motion
- **Themes** - Switch between Original, Fintech, Luxury, and Agency landing themes

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS + shadcn/ui
- **State**: Zustand
- **Database**: Dexie.js (IndexedDB)
- **Charts**: Recharts
- **Animations**: Motion (Framer Motion)
- **Export**: xlsx (Excel), native CSV/JSON
- **Desktop**: Electron + electron-builder

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

## Windows Releases

Expenza ships as a Windows desktop app in two formats:

| Format | File | Description |
|--------|------|-------------|
| Installer | `Expenza Setup <version>.exe` | NSIS installer — Start Menu + desktop shortcut, choose install folder, auto-update support. |
| Portable | `Expenza-<version>-portable.exe` | Single-file app, no install needed — run it straight from a USB or any folder. |

Both behave identically; your data is stored locally (IndexedDB), so nothing leaves your device.

Build both with:

```bash
npm run build:app   # next build && electron-builder
```

Output goes to `release/`:

```text
release/
├── Expenza Setup <version>.exe     (NSIS installer)
├── Expenza-<version>-portable.exe  (portable)
└── win-unpacked/                   (raw app, no installer)
```

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
