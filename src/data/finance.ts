import type { Bill, Budget, Transaction, TransactionFormState } from '../types/finance'

export const storageKeys = {
  role: 'finance-dashboard-role',
  theme: 'finance-dashboard-theme',
  transactions: 'finance-dashboard-transactions',
  budgets: 'finance-dashboard-budgets',
} as const

export const initialTransactions: Transaction[] = [
  {
    id: 1,
    date: '2026-04-01',
    amount: 4200,
    category: 'Salary',
    type: 'income',
    description: 'Monthly payroll deposit',
    merchant: 'Northwind Payroll',
  },
  {
    id: 2,
    date: '2026-04-02',
    amount: 86.4,
    category: 'Groceries',
    type: 'expense',
    description: 'Weekly market basket',
    merchant: 'Fresh Basket',
  },
  {
    id: 3,
    date: '2026-04-03',
    amount: 54.2,
    category: 'Transport',
    type: 'expense',
    description: 'Ride share to downtown meeting',
    merchant: 'Metro Cab',
  },
  {
    id: 4,
    date: '2026-04-04',
    amount: 120,
    category: 'Freelance',
    type: 'income',
    description: 'Design sprint milestone payment',
    merchant: 'Studio Eleven',
  },
  {
    id: 5,
    date: '2026-04-06',
    amount: 160,
    category: 'Utilities',
    type: 'expense',
    description: 'Electricity and water',
    merchant: 'City Utilities',
  },
  {
    id: 6,
    date: '2026-04-08',
    amount: 72.5,
    category: 'Dining',
    type: 'expense',
    description: 'Team lunch after review',
    merchant: 'Harbor Table',
  },
  {
    id: 7,
    date: '2026-04-10',
    amount: 250,
    category: 'Savings',
    type: 'expense',
    description: 'Automated transfer to savings',
    merchant: 'Future Fund',
  },
  {
    id: 8,
    date: '2026-04-11',
    amount: 65,
    category: 'Entertainment',
    type: 'expense',
    description: 'Streaming bundle and movie rental',
    merchant: 'Streamline',
  },
]

export const emptyFormState: TransactionFormState = {
  date: '',
  amount: '',
  category: '',
  type: 'expense',
  description: '',
  merchant: '',
}

export const initialBudgets: Budget[] = [
  { category: 'Groceries', limit: 400 },
  { category: 'Dining', limit: 250 },
  { category: 'Transport', limit: 180 },
  { category: 'Entertainment', limit: 120 },
  { category: 'Utilities', limit: 220 },
]

export const upcomingBills: Bill[] = [
  { name: 'Internet', dueDate: '2026-04-18', amount: 85, status: 'upcoming' },
  { name: 'Rent', dueDate: '2026-04-22', amount: 1200, status: 'due' },
  { name: 'Mobile plan', dueDate: '2026-04-27', amount: 55, status: 'paid' },
]
