import type { Role } from '../types/finance'

type HeaderProps = {
  role: Role
  onRoleChange: (role: Role) => void
  transactionsCount: number
  latestTransactionDate: string
}

export function Header({
  role,
  onRoleChange,
  transactionsCount,
  latestTransactionDate,
}: HeaderProps) {
  return (
    <header className="hero-panel">
      <div>
        <span className="eyebrow">Finance dashboard</span>
        <h1>Track cash flow, spending habits, and the actions that matter.</h1>
        <p className="hero-copy">
          A focused frontend assignment built with mock data, role-based UI states, local
          persistence, and responsive charts for quick financial review.
        </p>

        <div className="hero-meta">
          <span>{transactionsCount} transactions tracked</span>
          <span>Latest update: {latestTransactionDate}</span>
        </div>
      </div>

      <div className="hero-actions">
        <label className="field compact">
          <span>Role</span>
          <select value={role} onChange={(event) => onRoleChange(event.target.value as Role)}>
            <option value="viewer">Viewer</option>
            <option value="admin">Admin</option>
          </select>
        </label>
      </div>
    </header>
  )
}
