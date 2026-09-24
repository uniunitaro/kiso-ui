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
      borderRadius: 'l2',
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
        list: { bg: 'surface.subtle', p: '1', borderRadius: 'l3' },
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
      xs: {
        tab: {
          h: '8',
          minW: '8',
          px: '3',
          fontSize: 'xs',
        },
      },
      sm: {
        tab: {
          h: '9',
          minW: '9',
          px: '3.5',
          fontSize: 'sm',
        },
      },
      md: {
        tab: {
          h: '10',
          minW: '10',
          px: '4',
          fontSize: 'sm',
        },
      },
      lg: {
        tab: {
          h: '11',
          minW: '11',
          px: '4.5',
          fontSize: 'md',
        },
      },
    },
  },
  defaultVariants: { variant: 'enclosed', size: 'md' },
})
