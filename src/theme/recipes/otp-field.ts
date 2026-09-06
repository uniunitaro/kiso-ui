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
      sm: { input: { maxW: '8', h: '9', fontSize: 'sm' } },
      md: { input: { maxW: '10', h: '11', fontSize: 'lg' } },
      lg: { input: { maxW: '12', h: '14', fontSize: 'xl' } },
    },
  },
  defaultVariants: { size: 'md' },
})
