import { defineSlotRecipe } from '@pandacss/dev'
import { fieldControl, fieldVariants } from '../shared'

export const otpField = defineSlotRecipe({
  className: 'kiso-otp',
  jsx: ['OtpField', /^OtpField\./],
  slots: ['root', 'input', 'separator'],
  base: {
    root: { display: 'flex', alignItems: 'center', gap: '2' },
    input: {
      ...fieldControl,
      width: 'var(--otp-size)',
      height: 'var(--otp-size)',
      flexShrink: '0',
      px: '0',
      textAlign: 'center',
      fontVariantNumeric: 'tabular-nums',
    },
    separator: { w: '2', h: '0.5', borderRadius: 'full', bg: 'gray.a7' },
  },
  defaultVariants: { variant: 'outline', size: 'md' },
  variants: {
    variant: {
      outline: { input: fieldVariants.outline },
      surface: { input: fieldVariants.surface },
      subtle: { input: fieldVariants.subtle },
    },
    size: {
      xs: { root: { gap: '1' }, input: { '--otp-size': 'sizes.8', textStyle: 'sm' } },
      sm: { root: { gap: '1.5' }, input: { '--otp-size': 'sizes.9', textStyle: 'sm' } },
      md: { root: { gap: '2' }, input: { '--otp-size': 'sizes.10', textStyle: 'md' } },
      lg: { root: { gap: '2' }, input: { '--otp-size': 'sizes.11', textStyle: 'md' } },
      xl: { root: { gap: '2.5' }, input: { '--otp-size': 'sizes.12', textStyle: 'lg' } },
      '2xl': { root: { gap: '3' }, input: { '--otp-size': 'sizes.16', textStyle: '3xl' } },
    },
  },
})
