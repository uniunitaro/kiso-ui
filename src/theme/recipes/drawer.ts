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
    'swipeHandle',
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
      // Base UI sets data-swiping on the backdrop too: follow the pointer without lag.
      '&[data-swiping]': { transitionDuration: '0s' },
      _startingStyle: { opacity: 0 },
      _endingStyle: { opacity: 0 },
      '&[data-ending-style]': {
        transitionDuration: 'calc(var(--drawer-swipe-strength, 1) * token(durations.normal))',
      },
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
      // Past the screen edge: pulled the other way, Base UI still moves the popup a little.
      '--bleed': 'spacing.12',
      // Nested drawers (Base UI): while n children are open the popup steps back n levels,
      // smaller and peeking above them. --drawer-swipe-progress is the child's swipe here, so
      // dragging the child away brings the parent forward with the pointer. Base UI registers
      // its swipe variables as not inherited: copy the progress for the pseudo-elements and
      // children.
      '--nested-progress': 'clamp(0, var(--drawer-swipe-progress, 0), 1)',
      '--stack-depth': 'max(0, calc(var(--nested-drawers, 0) - var(--nested-progress)))',
      '--stack-scale': 'calc(1 - 0.04 * var(--stack-depth))',
      '--stack-peek': 'calc(token(spacing.4) * var(--stack-depth))',
      // Height of the stack's frontmost drawer: the parent takes it, so it peeks evenly.
      '--stack-height': 'var(--drawer-frontmost-height, var(--drawer-height, 0px))',
      willChange: 'transform',
      // Move with transform, as Base UI's docs do: while swiping, Base UI writes an inline
      // transform that replaces this one. The translate property would add to it and move the
      // popup twice as far as the pointer.
      transitionProperty: 'transform, height',
      transitionDuration: 'slow',
      transitionTimingFunction: 'cubic-bezier(0.32, 0.72, 0, 1)',
      // Lets height ease to and from auto where supported (Chromium); elsewhere it jumps.
      interpolateSize: 'allow-keywords',
      '&[data-swiping], &[data-nested-drawer-swiping]': { transitionDuration: '0s' },
      _before: {
        content: '""',
        position: 'absolute',
        bg: 'inherit',
        pointerEvents: 'none',
      },
      // The parent behind a nested drawer: dimmed, its content faded until the child is
      // dragged away.
      _after: {
        content: '""',
        position: 'absolute',
        inset: '0',
        borderRadius: 'inherit',
        bg: 'black.a3',
        opacity: 0,
        pointerEvents: 'none',
        transitionProperty: 'opacity',
        transitionDuration: 'slow',
      },
      '& > *': { transitionProperty: 'opacity', transitionDuration: 'slow' },
      '&[data-nested-drawer-swiping] > *': { transitionDuration: '0s' },
      '&[data-nested-drawer-open]': {
        overflow: 'hidden',
        _after: { opacity: 'calc(1 - var(--nested-progress))' },
        '& > *': { opacity: 'var(--nested-progress)' },
      },
      '&[data-nested-drawer-swiping]::after': { transitionDuration: '0s' },
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
        // At a lower snap point the bottom of the sheet is off screen: pad it so the end of
        // Content can still be scrolled into view (the popup grows to its max height).
        pb: 'var(--drawer-snap-point-offset, 0px)',
        transformOrigin: 'center bottom',
        transform:
          'translateY(calc(var(--drawer-snap-point-offset, 0px) + var(--drawer-swipe-movement-y, 0px) - var(--stack-peek) - (1 - var(--stack-scale)) * var(--stack-height))) scale(var(--stack-scale))',
        _before: { insetInline: '0', top: '100%', height: 'var(--bleed)' },
        '&[data-nested-drawer-open]': { height: 'var(--stack-height)' },
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
        transformOrigin: 'center top',
        transform:
          'translateY(calc(var(--drawer-snap-point-offset, 0px) + var(--drawer-swipe-movement-y, 0px) + var(--stack-peek) + (1 - var(--stack-scale)) * var(--stack-height))) scale(var(--stack-scale))',
        _before: { insetInline: '0', bottom: '100%', height: 'var(--bleed)' },
        '&[data-nested-drawer-open]': { height: 'var(--stack-height)' },
        _startingStyle: { transform: 'translateY(-100%)' },
        _endingStyle: { transform: 'translateY(-100%)' },
      },
      '&[data-swipe-direction=right]': {
        insetBlock: '0',
        right: '0',
        width: 'min(var(--drawer-size), 100vw)',
        // A nested panel covers this one from the right; this one peeks out on the left.
        transformOrigin: 'left center',
        transform:
          'translateX(calc(var(--drawer-swipe-movement-x, 0px) - var(--stack-peek))) scale(var(--stack-scale))',
        _before: { insetBlock: '0', left: '100%', width: 'var(--bleed)' },
        _startingStyle: { transform: 'translateX(100%)' },
        _endingStyle: { transform: 'translateX(100%)' },
      },
      '&[data-swipe-direction=left]': {
        insetBlock: '0',
        left: '0',
        width: 'min(var(--drawer-size), 100vw)',
        transformOrigin: 'right center',
        transform:
          'translateX(calc(var(--drawer-swipe-movement-x, 0px) + var(--stack-peek))) scale(var(--stack-scale))',
        _before: { insetBlock: '0', right: '100%', width: 'var(--bleed)' },
        _startingStyle: { transform: 'translateX(-100%)' },
        _endingStyle: { transform: 'translateX(-100%)' },
      },
    },
    // Grip outside Content: Base UI starts a mouse drag only outside Content (touch works
    // anywhere), so this is where a pointer picks the drawer up.
    swipeHandle: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: '0',
      cursor: 'grab',
      touchAction: 'none',
      userSelect: 'none',
      _before: { content: '""', borderRadius: 'full', bg: 'gray.a6' },
      '[data-swiping] > &': { cursor: 'grabbing' },
      // It overlaps the padding of Content to sit close to the header: above it, so the whole
      // strip still picks the drawer up.
      '[data-swipe-direction=down] > &, [data-swipe-direction=up] > &': {
        position: 'relative',
        zIndex: '1',
        h: '6',
        _before: { w: '10', h: '1' },
      },
      '[data-swipe-direction=down] > &': { mb: { base: '-2', md: '-4' } },
      '[data-swipe-direction=up] > &': { order: '1', mt: { base: '-2', md: '-4' } },
      '[data-swipe-direction=left] > &, [data-swipe-direction=right] > &': {
        position: 'absolute',
        insetBlock: '0',
        zIndex: '1',
        w: '4',
        _before: { w: '1', h: '10' },
      },
      '[data-swipe-direction=right] > &': { left: '0' },
      '[data-swipe-direction=left] > &': { right: '0' },
    },
    content: {
      display: 'flex',
      flexDirection: 'column',
      gap: { base: '4', md: '6' },
      flex: '1',
      overflowY: 'auto',
      // Scrolling to the end stops here instead of moving the page behind.
      overscrollBehavior: 'contain',
      // Not p: its md value would replace pb below.
      px: { base: '4', md: '6' },
      pt: { base: '4', md: '6' },
      // Room for the safe area and a software keyboard (inside VirtualKeyboardProvider).
      pb: 'calc(max(token(spacing.6), env(safe-area-inset-bottom)) + var(--drawer-keyboard-inset, 0px))',
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
      // Base UI gives the indent no data-swiping; as in its docs, drop the transition while
      // --drawer-swipe-progress is above 0 so the page follows the pointer, and ease otherwise.
      '--indent-transition':
        'calc(1 - clamp(0, calc(var(--drawer-swipe-progress, 0) * 100000), 1))',
      position: 'relative',
      bg: 'canvas',
      transformOrigin: 'center top',
      transitionProperty: 'scale, translate, border-radius',
      transitionDuration: 'calc(token(durations.slow) * var(--indent-transition))',
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
