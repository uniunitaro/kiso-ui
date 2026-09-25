import { defineSlotRecipe } from '@pandacss/dev'
import { item, popup } from '../shared'

const indicator = {
  display: 'flex',
  marginInlineStart: 'auto',
  color: 'colorPalette.plain.fg',
} as const

// Shared by Menu and ContextMenu.
export const menu = defineSlotRecipe({
  className: 'kiso-menu',
  jsx: ['Menu', /^Menu\./, 'ContextMenu', /^ContextMenu\./],
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
    positioner: { zIndex: 'popover' },
    popup: {
      ...popup,
      display: 'flex',
      flexDirection: 'column',
      minWidth: 'max(var(--anchor-width), {sizes.40})',
      maxHeight: 'min(var(--available-height), {sizes.96})',
      overflowY: 'auto',
    },
    item,
    checkboxItem: item,
    radioItem: item,
    submenuTrigger: { ...item, _open: { bg: 'gray.surface.bg.hover' } },
    groupLabel: { display: 'flex', alignItems: 'center', color: 'fg.muted', fontWeight: 'medium' },
    separator: { h: '1px', bg: 'border', flexShrink: '0' },
    checkboxItemIndicator: indicator,
    radioItemIndicator: indicator,
  },
  defaultVariants: { size: 'md' },
  variants: {
    size: {
      xs: {
        popup: { p: '1', gap: '0.5', textStyle: 'sm' },
        item: { px: '1', minH: '8', gap: '2', _icon: { boxSize: '3.5' } },
        checkboxItem: { px: '1', minH: '8', gap: '2', _icon: { boxSize: '3.5' } },
        radioItem: { px: '1', minH: '8', gap: '2', _icon: { boxSize: '3.5' } },
        submenuTrigger: { px: '1', minH: '8', gap: '2', _icon: { boxSize: '3.5' } },
        groupLabel: { px: '1', minH: '8', textStyle: 'xs' },
        separator: { mx: '-1', my: '0.5' },
      },
      sm: {
        popup: { p: '1', gap: '0.5', textStyle: 'sm' },
        item: { px: '1.5', minH: '9', gap: '2', _icon: { boxSize: '4' } },
        checkboxItem: { px: '1.5', minH: '9', gap: '2', _icon: { boxSize: '4' } },
        radioItem: { px: '1.5', minH: '9', gap: '2', _icon: { boxSize: '4' } },
        submenuTrigger: { px: '1.5', minH: '9', gap: '2', _icon: { boxSize: '4' } },
        groupLabel: { px: '1.5', minH: '9', textStyle: 'xs' },
        separator: { mx: '-1', my: '0.5' },
      },
      md: {
        popup: { p: '1', gap: '0.5', textStyle: 'md' },
        item: { px: '2', minH: '10', gap: '2', _icon: { boxSize: '4' } },
        checkboxItem: { px: '2', minH: '10', gap: '2', _icon: { boxSize: '4' } },
        radioItem: { px: '2', minH: '10', gap: '2', _icon: { boxSize: '4' } },
        submenuTrigger: { px: '2', minH: '10', gap: '2', _icon: { boxSize: '4' } },
        groupLabel: { px: '2', minH: '10', textStyle: 'sm' },
        separator: { mx: '-1', my: '0.5' },
      },
      lg: {
        popup: { p: '1', gap: '0.5', textStyle: 'md' },
        item: { px: '2.5', minH: '11', gap: '2', _icon: { boxSize: '4.5' } },
        checkboxItem: { px: '2.5', minH: '11', gap: '2', _icon: { boxSize: '4.5' } },
        radioItem: { px: '2.5', minH: '11', gap: '2', _icon: { boxSize: '4.5' } },
        submenuTrigger: { px: '2.5', minH: '11', gap: '2', _icon: { boxSize: '4.5' } },
        groupLabel: { px: '2.5', minH: '11', textStyle: 'sm' },
        separator: { mx: '-1', my: '0.5' },
      },
      xl: {
        popup: { p: '1', gap: '1', textStyle: 'lg' },
        item: { px: '3', minH: '12', gap: '3', _icon: { boxSize: '5' } },
        checkboxItem: { px: '3', minH: '12', gap: '3', _icon: { boxSize: '5' } },
        radioItem: { px: '3', minH: '12', gap: '3', _icon: { boxSize: '5' } },
        submenuTrigger: { px: '3', minH: '12', gap: '3', _icon: { boxSize: '5' } },
        groupLabel: { px: '3', minH: '12', textStyle: 'md' },
        separator: { mx: '-1', my: '1' },
      },
    },
  },
})
