import { defineSlotRecipe } from '@pandacss/dev'
export const field = defineSlotRecipe({
  className: 'kiso-field',
  slots: ['root', 'label', 'description', 'error'],
  staticCss: ['*', { size: ['*'], responsive: true }],
  base: {
    root: { display: 'flex', flexDirection: 'column', gap: '2', width: 'full' },
    label: { fontWeight: 'medium', color: 'fg', _disabled: { opacity: 0.5 } },
    description: { color: 'fg.muted', lineHeight: '1.5' },
    error: { color: 'danger', lineHeight: '1.5' },
  },
  variants: {
    size: {
      sm: { label: { fontSize: 'xs' }, description: { fontSize: 'xs' }, error: { fontSize: 'xs' } },
      md: { label: { fontSize: 'sm' }, description: { fontSize: 'xs' }, error: { fontSize: 'xs' } },
      lg: { label: { fontSize: 'md' }, description: { fontSize: 'sm' }, error: { fontSize: 'sm' } },
    },
  },
  defaultVariants: { size: 'md' },
})
