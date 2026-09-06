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
      borderRadius: '4px',
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
      sm: { root: { w: '3.5', h: '3.5', fontSize: 'sm' } },
      md: { root: { w: '4', h: '4', fontSize: 'md' } },
      lg: { root: { w: '5', h: '5', fontSize: 'lg' } },
    },
  },
  defaultVariants: { size: 'md' },
})
