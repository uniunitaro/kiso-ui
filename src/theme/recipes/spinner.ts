import { defineRecipe } from '@pandacss/dev'

// Inherits currentColor; set color on the spinner or its parent to tint it.
export const spinner = defineRecipe({
  className: 'kiso-spinner',
  jsx: ['Spinner'],
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '2',
    '& [data-spinner]': {
      display: 'inline-block',
      flexShrink: '0',
      width: 'var(--spinner-size)',
      height: 'var(--spinner-size)',
      borderWidth: '2px',
      borderStyle: 'solid',
      borderColor: 'currentColor',
      borderBottomColor: 'transparent',
      borderInlineStartColor: 'transparent',
      borderRadius: 'full',
      animation: 'spin 0.8s linear infinite',
    },
  },
  defaultVariants: { size: 'md' },
  variants: {
    size: {
      xs: { '--spinner-size': 'sizes.3' },
      sm: { '--spinner-size': 'sizes.4' },
      md: { '--spinner-size': 'sizes.5' },
      lg: { '--spinner-size': 'sizes.6' },
      xl: { '--spinner-size': 'sizes.7' },
      '2xl': { '--spinner-size': 'sizes.8' },
    },
  },
})
