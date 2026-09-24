import { defineTokens, defineSemanticTokens } from '@pandacss/dev'
import { colors as palettes } from './colors'
import { colors } from './base-colors'
import { shadows } from './shadows'
import { zIndex } from './z-index'

export { palettes }
export type PaletteName = keyof typeof palettes
export const grayNames = ['neutral', 'mauve', 'olive', 'sage', 'sand', 'slate'] as const
export const tokens = defineTokens({
  colors,
  zIndex,
  fonts: {
    sans: { value: "'Geist Variable', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" },
    mono: { value: "'Geist Mono Variable', ui-monospace, monospace" },
  },
  radii: { pill: { value: '9999px' } },
  durations: { fast: { value: '120ms' }, normal: { value: '180ms' } },
})
const ref = (name: string) => ({ value: `{colors.${name}}` })
type TokenTree = { [key: string]: TokenTree | { value: string | Record<string, string> } }
// Select palette aliases, preserving the source palette's light/dark and variant states.
function aliasPalette(name: string, selectable?: 'accent' | 'gray', template?: TokenTree) {
  function visit(tree: TokenTree, path: string[] = []): TokenTree {
    return Object.fromEntries(
      Object.entries(tree).map(([key, node]) => {
        const next = [...path, key]
        if ('value' in node) {
          const suffix = next.filter((part) => part !== 'DEFAULT').join('.')
          const value: Record<string, string> = { base: `{colors.${name}.${suffix}}` }
          const names = selectable === 'gray' ? grayNames : Object.keys(palettes)
          if (selectable)
            for (const option of names)
              value[`_${selectable}_${option}`] = `{colors.${option}.${suffix}}`
          return [key, { value }]
        }
        return [key, visit(node, next)]
      }),
    )
  }
  // Neutral has an extra surface hover role; copy the selected palette's shape.
  return visit(template ?? palettes[name as PaletteName] ?? palettes.iris)
}
/** Set defaults and add named palettes from panda.config.ts. */
export function createSemanticTokens(
  options: {
    accentColor?: PaletteName | (string & {})
    grayColor?: (typeof grayNames)[number]
    additionalColors?: Record<string, typeof palettes.iris>
  } = {},
) {
  const additionalColors = Object.fromEntries(
    Object.entries(options.additionalColors ?? {}).map(([name, palette]) => {
      // Rebase palette-local references so overriding brand.9 also updates brand.solid.bg.
      const solid = palette.solid.bg.DEFAULT.value.base
      const source = solid.match(/^\{colors\.([^.]+)\.9\}$/)?.[1]
      return [
        name,
        source
          ? (JSON.parse(
              JSON.stringify(palette).replaceAll('colors.' + source + '.', 'colors.' + name + '.'),
            ) as typeof palette)
          : palette,
      ]
    }),
  )
  const accentName = options.accentColor ?? 'iris'
  const available = { ...palettes, ...additionalColors } as Record<string, typeof palettes.iris>
  if (!available[accentName]) throw new Error('Unknown accent palette: ' + accentName)
  const accent = aliasPalette(accentName, 'accent', available[accentName])
  return defineSemanticTokens({
    colors: {
      ...palettes,
      ...additionalColors,
      gray: aliasPalette(options.grayColor ?? 'neutral', 'gray'),
      accent: {
        ...accent,
        DEFAULT: ref('accent.solid.bg'),
        hover: ref('accent.solid.bg.hover'),
        subtle: { ...(accent.subtle as TokenTree), DEFAULT: ref('accent.subtle.bg') },
        fg: ref('accent.subtle.fg'),
        contrast: ref('accent.solid.fg'),
      },
      canvas: ref('gray.1'),
      surface: {
        DEFAULT: { value: { base: '{colors.white}', _dark: '{colors.gray.1}' } },
        subtle: ref('gray.3'),
        hover: ref('gray.4'),
        raised: ref('gray.surface.bg'),
      },
      fg: {
        DEFAULT: ref('gray.12'),
        default: ref('gray.12'),
        muted: ref('gray.11'),
        subtle: ref('gray.10'),
        inverse: { value: { base: '{colors.white}', _dark: '{colors.black}' } },
      },
      border: { DEFAULT: ref('gray.4'), strong: ref('gray.outline.border') },
      danger: {
        ...aliasPalette('red'),
        DEFAULT: ref('red.11'),
        subtle: { ...palettes.red.subtle, DEFAULT: ref('red.3') },
      },
      success: {
        ...aliasPalette('green'),
        DEFAULT: ref('green.12'),
        subtle: { ...palettes.green.subtle, DEFAULT: ref('green.3') },
      },
      warning: {
        ...aliasPalette('amber'),
        DEFAULT: ref('amber.12'),
        subtle: { ...palettes.amber.subtle, DEFAULT: ref('amber.3') },
      },
      error: ref('red.9'),
      overlay: ref('black.a7'),
    },
    radii: {
      l1: { value: 'var(--kiso-radius-l1, {radii.xs})' },
      l2: { value: 'var(--kiso-radius-l2, {radii.sm})' },
      l3: { value: 'var(--kiso-radius-l3, {radii.md})' },
      control: { value: '{radii.l2}' },
      panel: { value: '{radii.l3}' },
    },
    shadows: { ...shadows, popup: { value: '{shadows.lg}' } },
  })
}
export const semanticTokens = createSemanticTokens()
