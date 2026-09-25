import { defineRecipe } from '@pandacss/dev'

export const skeleton = defineRecipe({
  className: 'kiso-skeleton',
  jsx: ['Skeleton'],
  staticCss: ['*'],
  base: {
    display: 'block',
    minHeight: '4',
    borderRadius: 'l2',
    flexShrink: '0',
    color: 'transparent',
    pointerEvents: 'none',
    userSelect: 'none',
    '& *': { visibility: 'hidden' },
  },
  defaultVariants: { variant: 'pulse' },
  variants: {
    variant: {
      pulse: { bg: 'gray.subtle.bg.active', animation: 'pulse 1.2s ease-in-out infinite' },
      shine: {
        backgroundImage:
          'linear-gradient(270deg, {colors.gray.subtle.bg}, {colors.gray.subtle.bg.active}, {colors.gray.subtle.bg.active}, {colors.gray.subtle.bg})',
        backgroundSize: '400% 100%',
        animation: 'kiso-shine 5s ease-in-out infinite',
      },
      none: { bg: 'gray.subtle.bg.active' },
    },
    circle: { true: { borderRadius: 'full' } },
  },
})
