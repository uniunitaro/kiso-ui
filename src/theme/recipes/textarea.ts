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
      sm: { px: '2.5', fontSize: 'xs' },
      md: { px: '3', fontSize: 'sm' },
      lg: { px: '3.5', fontSize: 'md' },
    },
  },
  defaultVariants: { size: 'md', variant: 'outline' },
})
