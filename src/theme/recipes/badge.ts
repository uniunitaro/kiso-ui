import { defineRecipe } from '@pandacss/dev'
export const badge = defineRecipe({
  className: 'kiso-badge',
  jsx: ['Badge'],
  staticCss: ['*', { size: ['*'], responsive: true }],
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '1.5',
    borderRadius: 'pill',
    fontWeight: 'medium',
    whiteSpace: 'nowrap',
    border: '1px solid transparent',
  },
  variants: {
    tone: {
      neutral: { bg: 'surface.subtle', color: 'fg.muted' },
      accent: { bg: 'accent.subtle', color: 'accent.fg' },
      success: { bg: 'success.subtle', color: 'success' },
      danger: { bg: 'danger.subtle', color: 'danger' },
      warning: { bg: 'warning.subtle', color: 'warning' },
    },
    size: {
      sm: { px: '2', py: '0.5', fontSize: '10px' },
      md: { px: '2.5', py: '1', fontSize: 'xs' },
    },
    variant: { subtle: {}, outline: { bg: 'transparent', borderColor: 'currentColor' } },
  },
  defaultVariants: { tone: 'neutral', size: 'sm', variant: 'subtle' },
})
