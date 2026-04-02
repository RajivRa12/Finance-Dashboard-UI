import type { FormEvent } from 'react'
import { useEffect, useMemo, useState } from 'react'
import {
  emptyFormState,
  initialBudgets,
  initialTransactions,
  storageKeys,
  upcomingBills,
} from './data/finance'
import {
  formatCurrency,
  formatShortDate,
  getMonthKey,
  monthLabel,
} from './utils/formatters'
import { downloadCsv } from './utils/download'
import { getCssVariable } from './utils/theme'
import { Header } from './components/Header'
import { Charts } from './components/Charts'
import { TransactionsTable } from './components/TransactionsTable'
import { Insights } from './components/Insights'
import { Budgets } from './components/Budgets'
import { ToastStack, type ToastItem } from './components/ToastStack'
import type {
  Budget,
  Role,
  SortField,
  Transaction,
  TransactionFormState,
  TransactionType,
} from './types/finance'
import './App.css'

function App() {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem(storageKeys.transactions)

    if (!saved) {
      return initialTransactions
    }

    try {
      const parsed = JSON.parse(saved) as Transaction[]
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : initialTransactions
    } catch {
      return initialTransactions
    }
  })

  const [role, setRole] = useState<Role>(() => {
    const saved = localStorage.getItem(storageKeys.role)
    return saved === 'admin' ? 'admin' : 'viewer'
  })

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem(storageKeys.theme)
    return saved === 'dark' ? 'dark' : 'light'
  })

  const [budgets, setBudgets] = useState<Budget[]>(() => {
    const saved = localStorage.getItem(storageKeys.budgets)

    if (!saved) {
      return initialBudgets
    }

    try {
      const parsed = JSON.parse(saved) as Budget[]
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : initialBudgets
    } catch {
      return initialBudgets
    }
  })

  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<'all' | TransactionType>('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [sortField, setSortField] = useState<SortField>('date')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formState, setFormState] = useState<TransactionFormState>(emptyFormState)
  const [selectedBudgetCategory, setSelectedBudgetCategory] = useState(
    initialBudgets[0]?.category ?? '',
  )
  const [budgetInput, setBudgetInput] = useState(String(initialBudgets[0]?.limit ?? ''))
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const themeColors = {
    accent: getCssVariable('--accent', '#0f766e'),
    accentSoft: getCssVariable('--accent-soft', '#14b8a6'),
    textStrong: getCssVariable('--text-strong', '#101828'),
    panelBg: getCssVariable('--panel-bg', '#ffffff'),
  }
  const mutedColor = getCssVariable('--muted', '#6b7280')

  useEffect(() => {
    localStorage.setItem(storageKeys.role, role)
  }, [role])

  useEffect(() => {
    localStorage.setItem(storageKeys.theme, theme)
    document.documentElement.dataset.theme = theme
  }, [theme])

  useEffect(() => {
    localStorage.setItem(storageKeys.transactions, JSON.stringify(transactions))
  }, [transactions])

  useEffect(() => {
    localStorage.setItem(storageKeys.budgets, JSON.stringify(budgets))
  }, [budgets])

  const categories = useMemo(
    () => Array.from(new Set(transactions.map((transaction) => transaction.category))),
    [transactions],
  )

  const filteredTransactions = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()

    const filtered = transactions.filter((transaction) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        [transaction.description, transaction.merchant, transaction.category]
          .join(' ')
          .toLowerCase()
          .includes(normalizedSearch)
      const matchesType = typeFilter === 'all' || transaction.type === typeFilter
      const matchesCategory =
        categoryFilter === 'all' || transaction.category === categoryFilter

      return matchesSearch && matchesType && matchesCategory
    })

    const direction = sortDirection === 'asc' ? 1 : -1

    return [...filtered].sort((left, right) => {
      if (sortField === 'amount') {
        return (left.amount - right.amount) * direction
      }

      if (sortField === 'category') {
        return left.category.localeCompare(right.category) * direction
      }

      return (
        (new Date(left.date).getTime() - new Date(right.date).getTime()) * direction
      )
    })
  }, [categoryFilter, search, sortDirection, sortField, transactions, typeFilter])

  const metrics = useMemo(() => {
    const income = transactions
      .filter((transaction) => transaction.type === 'income')
      .reduce((sum, transaction) => sum + transaction.amount, 0)
    const expenses = transactions
      .filter((transaction) => transaction.type === 'expense')
      .reduce((sum, transaction) => sum + transaction.amount, 0)
    const balance = income - expenses
    const savingsRate = income === 0 ? 0 : Math.max(0, (balance / income) * 100)

    return { income, expenses, balance, savingsRate }
  }, [transactions])

  const monthlySummary = useMemo(() => {
    return transactions.reduce(
      (accumulator, transaction) => {
        const key = getMonthKey(transaction.date)

        if (!accumulator[key]) {
          accumulator[key] = { income: 0, expenses: 0 }
        }

        if (transaction.type === 'income') {
          accumulator[key].income += transaction.amount
        } else {
          accumulator[key].expenses += transaction.amount
        }
        return accumulator
      },
      {} as Record<string, { income: number; expenses: number }>,
    )
  }, [transactions])

  const trendSeries = useMemo(() => {
    const sortedKeys = Object.keys(monthlySummary).sort()

    return sortedKeys.reduce<
      { key: string; label: string; value: number }[]
    >((accumulator, key) => {
      const month = monthlySummary[key]
      const previousBalance = accumulator.at(-1)?.value ?? 0

      accumulator.push({
        key,
        label: monthLabel(`${key}-01`),
        value: previousBalance + month.income - month.expenses,
      })

      return accumulator
    }, [])
  }, [monthlySummary])



  const spendingBreakdown = useMemo(() => {
    const totals = transactions
      .filter((transaction) => transaction.type === 'expense')
      .reduce(
        (accumulator, transaction) => {
          accumulator[transaction.category] =
            (accumulator[transaction.category] ?? 0) + transaction.amount
          return accumulator
        },
        {} as Record<string, number>,
      )

    return Object.entries(totals)
      .map(([category, amount]) => ({ category, amount }))
      .sort((left, right) => right.amount - left.amount)
  }, [transactions])

  const budgetProgress = useMemo(() => {
    return budgets.map((budget) => {
      const spent = spendingBreakdown.find((item) => item.category === budget.category)?.amount ?? 0
      const remaining = budget.limit - spent

      return {
        ...budget,
        spent,
        remaining,
        usage: budget.limit === 0 ? 0 : Math.min(100, (spent / budget.limit) * 100),
      }
    })
  }, [budgets, spendingBreakdown])

  const overallBudgetUsed = budgetProgress.reduce((sum, item) => sum + item.spent, 0)
  const overallBudgetLimit = budgetProgress.reduce((sum, item) => sum + item.limit, 0)
  const overallBudgetUsage = overallBudgetLimit === 0 ? 0 : (overallBudgetUsed / overallBudgetLimit) * 100

  const averageDailySpend = useMemo(() => {
    const expenseTransactions = transactions.filter((transaction) => transaction.type === 'expense')
    return expenseTransactions.length === 0 ? 0 : metrics.expenses / expenseTransactions.length
  }, [metrics.expenses, transactions])

  const netCashFlow = metrics.income - metrics.expenses

  const latestTransactionDate = useMemo(() => {
    const latest = [...transactions].sort(
      (left, right) => new Date(right.date).getTime() - new Date(left.date).getTime(),
    )[0]

    return latest ? formatShortDate(latest.date) : 'N/A'
  }, [transactions])

  const insights = useMemo(() => {
    const highestCategory = spendingBreakdown[0]
    const monthKeys = Object.keys(monthlySummary).sort()
    const latestMonthKey = monthKeys.at(-1)
    const previousMonthKey = monthKeys.at(-2)
    const latestMonth = latestMonthKey ? monthlySummary[latestMonthKey] : undefined
    const previousMonth = previousMonthKey ? monthlySummary[previousMonthKey] : undefined

    return {
      highestCategory,
      latestMonthKey,
      previousMonthKey,
      monthComparison:
        latestMonth && previousMonth ? latestMonth.expenses - previousMonth.expenses : 0,
    }
  }, [monthlySummary, spendingBreakdown])

  function showToast(message: string, kind: ToastItem['kind'] = 'info') {
    const id = Date.now() + Math.floor(Math.random() * 1000)
    setToasts((current) => [...current, { id, message, kind }])

    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id))
    }, 2800)
  }

  function exportTransactions() {
    downloadCsv('finance-transactions.csv', [
      ['Date', 'Merchant', 'Category', 'Type', 'Amount', 'Description'],
      ...filteredTransactions.map((transaction) => [
        transaction.date,
        transaction.merchant,
        transaction.category,
        transaction.type,
        transaction.amount,
        transaction.description,
      ]),
    ])
    showToast('Transactions exported as CSV.', 'success')
  }

  return (
    <div className="shell">
      <Header
        role={role}
        onRoleChange={setRole}
        transactionsCount={transactions.length}
        latestTransactionDate={latestTransactionDate}
      />

      <main className="dashboard-grid">
        <section className="mini-summary-grid" aria-label="Quick financial stats">
          <article className="mini-summary-card">
            <span>Net cash flow</span>
            <strong className={netCashFlow >= 0 ? 'positive' : 'negative'}>
              {formatCurrency(netCashFlow)}
            </strong>
          </article>
          <article className="mini-summary-card">
            <span>Avg. daily spend</span>
            <strong>{formatCurrency(averageDailySpend)}</strong>
          </article>
          <article className="mini-summary-card">
            <span>Budget usage</span>
            <strong>{overallBudgetUsage.toFixed(0)}%</strong>
          </article>
          <article className="mini-summary-card">
            <span>Upcoming bills</span>
            <strong>{upcomingBills.length}</strong>
          </article>
        </section>

        <section className="summary-grid" aria-label="Financial summary">
          <article className="summary-card accent">
            <span>Total balance</span>
            <strong>{formatCurrency(metrics.balance)}</strong>
            <small>Income minus expenses across all transactions.</small>
          </article>
          <article className="summary-card">
            <span>Income</span>
            <strong>{formatCurrency(metrics.income)}</strong>
            <small>Incoming funds from salary and freelance work.</small>
          </article>
          <article className="summary-card">
            <span>Expenses</span>
            <strong>{formatCurrency(metrics.expenses)}</strong>
            <small>Outgoing spend captured from transaction history.</small>
          </article>
          <article className="summary-card">
            <span>Savings rate</span>
            <strong>{metrics.savingsRate.toFixed(0)}%</strong>
            <small>Measures retained income after expenses.</small>
          </article>
        </section>

        <section className="panel toolbar-panel">
          <div>
            <span className="eyebrow">Actions</span>
            <h2>Export and manage finances</h2>
            <p className="muted">Quick utilities for reviewing, exporting, and switching the demo UI.</p>
          </div>

          <div className="toolbar-actions">
            <button type="button" className="ghost-button" onClick={exportTransactions}>
              Export CSV
            </button>
            <button
              type="button"
              className="ghost-button"
              onClick={() => {
                const nextTheme = theme === 'light' ? 'dark' : 'light'
                setTheme(nextTheme)
                showToast(`Switched to ${nextTheme} mode.`, 'info')
              }}
            >
              {theme === 'light' ? 'Switch to dark' : 'Switch to light'}
            </button>
          </div>
        </section>

        <Charts
          trendSeries={trendSeries}
          spendingBreakdown={spendingBreakdown}
          themeColors={themeColors}
          mutedColor={mutedColor}
        />

        <section className="content-grid">
          <TransactionsTable
            search={search}
            onSearchChange={setSearch}
            typeFilter={typeFilter}
            onTypeFilterChange={setTypeFilter}
            categoryFilter={categoryFilter}
            onCategoryFilterChange={setCategoryFilter}
            categories={categories}
            sortField={sortField}
            onSortFieldChange={setSortField}
            sortDirection={sortDirection}
            onSortDirectionToggle={() =>
              setSortDirection((current) => (current === 'asc' ? 'desc' : 'asc'))
            }
            role={role}
            transactions={filteredTransactions}
            onEdit={(transaction) => {
              setEditingId(transaction.id)
              setFormState({
                date: transaction.date,
                amount: String(transaction.amount),
                category: transaction.category,
                type: transaction.type,
                description: transaction.description,
                merchant: transaction.merchant,
              })
            }}
            onDelete={(transactionId) => {
              setTransactions((current) => current.filter((item) => item.id !== transactionId))
              if (editingId === transactionId) {
                setEditingId(null)
                setFormState(emptyFormState)
              }
              showToast('Transaction deleted.', 'info')
            }}
          />

          <aside className="side-column">
            <Insights insights={insights} savingsRate={metrics.savingsRate} />

            <Budgets
              budgetProgress={budgetProgress}
              overallBudgetUsage={overallBudgetUsage}
              role={role}
              budgets={budgets}
              selectedBudgetCategory={selectedBudgetCategory}
              budgetInput={budgetInput}
              onCategoryChange={(nextCategory) => {
                const matchedBudget = budgets.find((budget) => budget.category === nextCategory)
                setSelectedBudgetCategory(nextCategory)
                setBudgetInput(String(matchedBudget?.limit ?? ''))
              }}
              onBudgetInputChange={setBudgetInput}
              onSaveBudget={() => {
                const nextLimit = Number(budgetInput)
                if (Number.isNaN(nextLimit) || nextLimit < 0) {
                  showToast('Enter a valid budget amount.', 'error')
                  return
                }

                setBudgets((current) =>
                  current.map((budget) =>
                    budget.category === selectedBudgetCategory
                      ? { ...budget, limit: nextLimit }
                      : budget,
                  ),
                )
                showToast('Budget updated successfully.', 'success')
              }}
            />

            <article className="panel bills-panel">
              <div className="panel-header">
                <div>
                  <span className="eyebrow">Bills</span>
                  <h2>Upcoming payments</h2>
                </div>
              </div>

              <div className="bill-list">
                {upcomingBills.map((bill) => (
                  <div key={bill.name} className="bill-row">
                    <div>
                      <strong>{bill.name}</strong>
                      <span className="muted">Due {formatShortDate(bill.dueDate)}</span>
                    </div>
                    <div className="bill-meta">
                      <span>{formatCurrency(bill.amount)}</span>
                      <span className={`status ${bill.status}`}>{bill.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </article>

            {role === 'admin' ? (
              <article className="panel form-panel">
                <div className="panel-header">
                  <div>
                    <span className="eyebrow">Admin tools</span>
                    <h2>{editingId === null ? 'Add transaction' : 'Edit transaction'}</h2>
                  </div>
                  {editingId !== null ? (
                    <button
                      type="button"
                      className="ghost-button"
                      onClick={() => {
                        setEditingId(null)
                        setFormState(emptyFormState)
                      }}
                    >
                      Cancel
                    </button>
                  ) : null}
                </div>

                <form
                  className="transaction-form"
                  onSubmit={(event: FormEvent<HTMLFormElement>) => {
                    event.preventDefault()

                    const payload = {
                      date: formState.date,
                      amount: Number(formState.amount),
                      category: formState.category.trim(),
                      type: formState.type,
                      description: formState.description.trim(),
                      merchant: formState.merchant.trim(),
                    }

                    if (
                      !payload.date ||
                      !payload.category ||
                      !payload.description ||
                      !payload.merchant ||
                      Number.isNaN(payload.amount)
                    ) {
                      showToast('Please fill all transaction fields correctly.', 'error')
                      return
                    }

                    if (editingId === null) {
                      setTransactions((current) => [
                        {
                          id: Date.now(),
                          ...payload,
                        },
                        ...current,
                      ])
                      showToast('Transaction added.', 'success')
                    } else {
                      setTransactions((current) =>
                        current.map((transaction) =>
                          transaction.id === editingId ? { ...transaction, ...payload } : transaction,
                        ),
                      )
                      showToast('Transaction updated.', 'success')
                    }

                    setEditingId(null)
                    setFormState(emptyFormState)
                  }}
                >
                  <label className="field">
                    <span>Date</span>
                    <input
                      type="date"
                      value={formState.date}
                      onChange={(event) =>
                        setFormState((current) => ({ ...current, date: event.target.value }))
                      }
                      required
                    />
                  </label>

                  <label className="field">
                    <span>Amount</span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formState.amount}
                      onChange={(event) =>
                        setFormState((current) => ({ ...current, amount: event.target.value }))
                      }
                      placeholder="0.00"
                      required
                    />
                  </label>

                  <label className="field">
                    <span>Category</span>
                    <input
                      value={formState.category}
                      onChange={(event) =>
                        setFormState((current) => ({ ...current, category: event.target.value }))
                      }
                      placeholder="Groceries"
                      required
                    />
                  </label>

                  <label className="field">
                    <span>Type</span>
                    <select
                      value={formState.type}
                      onChange={(event) =>
                        setFormState((current) => ({
                          ...current,
                          type: event.target.value as TransactionType,
                        }))
                      }
                    >
                      <option value="income">Income</option>
                      <option value="expense">Expense</option>
                    </select>
                  </label>

                  <label className="field">
                    <span>Merchant</span>
                    <input
                      value={formState.merchant}
                      onChange={(event) =>
                        setFormState((current) => ({ ...current, merchant: event.target.value }))
                      }
                      placeholder="Company or vendor"
                      required
                    />
                  </label>

                  <label className="field">
                    <span>Description</span>
                    <textarea
                      rows={3}
                      value={formState.description}
                      onChange={(event) =>
                        setFormState((current) => ({ ...current, description: event.target.value }))
                      }
                      placeholder="Short transaction note"
                      required
                    />
                  </label>

                  <button type="submit" className="primary-button">
                    {editingId === null ? 'Add transaction' : 'Save changes'}
                  </button>
                </form>
              </article>
            ) : (
              <article className="panel notice-panel">
                <span className="eyebrow">Viewer mode</span>
                <h2>Read-only access</h2>
                <p>
                  Switch to admin mode to add, edit, or delete transactions for the demo.
                </p>
              </article>
            )}
          </aside>
        </section>
      </main>

      <ToastStack toasts={toasts} onDismiss={(id) => setToasts((current) => current.filter((toast) => toast.id !== id))} />
    </div>
  )
}

export default App
