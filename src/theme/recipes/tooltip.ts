import { defineSlotRecipe } from '@pandacss/dev'
import { arrow, morphPopup, morphPositioner, morphViewport } from '../shared'

export const tooltip = defineSlotRecipe({
  className: 'kiso-tooltip',
  jsx: ['Tooltip', /^Tooltip\./],
  slots: ['positioner', 'popup', 'viewport', 'arrow'],
  base: {
    positioner: { ...morphPositioner, zIndex: 'tooltip' },
    popup: {
      position: 'relative',
      bg: 'gray.solid.bg',
      color: 'gray.solid.fg',
      borderRadius: 'l2',
      boxShadow: 'sm',
      fontWeight: 'semibold',
      px: '2',
      py: '1.5',
      textStyle: 'xs',
      maxWidth: 'xs',
      transformOrigin: 'var(--transform-origin)',
      ...morphPopup,
      _startingStyle: { opacity: 0, scale: '0.96' },
      _endingStyle: { opacity: 0, scale: '0.96' },
      // Moving between tooltips of one Provider, or focus and dismissal: no animation.
      '&[data-instant]': { transitionDuration: '0s' },
    },
    viewport: morphViewport('{spacing.2}'),
    // The solid tooltip needs no outline.
    arrow: {
      ...arrow,
      width: '2',
      height: '2',
      borderWidth: '0',
      // Follows the popup to the next trigger of a shared handle (Base UI sets left / top).
      transitionProperty: 'left, top',
      transitionDuration: 'slow',
      transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
      '&[data-instant]': { transitionDuration: '0s' },
    },
  },
})
