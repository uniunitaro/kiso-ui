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
      xs: {
        root: {
          w: '8',
          h: '8',
          fontSize: 'xs',
        },
      },
      sm: {
        root: {
          w: '9',
          h: '9',
          fontSize: 'sm',
        },
      },
      md: {
        root: {
          w: '10',
          h: '10',
          fontSize: 'md',
        },
      },
      lg: {
        root: {
          w: '11',
          h: '11',
          fontSize: 'md',
        },
      },
      xl: {
        root: {
          w: '12',
          h: '12',
          fontSize: 'lg',
        },
      },
      '2xl': {
        root: {
          w: '16',
          h: '16',
          fontSize: 'xl',
        },
      },
    },
    shape: { circle: {}, square: { root: { borderRadius: 'l3' } } },
  },
  defaultVariants: { size: 'md', shape: 'circle' },
})
