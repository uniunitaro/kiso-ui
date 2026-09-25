import { defineSlotRecipe } from '@pandacss/dev'
import { arrow, popup } from '../shared'

// Shared by Popover and PreviewCard.
export const popover = defineSlotRecipe({
  className: 'kiso-popover',
  jsx: ['Popover', /^Popover\./, 'PreviewCard', /^PreviewCard\./],
  slots: ['positioner', 'popup', 'title', 'description', 'arrow', 'close', 'closeTrigger'],
  base: {
    positioner: { zIndex: 'popover' },
    popup: {
      ...popup,
      boxShadow: 'lg',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      gap: '1',
      p: '4',
      textStyle: 'sm',
      maxWidth: 'var(--available-width)',
      // No overflow clipping here: the arrow sits outside the popup box.
      maxHeight: 'var(--available-height)',
    },
    title: { color: 'fg.default', fontWeight: 'medium', textStyle: 'md' },
    description: { color: 'fg.muted', textStyle: 'sm' },
    arrow,
    closeTrigger: { position: 'absolute', top: '2', insetInlineEnd: '2' },
  },
  defaultVariants: { size: 'md' },
  variants: {
    size: {
      sm: { popup: { width: '60' } },
      md: { popup: { width: 'xs' } },
      lg: { popup: { width: 'sm' } },
    },
  },
})
