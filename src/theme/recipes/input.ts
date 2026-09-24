import { defineRecipe } from '@pandacss/dev'
import { control } from '../shared'

export const input = defineRecipe({
  className: 'kiso-input',
  jsx: ['Input'],
  staticCss: ['*', { size: ['*'], responsive: true }],
  base: {
    ...control,
    width: 'full',
    minWidth: 0,
    bg: 'transparent',
    color: 'fg',
    border: '1px solid',
    borderColor: 'border.strong',

    _placeholder: { color: 'fg.muted' },
    _focus: {
      borderColor: 'accent',
      outline: '2px solid',
      outlineColor: 'accent.subtle',
      outlineOffset: '1px',
    },
    _invalid: { borderColor: 'danger', _focus: { outlineColor: 'danger.subtle' } },
  },
  variants: {
    size: {
      xs: {
        h: '8',
        px: '2',
        fontSize: 'sm',
      },
      sm: {
        h: '9',
        px: '2.5',
        fontSize: 'sm',
      },
      md: {
        h: '10',
        px: '3',
        fontSize: 'md',
      },
      lg: {
        h: '11',
        px: '3.5',
        fontSize: 'md',
      },
      xl: {
        h: '12',
        px: '4',
        fontSize: 'lg',
      },
      '2xl': {
        h: '16',
        px: '4.5',
        fontSize: '3xl',
      },
    },
    variant: {
      outline: {},
      surface: { bg: 'gray.surface.bg', borderColor: 'gray.surface.border' },
      subtle: { bg: 'surface.subtle', borderColor: 'transparent', boxShadow: 'none' },
    },
  },
  defaultVariants: { size: 'md', variant: 'outline' },
})
