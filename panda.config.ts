import { defineConfig } from '@pandacss/dev'
import { tokens, semanticTokens } from './src/theme/tokens'
import { recipes, slotRecipes } from './src/theme/recipes'
import { conditions } from './src/theme/conditions'

export default defineConfig({
  preflight: true,
  include: ['./src/**/*.{ts,tsx}'],
  exclude: [],
  outdir: 'styled-system',
  jsxFramework: 'react',
  conditions: { extend: conditions },
  theme: { extend: { tokens, semanticTokens, recipes, slotRecipes } },
  globalCss: {
    html: {
      bg: 'canvas',
      color: 'fg',
      fontFamily: 'sans',
      fontSize: '16px',
      colorScheme: 'light',
      '&[data-theme=dark]': { colorScheme: 'dark' },
    },
    body: { margin: 0, minWidth: 0, fontSize: '14px' },
    '#root': { isolation: 'isolate', minHeight: '100dvh' },
    'button, input, textarea, select': { font: 'inherit' },
    button: { cursor: 'pointer' },
    'button:disabled': { cursor: 'not-allowed' },
    '::selection': { bg: 'accent.subtle', color: 'accent.fg' },
    svg: { flexShrink: 0 },
    '@media (prefers-reduced-motion: reduce)': {
      '*, *::before, *::after': {
        animationDuration: '0.01ms!',
        transitionDuration: '0.01ms!',
        scrollBehavior: 'auto!',
      },
    },
  },
})
