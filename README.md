# Finance Dashboard UI

Frontend dashboard built for the Finance Dashboard UI assignment using React, TypeScript, and Vite. The project focuses on clear component structure, well-managed frontend state, and an intuitive interface for tracking financial activity.

## Requirement Coverage

### 1) Dashboard Overview

- Summary cards include Total Balance, Income, Expenses, Savings Rate, and additional quick stats.
- Time-based visualization: balance trend line chart.
- Categorical visualization: spending breakdown pie chart.

### 2) Transactions Section

- Transaction list includes Date, Amount, Category, Type, Merchant, and Description.
- Includes filtering by type and category, full-text search, and sorting (date/amount/category).

### 3) Basic Role-Based UI

- Role switch is available through a dropdown (`viewer` / `admin`).
- Viewer mode is read-only.
- Admin mode enables adding, editing, deleting transactions and budget updates.

### 4) Insights Section

- Highest spending category.
- Monthly expense comparison against previous period.
- Savings-health observation based on current ratios.

### 5) State Management

- Local component state with memoized derived data (`useMemo`) and effect-based persistence (`useEffect`).
- Managed state includes:
	- Transactions
	- Filters and sorting
	- Selected role
	- Theme
	- Budgets

### 6) UI/UX Expectations

- Clean, readable layout with responsive grids and cards.
- Works across desktop and mobile breakpoints.
- Empty states are handled for charts/tables when filtered data is unavailable.

## Features

- Financial summary cards for balance, income, expenses, and savings rate
- Balance trend visualization with Chart.js line chart
- Category breakdown visualization for expenses
- Transaction table with search, type filter, category filter, and sortable columns
- Viewer and admin roles controlled from the UI
- Admin transaction add, edit, and delete flow
- Insights section with highest spending category and monthly comparison
- Budget management panel with editable category limits
- Upcoming bills panel for quick payment awareness
- Export transactions as CSV
- Light and dark themes with local persistence
- Graceful empty-state handling

## Setup

1. Install dependencies if needed:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Build for production:

```bash
npm run build
```

4. Lint the project:

```bash
npm run lint
```

## Approach

- Componentized architecture:
	- `Header`, `Charts`, `TransactionsTable`, `Insights`, `Budgets`
	- Domain types, mock data, and utility helpers are split into dedicated modules.
- Mock transactions are stored in frontend state and persisted via local storage.
- Dashboard metrics, insights, and chart datasets are derived from source data using memoized computations.
- Role-based UI logic is implemented on the frontend for demonstration without backend RBAC.
- Styling is custom CSS with responsive breakpoints, accessible controls, and subtle interaction transitions.

## Optional Enhancements Implemented

- Dark mode
- Local storage persistence
- CSV export functionality
- Transitions/hover micro-interactions
- Advanced filtering/sorting

## Notes

- The data is intentionally mock-only because the assignment does not require backend integration.
- Theme, role, and transaction changes persist between refreshes for a better demo experience.
- Charts are implemented with `chart.js` and `react-chartjs-2`.
