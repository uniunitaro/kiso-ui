import { describe, expect, it } from 'vitest'
import { semanticTokens, tokens, palettes, createSemanticTokens } from '../src/theme/tokens'

type Tree = { [key: string]: unknown }
function resolve(
  name: string,
  mode: 'base' | '_dark',
  tree: Tree = semanticTokens.colors,
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
function luminance(hex: string) {
  const rgb = [1, 3, 5]
    .map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4))
  return rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722
}
function contrast(a: string, b: string) {
  const [low, high] = [luminance(a), luminance(b)].sort((a, b) => a - b)
  return (high + 0.05) / (low + 0.05)
}
describe('Park palette contracts', () => {
  for (const mode of ['base', '_dark'] as const) {
    it(`${mode}: readable body and status text`, () => {
      for (const [fg, bg] of [
        ['fg', 'canvas'],
        ['fg.muted', 'surface'],
        ['danger', 'danger.subtle'],
        ['success', 'success.subtle'],
        ['warning', 'warning.subtle'],
      ]) {
        expect(
          contrast(resolve(fg, mode), resolve(bg, mode)),
          `${fg} on ${bg}`,
        ).toBeGreaterThanOrEqual(4.5)
      }
    })
    it(`${mode}: aliases resolve to the configured palette`, () => {
      const custom = createSemanticTokens({
        accentColor: 'blue',
        grayColor: 'slate',
        additionalColors: { brand: palettes.blue },
      })
      expect(resolve('accent', mode, custom.colors)).toBe(resolve('blue.solid.bg', mode))
      expect(resolve('canvas', mode, custom.colors)).toBe(resolve('slate.1', mode))
      expect(resolve('brand.solid.bg', mode, custom.colors)).toBe(resolve('blue.9', mode))
      expect(resolve('accent.subtle.bg.hover', mode, custom.colors)).toBe(resolve('blue.a4', mode))
    })
  }
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
