import { defineSlotRecipe } from '@pandacss/dev'
import { popup } from '../shared'
export const popover = defineSlotRecipe({
  className: 'kiso-popover',
  slots: ['positioner', 'popup', 'title', 'description', 'arrow', 'close'],
  staticCss: ['*', { size: ['*'], responsive: true }],
  base: {
    positioner: { zIndex: 50, maxWidth: 'calc(100vw - 24px)' },
    popup: { ...popup, p: '4', maxHeight: 'var(--available-height)', overflowY: 'auto' },
    title: { fontSize: 'sm', fontWeight: 'semibold' },
    description: { fontSize: 'sm', color: 'fg.muted', mt: '1.5', lineHeight: '1.6' },
  },
  variants: {
    size: {
      sm: { popup: { width: '220px' } },
      md: { popup: { width: '300px' } },
      lg: { popup: { width: '380px', maxWidth: 'calc(100vw - 24px)' } },
    },
  },
  defaultVariants: { size: 'md' },
})
