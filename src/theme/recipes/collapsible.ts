import { defineSlotRecipe } from '@pandacss/dev'
import { control } from '../shared'
export const collapsible = defineSlotRecipe({
  className: 'kiso-collapsible',
  slots: ['root', 'trigger', 'panel'],
  staticCss: ['*'],
  base: {
    root: { width: 'full' },
    trigger: {
      ...control,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: 'full',
      gap: '3',
      fontSize: 'sm',
      fontWeight: 'medium',
      py: '3',
      '& svg': { w: '4', h: '4', transition: 'transform 180ms' },
      '&[data-panel-open] svg': { transform: 'rotate(180deg)' },
    },
    panel: {
      overflow: 'hidden',
      height: 'var(--collapsible-panel-height)',
      transition: 'height 180ms',
      fontSize: 'sm',
      color: 'fg.muted',
      lineHeight: '1.7',
      _startingStyle: { height: 0 },
      _endingStyle: { height: 0 },
      '& > div': { pb: '3' },
    },
  },
})
