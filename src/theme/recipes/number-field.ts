import { defineSlotRecipe } from '@pandacss/dev'
import { focusRing } from '../shared'
export const numberField = defineSlotRecipe({
  className: 'kiso-number',
  slots: ['root', 'group', 'input', 'increment', 'decrement', 'scrubArea', 'scrubAreaCursor'],
  staticCss: ['*', { size: ['*'], responsive: true }],
  base: {
    root: { width: 'full' },
    group: {
      display: 'flex',
      border: '1px solid',
      borderColor: 'border.strong',
      borderRadius: 'control',
      overflow: 'hidden',
      bg: 'surface',
    },
    input: {
      width: 'full',
      minWidth: 0,
      textAlign: 'center',
      outline: 'none',
      _focus: { bg: 'accent.subtle' },
    },
    increment: {
      ...focusRing,
      px: '3',
      borderInlineStartWidth: '1px',
      borderInlineStartStyle: 'solid',
      borderColor: 'border',
      _hover: { bg: 'surface.subtle' },
      _disabled: { opacity: 0.4 },
    },
    decrement: {
      ...focusRing,
      px: '3',
      borderInlineEndWidth: '1px',
      borderInlineEndStyle: 'solid',
      borderColor: 'border',
      _hover: { bg: 'surface.subtle' },
      _disabled: { opacity: 0.4 },
    },
  },
  variants: {
    size: {
      sm: { group: { h: '8', fontSize: 'xs' } },
      md: { group: { h: '9', fontSize: 'sm' } },
      lg: { group: { h: '11', fontSize: 'md' } },
    },
  },
  defaultVariants: { size: 'md' },
})
