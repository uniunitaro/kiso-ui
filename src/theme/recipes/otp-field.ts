import { defineSlotRecipe } from '@pandacss/dev'
import { control } from '../shared'
export const otpField = defineSlotRecipe({
  className: 'kiso-otp',
  slots: ['root', 'input', 'separator'],
  staticCss: ['*', { size: ['*'], responsive: true }],
  base: {
    root: { display: 'flex', width: 'full', gap: '1.5', alignItems: 'center' },
    input: {
      ...control,
      minWidth: 0,
      flex: '1 1 0',
      border: '1px solid',
      borderColor: 'border.strong',
      bg: 'surface',
      color: 'fg',
      textAlign: 'center',
      fontFamily: 'mono',
      _focus: {
        borderColor: 'accent',
        outline: '2px solid',
        outlineColor: 'accent.subtle',
        outlineOffset: '1px',
      },
      _invalid: { borderColor: 'danger' },
    },
    separator: { w: '2', h: '1px', bg: 'border.strong', mx: '1' },
  },
  variants: {
    size: {
      xs: {
        input: {
          h: '8',
          px: '0',
          fontSize: 'sm',
          maxW: '8',
        },
      },
      sm: {
        input: {
          h: '9',
          px: '0',
          fontSize: 'sm',
          maxW: '9',
        },
      },
      md: {
        input: {
          h: '10',
          px: '0',
          fontSize: 'md',
          maxW: '10',
        },
      },
      lg: {
        input: {
          h: '11',
          px: '0',
          fontSize: 'md',
          maxW: '11',
        },
      },
      xl: {
        input: {
          h: '12',
          px: '0',
          fontSize: 'lg',
          maxW: '12',
        },
      },
      '2xl': {
        input: {
          h: '16',
          px: '0',
          fontSize: '3xl',
          maxW: '16',
        },
      },
    },
  },
  defaultVariants: { size: 'md' },
})
