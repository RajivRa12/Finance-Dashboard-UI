# Finance Dashboard UI

A frontend-only financial tracking dashboard built with React, TypeScript, and Vite. All data is mocked and stored locally in the browser using localStorage. The dashboard lets users view transaction history, manage budgets, analyze spending patterns, and switch between viewer and admin roles to demo different permission levels.

## What the Dashboard Does

**Summary & Overview**
- Shows your total balance, income, expenses, savings rate, and quick stats at the top
- Bar chart of your balance trend over months
- Pie chart breaking down spending by category

**Transactions** 
- Full list of all transactions with date, merchant, category, type, amount, and notes
- Search by merchant or category name
- Filter by income/expense or specific category
- Sort by date, amount, or category

**Insights**
- Identifies your highest spending category
- Compares this month's expenses to last month
- Shows whether you're saving money or spending more than you earn

**Budgets** (Admin only)
- View spending limits you've set for each category
- See how much you've spent against each limit
- Adjust limits whenever you want

**Bills Tracker** (Quick reference)
- List of upcoming payments with due dates
- Shows status: upcoming, due soon, or already paid

**Admin Controls** (When in admin mode)
- Add new transactions with a form
- Edit existing transactions
- Delete transactions
- Adjust budget limits
- Export all filtered transactions as CSV

**Other Features**
- Toggle dark mode / light mode (saves preference)
- All data persists when you refresh the page

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

## How I Built It

**Components:** Split the dashboard into focused pieces — `Header` for the title and role switch, `Charts` for the balance and spending visualizations, `TransactionsTable` for the search/filter/sort interface, `Insights` for spending analysis, and `Budgets` for the limit editor. Each component receives props from the parent and calls event handlers to update state.

**Data & State:** Mock transactions, budgets, and bills are defined in `src/data/finance.ts`. State lives in `App.tsx` using React hooks — when you add or edit a transaction, it updates the in-memory array and localStorage so the data persists when you refresh the page.

**Derived Data:** Metrics like total balance, spending by category, and monthly trends are calculated using `useMemo` so they only recalculate when the transaction list changes. This keeps the UI from re-rendering unnecessarily.

**Role Demo:** The role switch in the header toggles between `viewer` and `admin` mode. In viewer mode, edit/delete buttons are hidden. In admin mode, you get a form to add new transactions and adjust budget limits. Both modes share the same data — it's just UI-level permission checking for demo purposes.

**SExtra Features

- **Dark mode** — Toggle between light and dark themes; the choice saves to localStorage
- **Search & filters** — Find transactions by merchant/category, filter by type, sort by date/amount
- **CSV export** — Download filtered transaction list as a CSV file
- **Budget editor** — Admins can adjust spending limits per category and see real-time usage %
- **Bills tracker** — Quick view of upcoming payments with due dates and payment status
- **Toast notifications** — Quick feedback when you save, delete, or export something
- *Why This Approach

- **No backend** — The assignment doesn't require one, so I kept everything in the frontend. This means no deployment hassle and the dashboard works completely offline.
- **localStorage** — Saves state between page refreshes so it feels like a real app even though there's no database.
- **Mocked data** — All transactions and budgets are hardcoded in the data file. Adding real API calls later would just mean replacing the initial data source.
- **Charts with Chart.js** — I used `chart.js` and `react-chartjs-2` because they're straightforward and work well with React.
- **INR currency** — All amounts format to Indian Rupees (₹) instead of USD

- The data is intentionally mock-only because the assignment does not require backend integration.
- Theme, role, and transaction changes persist between refreshes for a better demo experience.
- Charts are implemented with `chart.js` and `react-chartjs-2`.
