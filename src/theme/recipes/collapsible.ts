import { defineSlotRecipe } from '@pandacss/dev'

export const collapsible = defineSlotRecipe({
  className: 'kiso-collapsible',
  jsx: ['Collapsible', /^Collapsible\./],
  slots: ['root', 'trigger', 'panel'],
  base: {
    root: { width: 'full' },
    trigger: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '3',
      width: 'full',
      py: '2',
      textStyle: 'sm',
      fontWeight: 'medium',
      color: 'fg.default',
      borderRadius: 'l2',
      cursor: 'pointer',
      focusVisibleRing: 'outside',
      _disabled: { layerStyle: 'disabled' },
      '& > svg:last-child': {
        color: 'fg.subtle',
        boxSize: '4',
        transitionProperty: 'rotate',
        transitionDuration: 'normal',
      },
      '&[data-panel-open] > svg:last-child': { rotate: '180deg' },
    },
    panel: {
      overflow: 'hidden',
      height: 'var(--collapsible-panel-height)',
      textStyle: 'sm',
      color: 'fg.muted',
      transitionProperty: 'height',
      transitionDuration: 'normal',
      _startingStyle: { height: '0' },
      _endingStyle: { height: '0' },
      '& > *': { pb: '3' },
    },
  },
})
