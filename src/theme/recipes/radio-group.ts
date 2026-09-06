import { defineSlotRecipe } from '@pandacss/dev'
import { control } from '../shared'
export const radioGroup = defineSlotRecipe({
  className: 'kiso-radio',
  slots: ['root', 'item', 'indicator'],
  staticCss: ['*', { size: ['*'], responsive: true }],
  base: {
    root: { display: 'flex', flexDirection: 'column', gap: '3' },
    item: {
      ...control,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      bg: 'surface',
      border: '1px solid',
      borderColor: 'border.strong',
      borderRadius: 'pill',
      flexShrink: 0,
      _checked: { borderColor: 'accent', borderWidth: '5px' },
      _invalid: { borderColor: 'danger' },
    },
    indicator: { display: 'none' },
  },
  variants: {
    size: {
      sm: { item: { w: '3.5', h: '3.5' } },
      md: { item: { w: '4', h: '4' } },
      lg: { item: { w: '5', h: '5' } },
    },
    orientation: {
      horizontal: { root: { flexDirection: 'row', flexWrap: 'wrap', gap: '5' } },
      vertical: {},
    },
  },
  defaultVariants: { size: 'md', orientation: 'vertical' },
})
