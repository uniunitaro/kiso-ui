import { describe, expect, it } from 'vitest'
import { tokens } from '../src/theme/tokens'
import { defaultColors, customColors, palettes } from './theme-fixture'

type Tree = { [key: string]: unknown }
function resolve(
  name: string,
  mode: 'base' | '_dark',
  tree: Tree = defaultColors as Tree,
  depth = 0,
): string {
  if (depth > 20) throw new Error(`Circular token: ${name}`)
  let token: unknown = tree
  for (const part of name.split('.')) token = (token as Tree)?.[part]
  if (!token) {
    token = tokens.colors
    for (const part of name.split('.')) token = (token as Tree)?.[part]
  }
  const leaf = token as { value?: unknown; DEFAULT?: unknown }
  const value = leaf?.value ?? (leaf?.DEFAULT as { value?: unknown })?.value
  const result =
    typeof value === 'string'
      ? value
      : ((value as Record<string, string>)?.[mode] ?? (value as Record<string, string>)?.base)
  if (!result) throw new Error(`Unresolved token: ${name}`)
  const reference = result.match(/^\{colors\.(.+)\}$/)
  return reference ? resolve(reference[1], mode, tree, depth + 1) : result
}
function rgb(hex: string) {
  if (hex === 'white') hex = '#ffffff'
  return [1, 3, 5, 7].map((i) => (hex.length > i ? parseInt(hex.slice(i, i + 2), 16) / 255 : 1))
}
/** Composite a (possibly translucent) color over an opaque background. */
function over(fg: string, bg: string) {
  const [r, g, b, a] = rgb(fg)
  const base = rgb(bg)
  return [r, g, b].map((c, i) => c * a + base[i] * (1 - a))
}
function luminance([r, g, b]: number[]) {
  const lin = (c: number) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
  return lin(r) * 0.2126 + lin(g) * 0.7152 + lin(b) * 0.0722
}
function contrast(fg: string, bg: string, backdrop = 'canvas', mode: 'base' | '_dark' = 'base') {
  const canvas = resolve(backdrop, mode)
  const back = over(resolve(bg, mode), canvas)
  const front = over(
    resolve(fg, mode),
    '#' +
      back
        .map((c) =>
          Math.round(c * 255)
            .toString(16)
            .padStart(2, '0'),
        )
        .join(''),
  )
  const [low, high] = [luminance(front), luminance(back)].sort((a, b) => a - b)
  return (high + 0.05) / (low + 0.05)
}

const raw = (palette: keyof typeof palettes, step: string, mode: 'base' | '_dark') =>
  (palettes[palette] as unknown as Record<string, { value: Record<string, string> }>)[step].value[
    mode
  ]

describe('Park palette contracts', () => {
  for (const mode of ['base', '_dark'] as const) {
    it(`${mode}: body text, error text and the accent solid are readable`, () => {
      for (const [fg, bg] of [
        ['fg.default', 'canvas'],
        ['fg.muted', 'canvas'],
        ['fg.muted', 'gray.surface.bg'],
        ['fg.error', 'canvas'],
        ['fg.error', 'gray.surface.bg'],
        ['accent.solid.fg', 'accent.solid.bg'],
      ]) {
        expect(contrast(fg, bg, 'canvas', mode), `${fg} on ${bg}`).toBeGreaterThanOrEqual(4.5)
      }
    })
    it(`${mode}: unchecked controls stay visible (WCAG 1.4.11)`, () => {
      // Checkbox and Radio borders use gray.a9 on the page canvas and on surfaces.
      expect(contrast('gray.a9', 'canvas', 'canvas', mode)).toBeGreaterThanOrEqual(3)
      expect(contrast('gray.a9', 'gray.surface.bg', 'canvas', mode)).toBeGreaterThanOrEqual(3)
    })
    it(`${mode}: roles copy the palettes named in the config`, () => {
      const custom = customColors as Tree
      expect(resolve('accent.subtle.bg', mode, custom)).toBe(raw('blue', 'a3', mode))
      expect(resolve('accent.solid.bg', mode, custom)).toBe(raw('blue', '9', mode))
      expect(resolve('info.9', mode, custom)).toBe(raw('blue', '9', mode))
      expect(resolve('red.9', mode, custom)).toBe(raw('red', '9', mode))
      expect(resolve('canvas', mode, custom)).toBe(raw('slate', '1', mode))
      expect(resolve('warning.subtle.bg', mode, custom)).toBe(raw('orange', 'a3', mode))
      expect(resolve('danger.9', mode, custom)).toBe(raw('red', '9', mode))
      expect(resolve('brand.9', mode, custom)).toBe(raw('blue', '9', mode))
      expect(resolve('accent.subtle.bg.hover', mode, custom)).toBe(raw('blue', 'a4', mode))
    })
  }
  it('registers only gray and the roles by default', () => {
    expect(Object.keys(defaultColors).sort()).toEqual(
      [
        'accent',
        'border',
        'canvas',
        'danger',
        'error',
        'fg',
        'gray',
        'info',
        'success',
        'warning',
      ].sort(),
    )
    // Each role is a copy: it refers only to itself and gray, never to an unlisted palette.
    for (const role of ['accent', 'info', 'success', 'warning', 'danger'] as const)
      expect(JSON.stringify(defaultColors[role]).match(/\{colors\.[^.}]+/g)).toSatisfy(
        (refs: string[] | null) =>
          refs === null || refs.every((ref) => [`{colors.${role}`, '{colors.gray'].includes(ref)),
      )
    expect(Object.keys(defaultColors.fg).sort()).toEqual(['default', 'error', 'muted', 'subtle'])
    expect(defaultColors.accent).not.toHaveProperty('DEFAULT')
  })
  it('renames a palette with definePalette so its roles follow the new name', () => {
    expect(JSON.stringify(customColors.brand)).not.toContain('{colors.blue.')
    expect(customColors.brand.solid.bg.DEFAULT.value.base).toBe('{colors.brand.9}')
  })
  it('preserves all 12 opaque and alpha shades in both modes', () => {
    expect(Object.keys(palettes)).toHaveLength(31)
    for (const palette of Object.values(palettes))
      for (let step = 1; step <= 12; step++) {
        for (const key of [String(step), `a${step}`]) {
          const token = (palette as Tree)[key] as { value: Record<string, string> }
          expect(token.value.base).toMatch(/^#[\da-f]{6}([\da-f]{2})?$/i)
          expect(token.value._dark).toMatch(/^#[\da-f]{6}([\da-f]{2})?$/i)
        }
      }
    expect(palettes.iris[9].value).toEqual({ base: '#5b5bd6', _dark: '#5b5bd6' })
  })
})
