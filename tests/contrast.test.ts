import { describe, expect, it } from 'vitest'
import { semanticTokens } from '../src/theme/tokens'

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
const colors = semanticTokens.colors
function resolve(token: { value: Record<string, string> }, mode: string, accent: string) {
  const v = token.value
  const specific =
    mode === 'dark'
      ? accent === 'ocean'
        ? '_darkOcean'
        : accent === 'forest'
          ? '_darkForest'
          : '_dark'
      : accent === 'ocean'
        ? '_ocean'
        : accent === 'forest'
          ? '_forest'
          : 'base'
  return v[specific] ?? v[mode === 'dark' ? '_dark' : 'base'] ?? v.base
}
describe('semantic theme contrast', () => {
  for (const mode of ['light', 'dark'])
    for (const accent of ['iris', 'ocean', 'forest']) {
      it(`${mode} / ${accent} keeps readable text and identifiable controls`, () => {
        const value = (token: { value: Record<string, string> }) => resolve(token, mode, accent)
        const pairs = [
          [colors.fg.DEFAULT, colors.canvas],
          [colors.fg.muted, colors.surface.DEFAULT],
          [colors.fg.subtle, colors.surface.DEFAULT],
          [colors.accent.contrast, colors.accent.DEFAULT],
          [colors.accent.fg, colors.accent.subtle],
          [colors.danger.DEFAULT, colors.danger.subtle],
          [colors.success.DEFAULT, colors.success.subtle],
          [colors.warning.DEFAULT, colors.warning.subtle],
        ]
        for (const [foreground, background] of pairs)
          expect(contrast(value(foreground), value(background))).toBeGreaterThanOrEqual(4.5)
        expect(
          contrast(value(colors.border.strong), value(colors.surface.DEFAULT)),
        ).toBeGreaterThanOrEqual(3)
        expect(
          contrast(value(colors.accent.DEFAULT), value(colors.surface.DEFAULT)),
        ).toBeGreaterThanOrEqual(3)
      })
    }
})
