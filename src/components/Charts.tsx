import { Bar, Pie } from 'react-chartjs-2'
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from 'chart.js'

type TrendPoint = {
  key: string
  label: string
  value: number
}

type SpendingItem = {
  category: string
  amount: number
}

type ThemeColors = {
  accent: string
  textStrong: string
  panelBg: string
}

type ChartsProps = {
  trendSeries: TrendPoint[]
  spendingBreakdown: SpendingItem[]
  themeColors: ThemeColors
  mutedColor: string
}

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
)

export function Charts({ trendSeries, spendingBreakdown, themeColors, mutedColor }: ChartsProps) {
  return (
    <section className="chart-grid">
      <article className="panel chart-panel">
        <div className="panel-header">
          <div>
            <span className="eyebrow">Trend</span>
            <h2>Balance over time</h2>
          </div>
          <span className="chip">Monthly</span>
        </div>

        {trendSeries.length > 0 ? (
          <div className="chart-wrap">
            <Bar
              data={{
                labels: trendSeries.map((point) => point.label),
                datasets: [
                  {
                    label: 'Balance',
                    data: trendSeries.map((point) => point.value),
                    backgroundColor: themeColors.accent,
                    borderRadius: 10,
                    maxBarThickness: 44,
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      color: mutedColor,
                    },
                    grid: {
                      color: 'rgba(107, 114, 128, 0.1)',
                    },
                  },
                  x: {
                    ticks: {
                      color: mutedColor,
                    },
                    grid: {
                      display: false,
                    },
                  },
                },
              }}
            />
          </div>
        ) : (
          <div className="empty-state">No balance data available.</div>
        )}
      </article>

      <article className="panel chart-panel">
        <div className="panel-header">
          <div>
            <span className="eyebrow">Breakdown</span>
            <h2>Spending by category</h2>
          </div>
          <span className="chip">Expenses</span>
        </div>

        {spendingBreakdown.length > 0 ? (
          <div className="chart-wrap pie-chart-wrap">
            <Pie
              data={{
                labels: spendingBreakdown.map((item) => item.category),
                datasets: [
                  {
                    data: spendingBreakdown.map((item) => item.amount),
                    backgroundColor: [
                      '#0f766e',
                      '#14b8a6',
                      '#5eead4',
                      '#06b6d4',
                      '#0ea5e9',
                      '#3b82f6',
                      '#8b5cf6',
                      '#d946ef',
                      '#ec4899',
                      '#f43f5e',
                    ],
                    borderColor: themeColors.panelBg,
                    borderWidth: 3,
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                  legend: {
                    position: 'right',
                    labels: {
                      color: themeColors.textStrong,
                      padding: 16,
                      font: {
                        size: 13,
                      },
                    },
                  },
                },
              }}
            />
          </div>
        ) : (
          <div className="empty-state">No expense data to chart yet.</div>
        )}
      </article>
    </section>
  )
}
