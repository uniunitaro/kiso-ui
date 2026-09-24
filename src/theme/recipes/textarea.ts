import { defineRecipe } from '@pandacss/dev'
import { input } from './input'

export const textarea = defineRecipe({
  className: 'kiso-textarea',
  jsx: ['Textarea'],
  staticCss: ['*', { size: ['*'], responsive: true }],
  base: { ...input.base, height: 'auto', minHeight: '100px', py: '2.5', resize: 'vertical' },
  variants: {
    variant: input.variants!.variant,
    size: {
      xs: {
        px: '2',
        fontSize: 'sm',
      },
      sm: {
        px: '2.5',
        fontSize: 'sm',
      },
      md: {
        px: '3',
        fontSize: 'md',
      },
      lg: {
        px: '3.5',
        fontSize: 'md',
      },
      xl: {
        px: '4',
        fontSize: 'lg',
      },
      '2xl': {
        px: '4.5',
        fontSize: '3xl',
      },
    },
  },
  defaultVariants: { size: 'md', variant: 'outline' },
})
