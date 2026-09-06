import { defineSlotRecipe } from '@pandacss/dev'
import { focusRing, disabled } from '../shared'
export const accordion = defineSlotRecipe({
  className: 'kiso-accordion',
  slots: ['root', 'item', 'header', 'trigger', 'panel'],
  staticCss: ['*', { size: ['*'], responsive: true }],
  base: {
    root: { width: 'full' },
    item: {
      borderBottomWidth: '1px',
      borderBottomStyle: 'solid',
      borderColor: 'border',
      _last: { borderBottom: 0 },
    },
    trigger: {
      ...focusRing,
      ...disabled,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '3',
      width: 'full',
      textAlign: 'start',
      fontWeight: 'medium',
      _hover: { color: 'accent.fg' },
      '& svg': { w: '4', h: '4', transition: 'transform 180ms' },
      '&[data-panel-open] svg': { transform: 'rotate(180deg)' },
    },
    panel: {
      color: 'fg.muted',
      fontSize: 'sm',
      lineHeight: '1.7',
      overflow: 'hidden',
      height: 'var(--accordion-panel-height)',
      transition: 'height 180ms',
      _startingStyle: { height: 0 },
      _endingStyle: { height: 0 },
      '& > div': { pb: '4' },
    },
  },
  variants: {
    size: {
      sm: { trigger: { py: '3', fontSize: 'xs' } },
      md: { trigger: { py: '4', fontSize: 'sm' } },
      lg: { trigger: { py: '5', fontSize: 'md' } },
    },
    variant: {
      line: {},
      enclosed: {
        root: {
          border: '1px solid',
          borderColor: 'border',
          borderRadius: 'panel',
          px: '4',
          bg: 'surface',
        },
      },
    },
  },
  defaultVariants: { size: 'md', variant: 'line' },
})
