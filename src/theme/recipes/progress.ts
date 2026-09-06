import { defineSlotRecipe } from '@pandacss/dev'
export const progress = defineSlotRecipe({
  className: 'kiso-progress',
  slots: ['root', 'label', 'value', 'track', 'indicator'],
  staticCss: ['*', { size: ['*'], responsive: true }],
  base: {
    root: { display: 'grid', gridTemplateColumns: '1fr auto', gap: '2', width: 'full' },
    label: { fontSize: 'sm' },
    value: { fontSize: 'xs', color: 'fg.muted', fontFamily: 'mono' },
    track: { gridColumn: '1 / -1', overflow: 'hidden', bg: 'surface.hover', borderRadius: 'pill' },
    indicator: {
      bg: 'accent',
      height: 'full',
      borderRadius: 'pill',
      transition: 'width 250ms',
      _indeterminate: { width: '40%', animation: 'pulse 1.4s ease-in-out infinite' },
    },
  },
  variants: {
    size: { sm: { track: { h: '1' } }, md: { track: { h: '1.5' } }, lg: { track: { h: '2.5' } } },
  },
  defaultVariants: { size: 'md' },
})
