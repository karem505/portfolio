export type PageItem = number | 'gap'

/**
 * Compact page list for pagination controls: first and last page, the current
 * page with `siblings` neighbours on each side, and 'gap' markers where pages
 * are skipped. Always yields at most 5 + 2*siblings items, so it fits one row
 * on a phone regardless of the total.
 */
export function paginationWindow(current: number, total: number, siblings = 1): PageItem[] {
  if (total <= 0) return []
  const cur = Math.min(Math.max(current, 1), total)
  // Small totals: show everything. (Window + gaps would not save space.)
  const maxWindow = 2 * siblings + 7
  if (total <= maxWindow) return Array.from({ length: total }, (_, i) => i + 1)

  let start = Math.max(cur - siblings, 1)
  let end = Math.min(cur + siblings, total)
  // Keep the window the same size near the edges so the control does not jump.
  const size = 2 * siblings + 3
  if (cur <= siblings + 3) {
    start = 1
    end = size
  } else if (cur >= total - siblings - 2) {
    start = total - size + 1
    end = total
  }

  const items: PageItem[] = []
  if (start > 1) {
    items.push(1)
    if (start > 2) items.push('gap')
  }
  for (let p = start; p <= end; p++) items.push(p)
  if (end < total) {
    if (end < total - 1) items.push('gap')
    items.push(total)
  }
  return items
}
