import { defineSlotRecipe } from '@pandacss/dev'
import { control, popup, item } from '../shared'
export const select = defineSlotRecipe({
  className: 'kiso-select',
  slots: [
    'trigger',
    'value',
    'icon',
    'positioner',
    'popup',
    'list',
    'item',
    'itemText',
    'itemIndicator',
    'groupLabel',
    'separator',
    'scrollUpArrow',
    'scrollDownArrow',
  ],
  staticCss: ['*', { size: ['*'], responsive: true }],
  base: {
    trigger: {
      ...control,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '3',
      width: 'full',
      border: '1px solid',
      borderColor: 'border.strong',
      bg: 'surface',
      color: 'fg',
      _invalid: { borderColor: 'danger' },
    },
    value: { truncate: true, textAlign: 'start', '&[data-placeholder]': { color: 'fg.muted' } },
    icon: { color: 'fg.muted', '& svg': { width: '4', height: '4' } },
    positioner: { zIndex: 'popover', outline: 'none' },
    popup: { ...popup, minWidth: 'var(--anchor-width)', maxHeight: 'var(--available-height)' },
    list: { overflowY: 'auto', maxH: 'min(320px, var(--available-height))' },
    item,
    itemIndicator: { marginInlineStart: 'auto', '& svg': { w: '3.5', h: '3.5' } },
    groupLabel: { px: '3', py: '2', fontSize: 'xs', fontWeight: 'medium', color: 'fg.muted' },
    separator: { h: '1px', bg: 'border', my: '1' },
  },
  variants: {
    size: {
      xs: {
        trigger: {
          h: '8',
          px: '2',
          fontSize: 'sm',
        },
      },
      sm: {
        trigger: {
          h: '9',
          px: '2.5',
          fontSize: 'sm',
        },
      },
      md: {
        trigger: {
          h: '10',
          px: '3',
          fontSize: 'md',
        },
      },
      lg: {
        trigger: {
          h: '11',
          px: '3.5',
          fontSize: 'md',
        },
      },
      xl: {
        trigger: {
          h: '12',
          px: '4',
          fontSize: 'lg',
        },
      },
      '2xl': {
        trigger: {
          h: '16',
          px: '4.5',
          fontSize: '3xl',
        },
      },
    },
  },
  defaultVariants: { size: 'md' },
})
