import { defineSlotRecipe } from '@pandacss/dev'
import { arrow } from '../shared'

export const tooltip = defineSlotRecipe({
  className: 'kiso-tooltip',
  jsx: ['Tooltip', /^Tooltip\./],
  slots: ['positioner', 'popup', 'arrow'],
  staticCss: ['*'],
  base: {
    positioner: { zIndex: 'tooltip' },
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
      transitionProperty: 'opacity, scale',
      transitionDuration: 'fast',
      _startingStyle: { opacity: 0, scale: '0.96' },
      _endingStyle: { opacity: 0, scale: '0.96' },
    },
    arrow: { ...arrow, width: '2', height: '2' },
  },
})
