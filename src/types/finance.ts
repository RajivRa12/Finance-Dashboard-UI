export type TransactionType = 'income' | 'expense'
export type Role = 'viewer' | 'admin'
export type SortField = 'date' | 'amount' | 'category'

export type Budget = {
  category: string
  limit: number
}

export type Bill = {
  name: string
  dueDate: string
  amount: number
  status: 'upcoming' | 'due' | 'paid'
}

export type Transaction = {
  id: number
  date: string
  amount: number
  category: string
  type: TransactionType
  description: string
  merchant: string
}

export type TransactionFormState = {
  date: string
  amount: string
  category: string
  type: TransactionType
  description: string
  merchant: string
}
