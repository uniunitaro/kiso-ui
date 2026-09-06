import { defineTokens, defineSemanticTokens } from '@pandacss/dev'

export const tokens = defineTokens({
  fonts: {
    sans: { value: "'Geist Variable', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" },
    mono: { value: "'Geist Mono Variable', ui-monospace, monospace" },
  },
  radii: {
    control: { value: 'var(--kiso-radius, 8px)' },
    panel: { value: 'calc(var(--kiso-radius, 8px) + 4px)' },
    pill: { value: '9999px' },
  },
  durations: { fast: { value: '120ms' }, normal: { value: '180ms' } },
})

export const semanticTokens = defineSemanticTokens({
  colors: {
    canvas: { value: { base: '#f8f8f6', _dark: '#141416' } },
    surface: {
      DEFAULT: { value: { base: '#ffffff', _dark: '#1c1c1f' } },
      subtle: { value: { base: '#f2f2ef', _dark: '#242427' } },
      hover: { value: { base: '#eaeae6', _dark: '#303034' } },
      raised: { value: { base: '#ffffff', _dark: '#242427' } },
    },
    fg: {
      DEFAULT: { value: { base: '#232329', _dark: '#f0f0ee' } },
      muted: { value: { base: '#66666e', _dark: '#aaaab3' } },
      subtle: { value: { base: '#707078', _dark: '#91919c' } },
      inverse: { value: { base: '#ffffff', _dark: '#19191d' } },
    },
    border: {
      DEFAULT: { value: { base: '#e4e4e0', _dark: '#35353b' } },
      strong: { value: { base: '#8b8b96', _dark: '#70707c' } },
    },
    accent: {
      DEFAULT: {
        value: {
          base: '#5b4ed6',
          _dark: '#aca2ff',
          _ocean: '#1769b3',
          _forest: '#23774d',
          _darkOcean: '#8bc5ff',
          _darkForest: '#91d7ac',
        },
      },
      hover: {
        value: {
          base: '#493dc0',
          _dark: '#bdb5ff',
          _ocean: '#10568f',
          _forest: '#195e3b',
          _darkOcean: '#aed7ff',
          _darkForest: '#ace6c1',
        },
      },
      subtle: {
        value: {
          base: '#efedfc',
          _dark: '#302b49',
          _ocean: '#e8f2ff',
          _forest: '#e8f3eb',
          _darkOcean: '#203448',
          _darkForest: '#233b2d',
        },
      },
      fg: {
        value: {
          base: '#5043ba',
          _dark: '#c4bdff',
          _ocean: '#145a98',
          _forest: '#246240',
          _darkOcean: '#b4daff',
          _darkForest: '#abe5c0',
        },
      },
      contrast: {
        value: {
          base: '#ffffff',
          _dark: '#201c36',
          _ocean: '#ffffff',
          _forest: '#ffffff',
          _darkOcean: '#15273b',
          _darkForest: '#183124',
        },
      },
    },
    danger: {
      DEFAULT: { value: { base: '#c23340', _dark: '#ff929b' } },
      subtle: { value: { base: '#fff0f1', _dark: '#3a2229' } },
    },
    success: {
      DEFAULT: { value: { base: '#287345', _dark: '#8bd8a6' } },
      subtle: { value: { base: '#edf6ee', _dark: '#203329' } },
    },
    warning: {
      DEFAULT: { value: { base: '#916014', _dark: '#f1c47b' } },
      subtle: { value: { base: '#fff6e5', _dark: '#392f20' } },
    },
    overlay: { value: '#10101880' },
  },
  shadows: {
    xs: { value: { base: '0 1px 2px #18181b06', _dark: '0 1px 2px #00000022' } },
    popup: {
      value: {
        base: '0 16px 48px -12px #19192630, 0 4px 12px #1919260a',
        _dark: '0 16px 48px -12px #00000090',
      },
    },
  },
})
