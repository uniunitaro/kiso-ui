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
      borderRadius: 'l2',
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
      xs: {
        group: {
          h: '8',
          fontSize: 'sm',
        },
      },
      sm: {
        group: {
          h: '9',
          fontSize: 'sm',
        },
      },
      md: {
        group: {
          h: '10',
          fontSize: 'md',
        },
      },
      lg: {
        group: {
          h: '11',
          fontSize: 'md',
        },
      },
      xl: {
        group: {
          h: '12',
          fontSize: 'lg',
        },
      },
      '2xl': {
        group: {
          h: '16',
          fontSize: '3xl',
        },
      },
    },
  },
  defaultVariants: { size: 'md' },
})
