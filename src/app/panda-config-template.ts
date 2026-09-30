import { accentNames } from './palettes.ts'

// The panda.config.ts an app gets. The CLI writes and merges it (scripts/panda-config.mjs),
// KISO-SETUP.md and the Installation page show it; keep it in this one place.

export interface Palettes {
  accent: string
  gray: string
}

export const defaultPalettes: Palettes = { accent: 'iris', gray: 'neutral' }
const statusPalettes = { info: 'blue', success: 'green', warning: 'amber', danger: 'red' }

/** Kiso's roles and the palette each one copies. Recipes read only the roles and gray. */
export const rolePalettes = ({ accent }: Palettes) => ({ accent, ...statusPalettes })

/** The palettes the config imports: the gray and the sources of the roles. */
export const importedPalettes = (palettes: Palettes) => [
  ...new Set([...Object.values(rolePalettes(palettes)), palettes.gray]),
]

/** Entries after ...semanticColors in semanticTokens.colors. */
export const paletteEntries = (palettes: Palettes, quote = "'") => [
  `gray: ${palettes.gray}`,
  ...Object.entries(rolePalettes(palettes)).map(
    ([role, name]) => `${role}: definePalette(${quote}${role}${quote}, ${name})`,
  ),
]

/** Every identifier the config imports, in the order the template lists them. */
export const importOrder = (palettes: Palettes) => [
  ...['tokens', 'semanticColors', 'definePalette', 'radii', 'removePandaPresetColors', 'shadows'],
  ...importedPalettes(palettes),
  ...['conditions', 'globalCss', 'textStyles', 'layerStyles', 'keyframes', 'recipes'],
  'slotRecipes',
]

/** Where each identifier comes from, relative to the project root. */
export function moduleOf(name: string) {
  if (
    ['tokens', 'semanticColors', 'definePalette', 'radii', 'removePandaPresetColors'].includes(name)
  )
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
          // Recipes read gray and these roles; each role is a copy of a palette. Only what is
          // listed here exists: to use another color by name, import it and list it too.
${paletteEntries(palettes)
  .map((entry) => `          ${entry},`)
  .join('\n')}
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
