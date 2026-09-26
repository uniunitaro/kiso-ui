import { accentNames } from './palettes.ts'

// The panda.config.ts an app gets. The CLI writes and merges it (scripts/panda-config.mjs),
// KISO-SETUP.md and the Installation page show it; keep it in this one place.

export interface Palettes {
  accent: string
  gray: string
}

export const defaultPalettes: Palettes = { accent: 'iris', gray: 'neutral' }
const statusPalettes = { info: 'blue', success: 'green', warning: 'amber', danger: 'red' }

/** Palettes listed by name in semanticTokens.colors. */
export const listedPalettes = ({ accent }: Palettes) => [
  ...new Set([accent, ...Object.values(statusPalettes)]),
]

export const aliasesCall = ({ accent }: Palettes) =>
  `aliases({ accent: ${accent}, ${Object.entries(statusPalettes)
    .map(([role, name]) => `${role}: ${name}`)
    .join(', ')} })`

/** Every identifier the config imports, in the order the template lists them. */
export const importOrder = (palettes: Palettes) => [
  ...['tokens', 'semanticColors', 'aliases', 'radii', 'removePandaPresetColors', 'shadows'],
  ...new Set([...listedPalettes(palettes), palettes.gray]),
  ...['conditions', 'globalCss', 'textStyles', 'layerStyles', 'keyframes', 'recipes'],
  'slotRecipes',
]

/** Where each identifier comes from, relative to the project root. */
export function moduleOf(name: string) {
  if (['tokens', 'semanticColors', 'aliases', 'radii', 'removePandaPresetColors'].includes(name))
    return './src/theme/tokens'
  if (name === 'recipes' || name === 'slotRecipes') return './src/theme/recipes'
  if ((accentNames as readonly string[]).includes(name)) return `./src/theme/colors/${name}`
  return `./src/theme/${name.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}`
}

export function importLines(names: string[], { quote = "'", semi = '' } = {}) {
  const byModule = new Map<string, string[]>()
  for (const name of names) {
    const from = moduleOf(name)
    byModule.set(from, [...(byModule.get(from) ?? []), name])
  }
  return [...byModule].map(
    ([from, list]) => `import { ${list.join(', ')} } from ${quote}${from}${quote}${semi}`,
  )
}

/** The whole panda.config.ts for a new project. */
export function pandaConfigTemplate(palettes: Palettes = defaultPalettes) {
  return `import { defineConfig } from '@pandacss/dev'
${importLines(importOrder(palettes)).join('\n')}

export default defineConfig({
  preflight: true,
  jsxFramework: 'react',
  include: ['./src/**/*.{ts,tsx}'],
  outdir: 'styled-system',
  conditions: { extend: conditions },
  globalCss: { extend: globalCss },
  theme: {
    extend: {
      tokens,
      semanticTokens: {
        colors: {
          ...semanticColors,
          // Only the palettes listed here exist. Add one: import it and list it.
${listedPalettes(palettes)
  .map((name) => `          ${name},`)
  .join('\n')}
          gray: ${palettes.gray},
          ...${aliasesCall(palettes)},
        },
        radii,
        shadows,
      },
      textStyles,
      layerStyles,
      keyframes,
      recipes,
      slotRecipes,
    },
  },
  plugins: [removePandaPresetColors],
})
`
}
