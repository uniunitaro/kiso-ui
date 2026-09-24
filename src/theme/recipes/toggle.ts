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
      xs: {
        h: '8',
        minW: '8',
        px: '2',
        fontSize: 'sm',
      },
      sm: {
        h: '9',
        minW: '9',
        px: '2.5',
        fontSize: 'sm',
      },
      md: {
        h: '10',
        minW: '10',
        px: '3',
        fontSize: 'md',
      },
      lg: {
        h: '11',
        minW: '11',
        px: '3.5',
        fontSize: 'md',
      },
      xl: {
        h: '12',
        minW: '12',
        px: '4',
        fontSize: 'md',
      },
      '2xl': {
        h: '16',
        minW: '16',
        px: '4.5',
        fontSize: 'md',
      },
    },
    variant: { ghost: {}, outline: { borderColor: 'border' } },
  },
  defaultVariants: { size: 'md', variant: 'ghost' },
})
