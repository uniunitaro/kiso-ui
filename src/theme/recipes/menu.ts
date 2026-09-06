import { defineSlotRecipe } from '@pandacss/dev'
import { popup, item } from '../shared'
export const menu = defineSlotRecipe({
  className: 'kiso-menu',
  slots: [
    'positioner',
    'popup',
    'item',
    'groupLabel',
    'separator',
    'checkboxItem',
    'checkboxItemIndicator',
    'radioItem',
    'radioItemIndicator',
    'submenuTrigger',
    'arrow',
  ],
  staticCss: ['*', { size: ['*'], responsive: true }],
  base: {
    positioner: { zIndex: 50 },
    popup: { ...popup, minWidth: '190px', maxHeight: 'var(--available-height)', overflowY: 'auto' },
    item,
    checkboxItem: item,
    radioItem: item,
    submenuTrigger: item,
    groupLabel: { px: '3', py: '2', fontSize: 'xs', color: 'fg.subtle', fontWeight: 'medium' },
    separator: { h: '1px', bg: 'border', my: '1' },
    checkboxItemIndicator: { marginInlineStart: 'auto' },
    radioItemIndicator: { marginInlineStart: 'auto' },
  },
  variants: {
    size: {
      sm: {
        item: { fontSize: 'xs', py: '1.5' },
        checkboxItem: { fontSize: 'xs', py: '1.5' },
        radioItem: { fontSize: 'xs', py: '1.5' },
      },
      md: {},
    },
  },
  defaultVariants: { size: 'md' },
})
