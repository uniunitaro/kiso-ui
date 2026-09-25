import { defineTokens, defineSemanticTokens, definePlugin } from '@pandacss/dev'
import type { iris } from './colors/iris'
import { colors } from './base-colors'
import { zIndex } from './z-index'

/** Any palette from ./colors, or one made with definePalette. */
export type Palette = typeof iris
type TokenTree = { [key: string]: TokenTree | { value: string | Record<string, string> } }

export const tokens = defineTokens({
  colors,
  zIndex,
  fonts: {
    sans: { value: "'Geist Variable', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" },
    mono: { value: "'Geist Mono Variable', ui-monospace, monospace" },
  },
})

/** Park UI's semantic colors (plus Kiso's readable `fg.error`). They read `gray` and `danger`. */
export const semanticColors = defineSemanticTokens.colors({
  fg: {
    default: { value: '{colors.gray.12}' },
    muted: { value: '{colors.gray.11}' },
    subtle: { value: '{colors.gray.10}' },
    // Kiso: readable error text. `error` (step 9) stays for borders and rings, as in Park UI.
    error: { value: '{colors.danger.11}' },
  },
  canvas: { value: '{colors.gray.1}' },
  border: { value: '{colors.gray.4}' },
  error: { value: '{colors.danger.9}' },
})

/** Nested corner radii: l1 inside l2 inside l3. Point them at other radii to restyle. */
export const radii = defineSemanticTokens.radii({
  l1: { value: '{radii.xs}' },
  l2: { value: '{radii.sm}' },
  l3: { value: '{radii.md}' },
})

/** Park UI's Radix-based palettes replace Panda's 50–950 colors; drop those from the preset. */
export const removePandaPresetColors = definePlugin({
  name: 'Remove Panda Preset Colors',
  hooks: {
    'preset:resolved': ({ utils, preset, name }) =>
      name === '@pandacss/preset-panda'
        ? utils.omit(preset, ['theme.tokens.colors', 'theme.semanticTokens.colors'])
        : preset,
  },
})

/** The name a palette's roles refer to (`iris`, `brand`; gray palettes refer to `gray`). */
export function paletteName(palette: Palette) {
  const name = palette.subtle.bg.DEFAULT.value.base.match(/^\{colors\.([^.]+)\./)?.[1]
  if (!name) throw new Error('Not a Kiso palette: its subtle.bg does not reference a palette.')
  return name
}

/**
 * Copy a palette under a new name, e.g. `brand: definePalette('brand', blue)`. References are
 * rebased, so overriding brand.9 also updates brand.solid.bg.
 */
export function definePalette(name: string, source: Palette): Palette {
  const from = paletteName(source)
  return JSON.parse(
    JSON.stringify(source).replaceAll(`{colors.${from}.`, `{colors.${name}.`),
  ) as Palette
}

/** Alias every role of a registered palette: colorPalette="accent" then behaves like "iris". */
export function aliasPalette(
  name: string,
  shape: Palette,
  conditions: Record<string, string> = {},
): TokenTree {
  function visit(tree: TokenTree, path: string[] = []): TokenTree {
    return Object.fromEntries(
      Object.entries(tree).map(([key, node]) => {
        const next = [...path, key]
        if ('value' in node) {
          const suffix = next.filter((part) => part !== 'DEFAULT').join('.')
          const value: Record<string, string> = { base: `{colors.${name}.${suffix}}` }
          for (const [condition, option] of Object.entries(conditions))
            value[condition] = `{colors.${option}.${suffix}}`
          return [key, { value }]
        }
        return [key, visit(node, next)]
      }),
    )
  }
  return visit(shape as unknown as TokenTree)
}

export type AliasOptions = Record<'accent' | 'info' | 'success' | 'warning' | 'danger', Palette>

/**
 * Kiso's palette aliases. Pass palettes you also register in semanticTokens.colors:
 * `...aliases({ accent: iris, info: blue, success: green, warning: amber, danger: red })`.
 * Components inherit `accent`; status components and `fg.error` read the status aliases.
 */
export function aliases(options: AliasOptions) {
  return Object.fromEntries(
    Object.entries(options).map(([alias, palette]) => [
      alias,
      aliasPalette(paletteName(palette), palette),
    ]),
  ) as Record<keyof AliasOptions, TokenTree>
}
