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
      xs: {
        '& [data-spinner]': {
          w: '3',
          h: '3',
        },
      },
      sm: {
        '& [data-spinner]': {
          w: '4',
          h: '4',
        },
      },
      md: {
        '& [data-spinner]': {
          w: '5',
          h: '5',
        },
      },
      lg: {
        '& [data-spinner]': {
          w: '6',
          h: '6',
        },
      },
      xl: {
        '& [data-spinner]': {
          w: '7',
          h: '7',
        },
      },
      '2xl': {
        '& [data-spinner]': {
          w: '8',
          h: '8',
        },
      },
    },
  },
  defaultVariants: { size: 'md' },
})
