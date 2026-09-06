import { defineSlotRecipe } from '@pandacss/dev'
import { focusRing, disabled } from '../shared'
export const tabs = defineSlotRecipe({
  className: 'kiso-tabs',
  slots: ['root', 'list', 'tab', 'panel', 'indicator'],
  staticCss: ['*', { size: ['*'], responsive: true }],
  base: {
    root: { width: 'full', '&[data-orientation=vertical]': { display: 'flex', gap: '4' } },
    list: {
      display: 'flex',
      maxWidth: 'full',
      overflowX: 'auto',
      gap: '1',
      position: 'relative',
      width: 'fit-content',
      '&[data-orientation=vertical]': { flexDirection: 'column' },
    },
    tab: {
      ...focusRing,
      ...disabled,
      flexShrink: 0,
      _focusVisible: { outline: '2px solid', outlineColor: 'accent', outlineOffset: '-2px' },
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '2',
      color: 'fg.muted',
      fontWeight: 'medium',
      whiteSpace: 'nowrap',
      position: 'relative',
      zIndex: 1,
      borderRadius: 'control',
      transition: 'background 120ms',
      _hover: { color: 'fg' },
    },
    panel: {
      ...focusRing,
      pt: '5',
      minWidth: 0,
      flex: 1,
      '&[data-orientation=vertical]': { pt: 0 },
    },
    indicator: { display: 'none' },
  },
  variants: {
    variant: {
      enclosed: {
        list: { bg: 'surface.subtle', p: '1', borderRadius: 'panel' },
        tab: { _selected: { bg: 'surface', color: 'fg', boxShadow: 'xs' } },
      },
      line: {
        list: {
          borderBottomWidth: '1px',
          borderBottomStyle: 'solid',
          borderColor: 'border',
          width: 'full',
          gap: '5',
          '&[data-orientation=vertical]': {
            width: 'fit-content',
            borderBottom: 0,
            borderInlineEndWidth: '1px',
            borderInlineEndStyle: 'solid',
            borderColor: 'border',
            gap: '1',
          },
        },
        tab: {
          borderRadius: 0,
          px: '0',
          _selected: { color: 'fg', boxShadow: '0 2px 0 -0.5px currentColor' },
          '&[data-orientation=vertical]': {
            justifyContent: 'start',
            _selected: { boxShadow: 'inset -2px 0 0 currentColor' },
          },
        },
      },
    },
    size: {
      sm: { tab: { px: '3', h: '7', fontSize: 'xs' } },
      md: { tab: { px: '4', h: '8', fontSize: 'sm' } },
      lg: { tab: { px: '5', h: '10', fontSize: 'md' } },
    },
  },
  defaultVariants: { variant: 'enclosed', size: 'md' },
})
