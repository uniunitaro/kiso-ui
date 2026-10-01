import { defineSlotRecipe } from '@pandacss/dev'
import {
  arrow,
  closeTrigger,
  morphPopup,
  morphPositioner,
  morphViewport,
  popup,
  popupBackdrop,
} from '../shared'

// Shared by Popover and PreviewCard.
export const popover = defineSlotRecipe({
  className: 'kiso-popover',
  jsx: ['Popover', /^Popover\./, 'PreviewCard', /^PreviewCard\./],
  slots: [
    'backdrop',
    'positioner',
    'popup',
    'viewport',
    'title',
    'description',
    'arrow',
    'close',
    'closeTrigger',
  ],
  base: {
    backdrop: popupBackdrop,
    positioner: { ...morphPositioner, zIndex: 'popover' },
    popup: {
      ...popup,
      ...morphPopup,
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
    viewport: morphViewport('{spacing.4}'),
    title: { color: 'fg.default', fontWeight: 'medium', textStyle: 'md' },
    description: { color: 'fg.muted', textStyle: 'sm' },
    arrow,
    closeTrigger: { ...closeTrigger, top: '2', insetInlineEnd: '2', boxSize: '8' },
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
