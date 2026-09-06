import { useState } from 'react'
import type { AxeResults } from 'axe-core'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { catalog } from './catalog'
import { Demo } from './demos'
import { css } from '../../styled-system/css'
import { styles as s } from './styles'

export function QaPage() {
  const [results, setResults] = useState<AxeResults | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [testedTheme, setTestedTheme] = useState('')
  async function run() {
    setBusy(true)
    setError('')
    try {
      await import('./advanced-demos')
      await new Promise<void>((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
      )
      const axe = (await import('axe-core')).default
      setResults(
        await axe.run(document.getElementById('qa-specimens')!, {
          runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa'] },
        }),
      )
      setTestedTheme(
        `${document.documentElement.dataset.theme} / ${document.documentElement.dataset.accent}`,
      )
    } catch (e) {
      setError(String(e))
    } finally {
      setBusy(false)
    }
  }
  function exportReport() {
    if (!results) return
    const url = URL.createObjectURL(
      new Blob([JSON.stringify({ theme: testedTheme, results }, null, 2)], {
        type: 'application/json',
      }),
    )
    const link = document.createElement('a')
    link.href = url
    link.download = 'kiso-accessibility.json'
    link.click()
    window.setTimeout(() => URL.revokeObjectURL(url), 1000)
  }
  return (
    <>
      <div className={s.eyebrow}>
        <span />A workbench for the workbench.
      </div>
      <h1 className={s.pageTitle}>Quality, in the open.</h1>
      <p className={s.pageIntro}>
        Every live specimen on one page. Check semantics and contrast with axe, then use the
        keyboard and your own eyes. An automated scan is a starting point, not a certification.
      </p>
      <div className={s.row}>
        <Button onClick={run} disabled={busy}>
          {busy ? 'Checking…' : 'Run accessibility checks'}
        </Button>
        <Button
          variant="outline"
          colorPalette="neutral"
          onClick={exportReport}
          disabled={!results || busy}
        >
          Export report
        </Button>
        <Badge>{catalog.length} specimens</Badge>
      </div>
      <div role="status" className={css({ my: '5' })}>
        {results && (
          <p>
            {results.violations.length} violations · {results.passes.length} rules passed ·{' '}
            {results.incomplete.length} manual reviews · Tested: {testedTheme}
          </p>
        )}
        {error && <p>{error}</p>}
      </div>
      {results && results.incomplete.length > 0 && (
        <details className={css({ fontSize: 'xs', color: 'fg.muted', mb: '5' })}>
          <summary>Manual review details</summary>
          {results.incomplete.map((issue) => (
            <div key={issue.id} className={css({ mt: '3' })}>
              <strong>{issue.help}</strong>
              <ul>
                {issue.nodes.map((node, i) => (
                  <li key={i}>{node.target.join(', ')}</li>
                ))}
              </ul>
            </div>
          ))}
        </details>
      )}
      {results && (
        <div className={s.stack}>
          {results.violations.map((issue) => (
            <section
              key={issue.id}
              className={css({
                bg: 'danger.subtle',
                p: '4',
                borderRadius: 'panel',
                fontSize: 'xs',
              })}
            >
              <h2>
                {issue.id} · {issue.impact}
              </h2>
              <p>{issue.help}</p>
              {issue.nodes.map((node, index) => (
                <pre
                  key={index}
                  className={css({ whiteSpace: 'pre-wrap', mt: '2', fontFamily: 'mono' })}
                >
                  {node.target.join(', ')}
                  {'\n'}
                  {node.failureSummary}
                </pre>
              ))}
            </section>
          ))}
        </div>
      )}
      <div
        id="qa-specimens"
        className={css({
          display: 'grid',
          gridTemplateColumns: { base: '1fr', xl: 'repeat(2,minmax(0,1fr))' },
          gap: '5',
          mt: '7',
        })}
      >
        {catalog.map((entry) => (
          <section key={entry.id} data-component={entry.id} className={s.specimen}>
            <h2
              className={css({
                fontSize: 'sm',
                fontWeight: 'medium',
                borderBottomWidth: '1px',
                borderBottomStyle: 'solid',
                borderColor: 'border',
                p: '4',
              })}
            >
              {entry.name}
            </h2>
            <div className={s.specimenBody}>
              <Demo id={entry.id} variant={entry.variants?.[0]} />
            </div>
          </section>
        ))}
      </div>
    </>
  )
}
