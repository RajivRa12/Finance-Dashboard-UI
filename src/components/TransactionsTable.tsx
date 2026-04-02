import type { SortField, Transaction, TransactionType } from '../types/finance'
import { formatCurrency, formatShortDate } from '../utils/formatters'

type TransactionsTableProps = {
  search: string
  onSearchChange: (value: string) => void
  typeFilter: 'all' | TransactionType
  onTypeFilterChange: (value: 'all' | TransactionType) => void
  categoryFilter: string
  onCategoryFilterChange: (value: string) => void
  categories: string[]
  sortField: SortField
  onSortFieldChange: (value: SortField) => void
  sortDirection: 'asc' | 'desc'
  onSortDirectionToggle: () => void
  role: 'viewer' | 'admin'
  transactions: Transaction[]
  onEdit: (transaction: Transaction) => void
  onDelete: (transactionId: number) => void
}

export function TransactionsTable({
  search,
  onSearchChange,
  typeFilter,
  onTypeFilterChange,
  categoryFilter,
  onCategoryFilterChange,
  categories,
  sortField,
  onSortFieldChange,
  sortDirection,
  onSortDirectionToggle,
  role,
  transactions,
  onEdit,
  onDelete,
}: TransactionsTableProps) {
  return (
    <article className="panel transactions-panel">
      <div className="panel-header">
        <div>
          <span className="eyebrow">Transactions</span>
          <h2>Search, filter, and sort</h2>
        </div>

        <div className="panel-actions">
          <label className="field compact">
            <span>Search</span>
            <input
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Merchant, category, or note"
            />
          </label>

          <label className="field compact">
            <span>Type</span>
            <select
              value={typeFilter}
              onChange={(event) => onTypeFilterChange(event.target.value as 'all' | TransactionType)}
            >
              <option value="all">All</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </label>

          <label className="field compact">
            <span>Category</span>
            <select value={categoryFilter} onChange={(event) => onCategoryFilterChange(event.target.value)}>
              <option value="all">All</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>

          <label className="field compact">
            <span>Sort</span>
            <select value={sortField} onChange={(event) => onSortFieldChange(event.target.value as SortField)}>
              <option value="date">Date</option>
              <option value="amount">Amount</option>
              <option value="category">Category</option>
            </select>
          </label>

          <button type="button" className="ghost-button" onClick={onSortDirectionToggle}>
            {sortDirection === 'asc' ? 'Ascending' : 'Descending'}
          </button>
        </div>
      </div>

      <div className="table-wrap">
        {transactions.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Merchant</th>
                <th>Category</th>
                <th>Type</th>
                <th className="align-right">Amount</th>
                {role === 'admin' ? <th>Actions</th> : null}
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td>{formatShortDate(transaction.date)}</td>
                  <td>
                    <strong>{transaction.merchant}</strong>
                    <span className="muted">{transaction.description}</span>
                  </td>
                  <td>{transaction.category}</td>
                  <td>
                    <span className={`status ${transaction.type}`}>{transaction.type}</span>
                  </td>
                  <td className="align-right amount-cell">
                    {transaction.type === 'expense' ? '-' : '+'}
                    {formatCurrency(transaction.amount)}
                  </td>
                  {role === 'admin' ? (
                    <td>
                      <div className="row-actions">
                        <button type="button" className="table-button" onClick={() => onEdit(transaction)}>
                          Edit
                        </button>
                        <button
                          type="button"
                          className="table-button danger"
                          onClick={() => onDelete(transaction.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  ) : null}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="empty-state">No transactions match your current filters.</div>
        )}
      </div>
    </article>
  )
}
