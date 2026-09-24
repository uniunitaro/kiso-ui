import { defineSlotRecipe } from '@pandacss/dev'
export const card = defineSlotRecipe({
  className: 'kiso-card',
  slots: ['root', 'header', 'title', 'description', 'body', 'footer'],
  staticCss: ['*', { size: ['*'], responsive: true }],
  base: {
    root: {
      borderRadius: 'l3',
      border: '1px solid',
      borderColor: 'border',
      bg: 'surface',
      overflow: 'hidden',
    },
    header: { pb: '4' },
    title: { fontWeight: 'semibold', fontSize: 'md', letterSpacing: '-.02em' },
    description: { color: 'fg.muted', fontSize: 'sm', lineHeight: '1.6', mt: '1' },
    footer: { pt: '4', display: 'flex', gap: '2', alignItems: 'center' },
  },
  variants: {
    size: { sm: { root: { p: '4' } }, md: { root: { p: '5' } }, lg: { root: { p: '7' } } },
    variant: {
      outline: {},
      elevated: { root: { boxShadow: 'lg' } },
      subtle: { root: { bg: 'surface.subtle', borderColor: 'transparent' } },
    },
  },
  defaultVariants: { size: 'md', variant: 'outline' },
})
