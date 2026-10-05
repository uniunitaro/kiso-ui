// Preview only (not copied by the CLI): the Theming page switches palettes and radii at runtime.
// Apps pick fixed palettes in panda.config.ts instead; this registers every palette.
import { defineSemanticTokens } from '@pandacss/dev'
import { colors as palettes } from '../theme/colors'
import { aliasPalette } from '../theme/tokens'
import { grayNames } from './palettes'

const names = Object.keys(palettes) as (keyof typeof palettes)[]

/** `data-accent` / `data-gray` on <html> select the palettes behind `accent` and `gray`. */
export const runtimeConditions = Object.fromEntries(
  names.flatMap((name) => [
    [`accent_${name}`, `[data-accent=${name}] &`],
    [`gray_${name}`, `[data-gray=${name}] &`],
  ]),
)

export function runtimeColors(defaults: { accent: keyof typeof palettes; gray: string }) {
  const grays = Object.fromEntries(grayNames.map((name) => [`_gray_${name}`, name]))
  const accents = Object.fromEntries(names.map((name) => [`_accent_${name}`, name]))
  return {
    ...palettes,
    gray: aliasPalette(defaults.gray, palettes[defaults.gray as keyof typeof palettes], grays),
    accent: aliasPalette(defaults.accent, palettes[defaults.accent], accents),
  }
}

/** The radius picker writes --kiso-radius-l1..3 on <html>. */
export const runtimeRadii = defineSemanticTokens.radii({
  l1: { value: 'var(--kiso-radius-l1, {radii.lg})' },
  l2: { value: 'var(--kiso-radius-l2, {radii.xl})' },
  l3: { value: 'var(--kiso-radius-l3, {radii.2xl})' },
})
