import { formatCurrency, monthLabel } from '../utils/formatters'

type InsightsData = {
  highestCategory?: {
    category: string
    amount: number
  }
  previousMonthKey?: string
  monthComparison: number
}

type InsightsProps = {
  insights: InsightsData
  savingsRate: number
}

export function Insights({ insights, savingsRate }: InsightsProps) {
  return (
    <article className="panel insights-panel">
      <div className="panel-header">
        <div>
          <span className="eyebrow">Insights</span>
          <h2>Simple observations</h2>
        </div>
      </div>

      <div className="insight-list">
        <div className="insight-card">
          <span>Highest spending category</span>
          <strong>{insights.highestCategory?.category ?? 'N/A'}</strong>
          <p>
            {insights.highestCategory
              ? `${formatCurrency(insights.highestCategory.amount)} spent in this category.`
              : 'No expense data available.'}
          </p>
        </div>

        <div className="insight-card">
          <span>Monthly comparison</span>
          <strong>
            {insights.previousMonthKey
              ? `${insights.monthComparison > 0 ? '+' : ''}${formatCurrency(Math.abs(insights.monthComparison))}`
              : 'N/A'}
          </strong>
          <p>
            {insights.previousMonthKey
              ? `Compared with ${monthLabel(`${insights.previousMonthKey}-01`)}, expenses are ${insights.monthComparison > 0 ? 'higher' : 'lower'} by ${formatCurrency(Math.abs(insights.monthComparison))}.`
              : 'Add more monthly data to compare spending changes.'}
          </p>
        </div>

        <div className="insight-card">
          <span>Budget note</span>
          <strong>{savingsRate > 20 ? 'Healthy margin' : 'Review spending'}</strong>
          <p>
            {savingsRate > 20
              ? 'Income comfortably exceeds expenses.'
              : 'Expenses are close to income. Check recurring categories.'}
          </p>
        </div>
      </div>
    </article>
  )
}
