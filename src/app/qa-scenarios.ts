import type { AxeResults, Result } from 'axe-core'

/**
 * Overlays render into body-level portals, outside #qa-specimens. Each scenario opens one
 * specimen, checks it together with the portals, then closes it again.
 */
export type Scenario = { id: string; label: string; open: (specimen: HTMLElement) => void }

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
const clickFirst = (selector: string) => (specimen: HTMLElement) =>
  specimen.querySelector<HTMLElement>(selector)?.click()
function hover(element: Element | null) {
  if (!element) return
  const box = element.getBoundingClientRect()
  const init = { bubbles: true, clientX: box.x + 4, clientY: box.y + 4, pointerType: 'mouse' }
  for (const type of ['pointerenter', 'pointermove'])
    element.dispatchEvent(new PointerEvent(type, init))
  for (const type of ['mouseenter', 'mouseover', 'mousemove'])
    element.dispatchEvent(new MouseEvent(type, init))
}

export const scenarios: Scenario[] = [
  { id: 'dialog', label: 'Dialog open', open: clickFirst('[aria-haspopup="dialog"]') },
  { id: 'alert-dialog', label: 'Alert Dialog open', open: clickFirst('[aria-haspopup="dialog"]') },
  { id: 'drawer', label: 'Drawer open', open: clickFirst('[aria-haspopup="dialog"]') },
  { id: 'popover', label: 'Popover open', open: clickFirst('[aria-haspopup]') },
  { id: 'menu', label: 'Menu open', open: clickFirst('[aria-haspopup="menu"]') },
  { id: 'menubar', label: 'Menubar menu open', open: clickFirst('[aria-haspopup="menu"]') },
  { id: 'select', label: 'Select open', open: clickFirst('[aria-haspopup="listbox"]') },
  { id: 'combobox', label: 'Combobox open', open: clickFirst('button[aria-haspopup]') },
  { id: 'navigation-menu', label: 'Navigation Menu open', open: clickFirst('[aria-expanded]') },
  {
    id: 'context-menu',
    label: 'Context Menu open',
    open(specimen) {
      const target = specimen.querySelector('[tabindex]')
      const box = target?.getBoundingClientRect()
      target?.dispatchEvent(
        new MouseEvent('contextmenu', {
          bubbles: true,
          cancelable: true,
          clientX: (box?.x ?? 0) + 8,
          clientY: (box?.y ?? 0) + 8,
        }),
      )
    },
  },
  {
    id: 'tooltip',
    label: 'Tooltip open',
    open: (specimen) => hover(specimen.querySelector('button')),
  },
  {
    id: 'preview-card',
    label: 'Preview Card open',
    open: (specimen) => hover(specimen.querySelector('a')),
  },
  { id: 'toast', label: 'Toast shown', open: clickFirst('button') },
]

function portals() {
  return [...document.body.children].filter(
    (node) =>
      node.id !== 'root' &&
      node.tagName !== 'SCRIPT' &&
      // A previous scenario's popup can still be mounted while its exit animation runs.
      !(node.querySelector('[data-closed]') && !node.querySelector('[data-open]')),
  )
}
function isOpen(id: string, specimen: HTMLElement, before: number) {
  if (id === 'toast') return document.querySelector('.kiso-toast__root') !== null
  return (
    document.querySelectorAll('[data-open]').length > before ||
    specimen.querySelector('[aria-expanded="true"]') !== null
  )
}
async function close(specimen: HTMLElement) {
  const target = document.activeElement ?? document.body
  target.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
  for (const element of specimen.querySelectorAll('button, a'))
    element.dispatchEvent(new PointerEvent('pointerleave', { bubbles: true }))
  ;(document.activeElement as HTMLElement | null)?.blur?.()
  await wait(400)
}

export type ScenarioReport = { label: string; opened: boolean }

/** Run axe on every scenario; returns the per-scenario results and whether each one opened. */
export async function runScenarios(
  axe: typeof import('axe-core'),
  options: import('axe-core').RunOptions,
) {
  const results: AxeResults[] = []
  const report: ScenarioReport[] = []
  for (const scenario of scenarios) {
    const specimen = document.querySelector<HTMLElement>(`[data-component="${scenario.id}"]`)
    if (!specimen) continue
    const before = document.querySelectorAll('[data-open]').length
    scenario.open(specimen)
    // Hover-opened overlays wait for their delay; then let enter transitions finish, so axe
    // measures the final colors rather than a half-faded popup.
    let opened = false
    for (let elapsed = 0; elapsed < 2000 && !opened; elapsed += 100) {
      await wait(100)
      opened = isOpen(scenario.id, specimen, before)
    }
    const finite = document
      .getAnimations()
      .filter((animation) => animation.effect?.getTiming().iterations !== Infinity)
    // A hidden tab pauses transitions, so never wait longer than 1.5s.
    await Promise.race([
      Promise.all(finite.map((animation) => animation.finished.catch(() => undefined))),
      wait(1500),
    ])
    report.push({ label: scenario.label, opened })
    if (opened)
      results.push(
        await axe.run(
          // Base UI's focus-trap sentinels are aria-hidden on purpose and hand focus straight on.
          { include: [specimen, ...portals()], exclude: [['[data-base-ui-focus-guard]']] },
          options,
        ),
      )
    await close(specimen)
  }
  return { results, report }
}

/** Combine runs: a rule is a violation if any run fails it; nodes are de-duplicated. */
export function mergeResults(runs: AxeResults[]) {
  const merge = (key: 'violations' | 'incomplete') => {
    const byId = new Map<string, Result>()
    for (const run of runs)
      for (const rule of run[key]) {
        const known = byId.get(rule.id)
        if (!known) byId.set(rule.id, { ...rule, nodes: [...rule.nodes] })
        else
          for (const node of rule.nodes)
            if (!known.nodes.some((seen) => seen.target.join() === node.target.join()))
              known.nodes.push(node)
      }
    return [...byId.values()]
  }
  const violations = merge('violations')
  const failed = new Set(violations.map((rule) => rule.id))
  const passes = [
    ...new Map(runs.flatMap((run) => run.passes).map((rule) => [rule.id, rule])).values(),
  ].filter((rule) => !failed.has(rule.id))
  return { violations, incomplete: merge('incomplete'), passes }
}
