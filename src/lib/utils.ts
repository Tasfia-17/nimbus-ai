export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

export function formatCurrency(amount: number): string {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
  return formatter.format(amount)
}

export function calculateWellArchitectedScore(scores: Record<string, number>): number {
  const values = Object.values(scores).filter(score => typeof score === 'number' && !isNaN(score))
  if (values.length === 0) return 0
  return Math.round(values.reduce((sum, score) => sum + score, 0) / values.length)
}

export function generateNodeId(): string {
  return `node-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}
