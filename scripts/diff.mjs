export const normalizeNewlines = (text) => text.replaceAll('\r\n', '\n')

// A line-based unified diff (longest common subsequence), enough for source files of a few
// hundred lines. Returns an empty string when the texts match.
export function unifiedDiff(before, after, { from, to, context = 3 }) {
  // A final newline ends the last line rather than starting an empty one.
  const split = (text) => normalizeNewlines(text).replace(/\n$/, '').split('\n')
  const a = before ? split(before) : []
  const b = after ? split(after) : []
  if (a.length * b.length > 4_000_000) return `--- ${from}\n+++ ${to}\n(too large to compare)\n`
  const common = Array.from({ length: a.length + 1 }, () => new Uint32Array(b.length + 1))
  for (let i = a.length - 1; i >= 0; i--)
    for (let j = b.length - 1; j >= 0; j--)
      common[i][j] =
        a[i] === b[j] ? common[i + 1][j + 1] + 1 : Math.max(common[i + 1][j], common[i][j + 1])
  const ops = []
  let i = 0
  let j = 0
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) {
      ops.push([' ', a[i++]])
      j++
    } else if (common[i + 1][j] >= common[i][j + 1]) ops.push(['-', a[i++]])
    else ops.push(['+', b[j++]])
  }
  while (i < a.length) ops.push(['-', a[i++]])
  while (j < b.length) ops.push(['+', b[j++]])
  // Line numbers before each operation, for the hunk headers.
  const oldLine = []
  const newLine = []
  let o = 1
  let n = 1
  for (const [kind] of ops) {
    oldLine.push(o)
    newLine.push(n)
    if (kind !== '+') o++
    if (kind !== '-') n++
  }
  const hunks = []
  ops.forEach(([kind], index) => {
    if (kind === ' ') return
    const start = Math.max(0, index - context)
    const end = Math.min(ops.length, index + context + 1)
    const last = hunks.at(-1)
    if (last && start <= last.end) last.end = end
    else hunks.push({ start, end })
  })
  if (!hunks.length) return ''
  const lines = [`--- ${from}`, `+++ ${to}`]
  for (const { start, end } of hunks) {
    const slice = ops.slice(start, end)
    const oldCount = slice.filter(([kind]) => kind !== '+').length
    const newCount = slice.filter(([kind]) => kind !== '-').length
    lines.push(
      `@@ -${oldLine[start] - (oldCount ? 0 : 1)},${oldCount} +${newLine[start] - (newCount ? 0 : 1)},${newCount} @@`,
      ...slice.map(([kind, line]) => kind + line),
    )
  }
  return lines.join('\n') + '\n'
}
