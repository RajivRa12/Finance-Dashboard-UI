import type { Budget, Role } from '../types/finance'
import { formatCurrency } from '../utils/formatters'

type BudgetProgressItem = Budget & {
  spent: number
  remaining: number
  usage: number
}

type BudgetsProps = {
  budgetProgress: BudgetProgressItem[]
  overallBudgetUsage: number
  role: Role
  budgets: Budget[]
  selectedBudgetCategory: string
  budgetInput: string
  onCategoryChange: (category: string) => void
  onBudgetInputChange: (value: string) => void
  onSaveBudget: () => void
}

export function Budgets({
  budgetProgress,
  overallBudgetUsage,
  role,
  budgets,
  selectedBudgetCategory,
  budgetInput,
  onCategoryChange,
  onBudgetInputChange,
  onSaveBudget,
}: BudgetsProps) {
  return (
    <article className="panel budgets-panel">
      <div className="panel-header">
        <div>
          <span className="eyebrow">Budgets</span>
          <h2>Category spend limits</h2>
        </div>
      </div>

      <div className="budget-list">
        {budgetProgress.map((budget) => (
          <div key={budget.category} className="budget-row">
            <div className="budget-topline">
              <strong>{budget.category}</strong>
              <span>
                {formatCurrency(budget.spent)} / {formatCurrency(budget.limit)}
              </span>
            </div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${budget.usage}%` }} />
            </div>
          </div>
        ))}
      </div>

      <div className="budget-summary-row">
        <span>Budget usage</span>
        <strong>{overallBudgetUsage.toFixed(0)}%</strong>
      </div>

      {role === 'admin' ? (
        <div className="budget-editor">
          <h3>Adjust a budget</h3>
          <div className="budget-editor-grid">
            <label className="field compact">
              <span>Category</span>
              <select value={selectedBudgetCategory} onChange={(event) => onCategoryChange(event.target.value)}>
                {budgets.map((budget) => (
                  <option key={budget.category} value={budget.category}>
                    {budget.category}
                  </option>
                ))}
              </select>
            </label>

            <label className="field compact">
              <span>Limit</span>
              <input
                type="number"
                min="0"
                step="1"
                value={budgetInput}
                onChange={(event) => onBudgetInputChange(event.target.value)}
              />
            </label>

            <button type="button" className="ghost-button" onClick={onSaveBudget}>
              Save budget
            </button>
          </div>
        </div>
      ) : null}
    </article>
  )
}
