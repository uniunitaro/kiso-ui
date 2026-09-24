import { defineSlotRecipe } from '@pandacss/dev'
import { control } from '../shared'
export const checkbox = defineSlotRecipe({
  className: 'kiso-checkbox',
  slots: ['root', 'indicator'],
  staticCss: ['*', { size: ['*'], responsive: true }],
  base: {
    root: {
      ...control,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: '1px solid',
      borderColor: 'border.strong',
      bg: 'surface',
      flexShrink: 0,
      cursor: 'pointer',
      borderRadius: 'l1',
      _checked: { bg: 'accent', borderColor: 'accent', color: 'accent.contrast' },
      _indeterminate: { bg: 'accent', borderColor: 'accent', color: 'accent.contrast' },
      _invalid: { borderColor: 'danger' },
    },
    indicator: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      '& svg': { width: '0.8em', height: '0.8em', strokeWidth: 3 },
    },
  },
  variants: {
    size: {
      xs: {
        root: {
          w: '4',
          h: '4',
          fontSize: 'sm',
        },
      },
      sm: {
        root: {
          w: '4.5',
          h: '4.5',
          fontSize: 'sm',
        },
      },
      md: {
        root: {
          w: '5',
          h: '5',
          fontSize: 'md',
        },
      },
      lg: {
        root: {
          w: '5.5',
          h: '5.5',
          fontSize: 'lg',
        },
      },
      xl: {
        root: {
          w: '6',
          h: '6',
          fontSize: 'xl',
        },
      },
      '2xl': {
        root: {
          w: '8',
          h: '8',
          fontSize: '2xl',
        },
      },
    },
  },
  defaultVariants: { size: 'md' },
})
