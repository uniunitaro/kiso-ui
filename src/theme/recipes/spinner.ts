import { defineRecipe } from '@pandacss/dev'
export const spinner = defineRecipe({
  className: 'kiso-spinner',
  jsx: ['Spinner'],
  staticCss: ['*', { size: ['*'], responsive: true }],
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '2',
    '& [data-spinner]': {
      display: 'inline-block',
      border: '2px solid currentColor',
      borderInlineEndColor: 'transparent',
      borderRadius: 'full',
      animation: 'spin 800ms linear infinite',
      flexShrink: 0,
    },
  },
  variants: {
    size: {
      sm: { '& [data-spinner]': { w: '3', h: '3' } },
      md: { '& [data-spinner]': { w: '4', h: '4' } },
      lg: { '& [data-spinner]': { w: '6', h: '6' } },
    },
  },
  defaultVariants: { size: 'md' },
})
