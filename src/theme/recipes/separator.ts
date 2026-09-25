import { defineRecipe } from '@pandacss/dev'

export const separator = defineRecipe({
  className: 'kiso-separator',
  jsx: ['Separator'],
  base: {
    flexShrink: '0',
    borderColor: 'border',
    _horizontal: { width: 'full', borderTopWidth: '1px' },
    _vertical: { alignSelf: 'stretch', borderInlineStartWidth: '1px' },
  },
  defaultVariants: { variant: 'solid' },
  variants: {
    variant: {
      solid: { borderStyle: 'solid' },
      dashed: { borderStyle: 'dashed' },
      dotted: { borderStyle: 'dotted' },
    },
  },
})
