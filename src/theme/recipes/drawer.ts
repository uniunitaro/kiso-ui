import { defineSlotRecipe } from '@pandacss/dev'
import { closeTrigger } from '../shared'

// The side follows Base UI's swipeDirection prop (data-swipe-direction): down is a bottom sheet.
export const drawer = defineSlotRecipe({
  className: 'kiso-drawer',
  jsx: ['Drawer', /^Drawer\./],
  slots: [
    'backdrop',
    'viewport',
    'popup',
    'content',
    'header',
    'body',
    'footer',
    'title',
    'description',
    'close',
    'closeTrigger',
    'indent',
    'indentBackground',
  ],
  base: {
    backdrop: {
      position: 'fixed',
      inset: '0',
      bg: 'black.a7',
      zIndex: 'overlay',
      opacity: 'calc(1 - var(--drawer-swipe-progress, 0))',
      transitionProperty: 'opacity',
      transitionDuration: 'normal',
      _startingStyle: { opacity: 0 },
      _endingStyle: { opacity: 0 },
    },
    viewport: { position: 'fixed', inset: '0', zIndex: 'modal', pointerEvents: 'none' },
    popup: {
      position: 'fixed',
      display: 'flex',
      flexDirection: 'column',
      pointerEvents: 'auto',
      bg: 'gray.surface.bg',
      color: 'fg.default',
      boxShadow: 'lg',
      outline: '0',
      textStyle: 'sm',
      // Move with transform, as Base UI's docs do: while swiping, Base UI writes an inline
      // transform that replaces this one. The translate property would add to it and move the
      // popup twice as far as the pointer.
      transitionProperty: 'transform',
      transitionDuration: 'slow',
      transitionTimingFunction: 'cubic-bezier(0.32, 0.72, 0, 1)',
      '&[data-swiping]': { transitionDuration: '0s' },
      // A fast swipe closes faster (Base UI sets --drawer-swipe-strength from 0.1 to 1).
      '&[data-ending-style]': {
        transitionDuration: 'calc(var(--drawer-swipe-strength, 1) * token(durations.slow))',
      },
      '&[data-swipe-direction=down]': {
        insetInline: '0',
        bottom: '0',
        mx: 'auto',
        maxWidth: 'var(--drawer-size)',
        maxHeight: 'calc(100dvh - token(spacing.12))',
        borderTopRadius: 'l3',
        transform:
          'translateY(calc(var(--drawer-snap-point-offset, 0px) + var(--drawer-swipe-movement-y, 0px)))',
        _startingStyle: { transform: 'translateY(100%)' },
        _endingStyle: { transform: 'translateY(100%)' },
      },
      '&[data-swipe-direction=up]': {
        insetInline: '0',
        top: '0',
        mx: 'auto',
        maxWidth: 'var(--drawer-size)',
        maxHeight: 'calc(100dvh - token(spacing.12))',
        borderBottomRadius: 'l3',
        transform:
          'translateY(calc(var(--drawer-snap-point-offset, 0px) + var(--drawer-swipe-movement-y, 0px)))',
        _startingStyle: { transform: 'translateY(-100%)' },
        _endingStyle: { transform: 'translateY(-100%)' },
      },
      '&[data-swipe-direction=right]': {
        insetBlock: '0',
        right: '0',
        width: 'min(var(--drawer-size), 100vw)',
        transform: 'translateX(var(--drawer-swipe-movement-x, 0px))',
        _startingStyle: { transform: 'translateX(100%)' },
        _endingStyle: { transform: 'translateX(100%)' },
      },
      '&[data-swipe-direction=left]': {
        insetBlock: '0',
        left: '0',
        width: 'min(var(--drawer-size), 100vw)',
        transform: 'translateX(var(--drawer-swipe-movement-x, 0px))',
        _startingStyle: { transform: 'translateX(-100%)' },
        _endingStyle: { transform: 'translateX(-100%)' },
      },
    },
    content: {
      display: 'flex',
      flexDirection: 'column',
      gap: { base: '4', md: '6' },
      flex: '1',
      overflowY: 'auto',
      p: { base: '4', md: '6' },
      pb: 'max(token(spacing.6), env(safe-area-inset-bottom))',
    },
    header: { display: 'flex', flexDirection: 'column', gap: '1' },
    body: { display: 'flex', flexDirection: 'column', gap: '4', flex: '1' },
    footer: { display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '3' },
    title: { fontWeight: 'semibold', textStyle: 'lg', color: 'fg.default' },
    description: { color: 'fg.muted', textStyle: 'sm' },
    close: {},
    closeTrigger,
    // Optional page wrapper under Drawer.Provider: the page steps back while a drawer is open
    // and follows the swipe back into place.
    indentBackground: {
      position: 'fixed',
      inset: '0',
      bg: 'black',
      opacity: 0,
      transitionProperty: 'opacity',
      transitionDuration: 'slow',
      '&[data-active]': { opacity: 1 },
    },
    indent: {
      '--indent-progress': 'calc(1 - var(--drawer-swipe-progress, 0))',
      position: 'relative',
      bg: 'canvas',
      transformOrigin: 'center top',
      transitionProperty: 'scale, translate, border-radius',
      transitionDuration: 'slow',
      transitionTimingFunction: 'cubic-bezier(0.32, 0.72, 0, 1)',
      // Base UI's data-active, not the :active press state of _active.
      '&[data-active]': {
        overflow: 'hidden',
        borderRadius: 'l3',
        scale: 'calc(1 - 0.04 * var(--indent-progress))',
        translate: '0 calc(token(spacing.3) * var(--indent-progress))',
      },
    },
  },
  defaultVariants: { size: 'md' },
  variants: {
    size: {
      xs: { popup: { '--drawer-size': 'sizes.xs' } },
      sm: { popup: { '--drawer-size': 'sizes.sm' } },
      md: { popup: { '--drawer-size': 'sizes.md' } },
      lg: { popup: { '--drawer-size': 'sizes.lg' } },
      xl: { popup: { '--drawer-size': 'sizes.xl' } },
      full: { popup: { '--drawer-size': '100vw' } },
    },
  },
})
