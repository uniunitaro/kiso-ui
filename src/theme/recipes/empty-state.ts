import { defineSlotRecipe } from '@pandacss/dev'
export const emptyState = defineSlotRecipe({
  className: 'kiso-empty-state',
  slots: ['root', 'icon', 'title', 'description', 'actions'],
  staticCss: ['*', { size: ['*'], responsive: true }],
  base: {
    root: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      width: 'full',
      border: '1px dashed',
      borderColor: 'border.strong',
      borderRadius: 'panel',
      bg: 'surface',
    },
    icon: {
      display: 'grid',
      placeItems: 'center',
      w: '11',
      h: '11',
      bg: 'surface.subtle',
      color: 'fg.muted',
      borderRadius: 'panel',
      mb: '4',
      '& svg': { w: '5', h: '5' },
    },
    title: { fontWeight: 'medium', fontSize: 'md', letterSpacing: '-.02em' },
    description: {
      fontSize: 'sm',
      lineHeight: '1.7',
      color: 'fg.muted',
      mt: '2',
      maxWidth: '320px',
    },
    actions: { display: 'flex', gap: '2', justifyContent: 'center', flexWrap: 'wrap', mt: '5' },
  },
  variants: {
    size: {
      sm: { root: { px: '5', py: '6' } },
      md: { root: { px: '6', py: '10' } },
      lg: { root: { px: '8', py: '14' } },
    },
    variant: { outline: {}, plain: { root: { borderColor: 'transparent', bg: 'transparent' } } },
  },
  defaultVariants: { size: 'md', variant: 'outline' },
})
