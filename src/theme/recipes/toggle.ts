import { defineRecipe } from '@pandacss/dev'
import { control } from '../shared'
export const toggle = defineRecipe({
  className: 'kiso-toggle',
  jsx: ['Toggle'],
  staticCss: ['*', { size: ['*'], responsive: true }],
  base: {
    ...control,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '2',
    color: 'fg.muted',
    border: '1px solid transparent',
    _hover: { bg: 'surface.subtle' },
    '&[data-pressed]': { bg: 'accent.subtle', color: 'accent.fg' },
    '& svg': { width: '4', height: '4' },
  },
  variants: {
    size: {
      sm: { h: '8', minW: '8', px: '2', fontSize: 'xs' },
      md: { h: '9', minW: '9', px: '3', fontSize: 'sm' },
      lg: { h: '11', minW: '11', px: '4' },
    },
    variant: { ghost: {}, outline: { borderColor: 'border' } },
  },
  defaultVariants: { size: 'md', variant: 'ghost' },
})
