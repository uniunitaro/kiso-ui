import { defineSlotRecipe } from '@pandacss/dev'
export const avatar = defineSlotRecipe({
  className: 'kiso-avatar',
  slots: ['root', 'image', 'fallback'],
  staticCss: ['*', { size: ['*'], responsive: true }],
  base: {
    root: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      borderRadius: 'pill',
      flexShrink: 0,
      bg: 'accent.subtle',
      color: 'accent.fg',
      fontWeight: 'medium',
      border: '2px solid',
      borderColor: 'surface',
    },
    image: { w: 'full', h: 'full', objectFit: 'cover' },
    fallback: { fontSize: 'inherit' },
  },
  variants: {
    size: {
      xs: { root: { w: '6', h: '6', fontSize: '9px' } },
      sm: { root: { w: '8', h: '8', fontSize: '10px' } },
      md: { root: { w: '10', h: '10', fontSize: 'xs' } },
      lg: { root: { w: '12', h: '12', fontSize: 'sm' } },
      xl: { root: { w: '16', h: '16', fontSize: 'lg' } },
    },
    shape: { circle: {}, square: { root: { borderRadius: 'panel' } } },
  },
  defaultVariants: { size: 'md', shape: 'circle' },
})
