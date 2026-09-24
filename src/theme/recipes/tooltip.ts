import { defineSlotRecipe } from '@pandacss/dev'
export const tooltip = defineSlotRecipe({
  className: 'kiso-tooltip',
  slots: ['positioner', 'popup', 'arrow'],
  staticCss: ['*'],
  base: {
    positioner: { zIndex: 'tooltip' },
    popup: {
      bg: 'fg',
      color: 'fg.inverse',
      px: '2.5',
      py: '1.5',
      fontSize: 'xs',
      borderRadius: 'l2',
      maxWidth: '240px',
      boxShadow: 'xs',
      transition: 'opacity 120ms',
      _startingStyle: { opacity: 0 },
      _endingStyle: { opacity: 0 },
    },
  },
})
