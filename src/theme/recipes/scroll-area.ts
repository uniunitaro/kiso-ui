import { defineSlotRecipe } from '@pandacss/dev'

export const scrollArea = defineSlotRecipe({
  className: 'kiso-scroll-area',
  jsx: ['ScrollArea', /^ScrollArea\./],
  slots: ['root', 'viewport', 'content', 'scrollbar', 'thumb', 'corner'],
  staticCss: ['*', { size: ['*'], responsive: true }],
  base: {
    root: {
      '--scrollbar-margin': '2px',
      position: 'relative',
      overflow: 'hidden',
      width: 'full',
      height: 'full',
    },
    viewport: {
      width: 'full',
      height: 'full',
      overscrollBehavior: 'contain',
      borderRadius: 'inherit',
      outline: '0',
      focusVisibleRing: 'inside',
    },
    scrollbar: {
      display: 'flex',
      p: 'var(--scrollbar-margin)',
      userSelect: 'none',
      touchAction: 'none',
      opacity: '0',
      transitionProperty: 'opacity',
      transitionDuration: 'normal',
      '&[data-hovering], &[data-scrolling]': { opacity: '1' },
      _vertical: {
        width: 'calc(var(--thumb-size) + var(--scrollbar-margin) * 2)',
        justifyContent: 'center',
      },
      _horizontal: {
        height: 'calc(var(--thumb-size) + var(--scrollbar-margin) * 2)',
        flexDirection: 'column',
      },
    },
    thumb: {
      bg: 'gray.a6',
      borderRadius: 'full',
      transitionProperty: 'background-color',
      transitionDuration: 'fast',
      _hover: { bg: 'gray.a8' },
      _vertical: { width: 'var(--thumb-size)' },
      _horizontal: { height: 'var(--thumb-size)' },
    },
    corner: { bg: 'transparent' },
  },
  defaultVariants: { size: 'md' },
  variants: {
    size: {
      xs: { root: { '--thumb-size': 'sizes.1' } },
      sm: { root: { '--thumb-size': 'sizes.1.5' } },
      md: { root: { '--thumb-size': 'sizes.2' } },
      lg: { root: { '--thumb-size': 'sizes.2.5' } },
    },
  },
})
