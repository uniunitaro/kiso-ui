import { defineSlotRecipe } from '@pandacss/dev'
import { popup } from '../shared'
export const dialog = defineSlotRecipe({
  className: 'kiso-dialog',
  slots: ['backdrop', 'popup', 'title', 'description', 'close'],
  staticCss: ['*', { size: ['*'], responsive: true }],
  base: {
    backdrop: {
      position: 'fixed',
      inset: 0,
      bg: 'overlay',
      backdropFilter: 'blur(3px)',
      zIndex: 'overlay',
      transition: 'opacity 180ms',
      _startingStyle: { opacity: 0 },
      _endingStyle: { opacity: 0 },
    },
    popup: {
      ...popup,
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 'calc(100vw - 32px)',
      maxHeight: 'calc(100dvh - 48px)',
      overflowY: 'auto',
      p: '6',
      zIndex: 'modal',
      _startingStyle: { opacity: 0, transform: 'translate(-50%, -48%) scale(.98)' },
      _endingStyle: { opacity: 0, transform: 'translate(-50%, -48%) scale(.98)' },
    },
    title: { fontWeight: 'semibold', fontSize: 'lg', letterSpacing: '-.025em' },
    description: { color: 'fg.muted', mt: '2', fontSize: 'sm', lineHeight: '1.6' },
    close: { cursor: 'pointer' },
  },
  variants: {
    size: {
      xs: {
        popup: {
          maxWidth: 'xs',
        },
      },
      sm: {
        popup: {
          maxWidth: 'sm',
        },
      },
      md: {
        popup: {
          maxWidth: 'md',
        },
      },
      lg: {
        popup: {
          maxWidth: 'lg',
        },
      },
      xl: {
        popup: {
          maxWidth: 'xl',
        },
      },
    },
  },
  defaultVariants: { size: 'md' },
})
