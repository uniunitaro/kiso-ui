import { defineSlotRecipe } from '@pandacss/dev'
import { focusRing } from '../shared'
export const scrollArea = defineSlotRecipe({
  className: 'kiso-scroll-area',
  slots: ['root', 'viewport', 'content', 'scrollbar', 'thumb', 'corner'],
  staticCss: ['*'],
  base: {
    root: { position: 'relative', overflow: 'hidden', width: 'full', height: 'full' },
    viewport: {
      ...focusRing,
      width: 'full',
      height: 'full',
      overscrollBehavior: 'contain',
      borderRadius: 'inherit',
    },
    scrollbar: {
      display: 'flex',
      justifyContent: 'center',
      bg: 'transparent',
      p: '2px',
      opacity: 0,
      transition: 'opacity 150ms',
      userSelect: 'none',
      touchAction: 'none',
      '&[data-hovering], &[data-scrolling]': { opacity: 1 },
      '&[data-orientation=vertical]': { w: '2.5' },
      '&[data-orientation=horizontal]': { h: '2.5', flexDirection: 'column' },
    },
    thumb: { width: 'full', bg: 'border.strong', borderRadius: 'pill' },
    corner: { bg: 'surface.subtle' },
  },
})
