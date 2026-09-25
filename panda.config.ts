import { defineConfig } from '@pandacss/dev'
import { tokens, semanticColors, aliasPalette, removePandaPresetColors } from './src/theme/tokens'
import { shadows } from './src/theme/shadows'
import { blue } from './src/theme/colors/blue'
import { green } from './src/theme/colors/green'
import { amber } from './src/theme/colors/amber'
import { red } from './src/theme/colors/red'
import { recipes, slotRecipes } from './src/theme/recipes'
import { conditions } from './src/theme/conditions'
import { globalCss } from './src/theme/global-css'
import { textStyles } from './src/theme/text-styles'
import { layerStyles } from './src/theme/layer-styles'
import { keyframes } from './src/theme/keyframes'
// Preview only: the Theming page switches accent, gray and radii at runtime.
import { runtimeColors, runtimeConditions, runtimeRadii } from './src/app/theme-runtime'
import { accentNames } from './src/app/palettes'

export default defineConfig({
  preflight: true,
  include: ['./src/**/*.{ts,tsx}'],
  exclude: [],
  outdir: 'styled-system',
  jsxFramework: 'react',
  conditions: { extend: { ...conditions, ...runtimeConditions } },
  globalCss: {
    extend: {
      ...globalCss,
      // Preview shell only.
      body: { ...globalCss.body, margin: 0, minWidth: 0, fontSize: '14px' },
      '#root': { isolation: 'isolate', minHeight: '100dvh' },
      'button, input, textarea, select': { font: 'inherit' },
    },
  },
  theme: {
    extend: {
      tokens,
      semanticTokens: {
        colors: {
          ...semanticColors,
          // Every palette, with accent and gray picked at runtime. Apps list only what they use
          // and add `...aliases({ accent, info, success, warning, danger })` instead.
          ...runtimeColors({ accent: 'iris', gray: 'neutral' }),
          info: aliasPalette('blue', blue),
          success: aliasPalette('green', green),
          warning: aliasPalette('amber', amber),
          danger: aliasPalette('red', red),
        },
        radii: runtimeRadii,
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
  // The docs preview picks colorPalette, variants and sizes at runtime, so they cannot be
  // extracted statically. Apps rely on extraction and list only runtime values here.
  staticCss: {
    recipes: '*',
    css: [
      {
        properties: {
          colorPalette: [...accentNames, 'accent', 'gray', 'info', 'success', 'warning', 'danger'],
        },
      },
    ],
  },
})
