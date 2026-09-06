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
    bg: 'surface',
    color: 'fg',
    border: '1px solid',
    borderColor: 'border.strong',
    boxShadow: 'xs',
    _placeholder: { color: 'fg.subtle' },
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
      sm: { h: '8', px: '2.5', fontSize: 'xs' },
      md: { h: '9', px: '3', fontSize: 'sm' },
      lg: { h: '11', px: '3.5', fontSize: 'md' },
    },
    variant: {
      outline: {},
      subtle: { bg: 'surface.subtle', borderColor: 'transparent', boxShadow: 'none' },
    },
  },
  defaultVariants: { size: 'md', variant: 'outline' },
})
