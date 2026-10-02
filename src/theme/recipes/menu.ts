import { defineSlotRecipe } from '@pandacss/dev'
import {
  arrow,
  groupLabel,
  item,
  morphPopup,
  morphPositioner,
  morphViewport,
  popup,
  popupBackdrop,
} from '../shared'

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
    'backdrop',
    'positioner',
    'popup',
    'viewport',
    'item',
    'groupLabel',
    'separator',
    'checkboxItem',
    'checkboxItemIndicator',
    'radioItem',
    'radioItemIndicator',
    'submenuTrigger',
    'submenuTriggerIndicator',
    'arrow',
  ],
  base: {
    backdrop: popupBackdrop,
    positioner: { ...morphPositioner, zIndex: 'popover' },
    popup: {
      ...popup,
      ...morphPopup,
      display: 'flex',
      flexDirection: 'column',
      minWidth: 'max(var(--anchor-width), {sizes.40})',
      maxHeight: 'min(var(--available-height), {sizes.96})',
      overflowY: 'auto',
      // Scrolling would clip the arrow outside the box; a menu with an arrow stays short.
      '&:has(> .kiso-menu__arrow)': { overflowY: 'visible' },
    },
    viewport: morphViewport('{spacing.1}'),
    item,
    checkboxItem: item,
    radioItem: item,
    // Base UI marks the trigger of an open submenu with data-popup-open: it stays lit while the
    // pointer is in the submenu.
    submenuTrigger: { ...item, '&[data-popup-open]': { bg: 'gray.surface.bg.hover' } },
    // The submenu opens on the inline-end side, so the arrow turns with the writing direction.
    submenuTriggerIndicator: { ...indicator, color: 'fg.muted', _rtl: { scale: '-1 1' } },
    groupLabel,
    separator: { h: '1px', bg: 'border', flexShrink: '0' },
    checkboxItemIndicator: indicator,
    radioItemIndicator: indicator,
    arrow,
  },
  defaultVariants: { size: 'md' },
  variants: {
    size: {
      xs: {
        popup: { p: '1', gap: '0.5', textStyle: 'sm' },
        item: { '--item-px': 'spacing.1', minH: '8', gap: '2', _icon: { boxSize: '3.5' } },
        checkboxItem: { '--item-px': 'spacing.1', minH: '8', gap: '2', _icon: { boxSize: '3.5' } },
        radioItem: { '--item-px': 'spacing.1', minH: '8', gap: '2', _icon: { boxSize: '3.5' } },
        submenuTrigger: {
          '--item-px': 'spacing.1',
          minH: '8',
          gap: '2',
          _icon: { boxSize: '3.5' },
        },
        groupLabel: { '--item-px': 'spacing.1', minH: '8', textStyle: 'xs' },
        separator: { mx: '-1', my: '0.5' },
      },
      sm: {
        popup: { p: '1', gap: '0.5', textStyle: 'sm' },
        item: { '--item-px': 'spacing.1.5', minH: '9', gap: '2', _icon: { boxSize: '4' } },
        checkboxItem: { '--item-px': 'spacing.1.5', minH: '9', gap: '2', _icon: { boxSize: '4' } },
        radioItem: { '--item-px': 'spacing.1.5', minH: '9', gap: '2', _icon: { boxSize: '4' } },
        submenuTrigger: {
          '--item-px': 'spacing.1.5',
          minH: '9',
          gap: '2',
          _icon: { boxSize: '4' },
        },
        groupLabel: { '--item-px': 'spacing.1.5', minH: '9', textStyle: 'xs' },
        separator: { mx: '-1', my: '0.5' },
      },
      md: {
        popup: { p: '1', gap: '0.5', textStyle: 'md' },
        item: { '--item-px': 'spacing.2', minH: '10', gap: '2', _icon: { boxSize: '4' } },
        checkboxItem: { '--item-px': 'spacing.2', minH: '10', gap: '2', _icon: { boxSize: '4' } },
        radioItem: { '--item-px': 'spacing.2', minH: '10', gap: '2', _icon: { boxSize: '4' } },
        submenuTrigger: { '--item-px': 'spacing.2', minH: '10', gap: '2', _icon: { boxSize: '4' } },
        groupLabel: { '--item-px': 'spacing.2', minH: '10', textStyle: 'sm' },
        separator: { mx: '-1', my: '0.5' },
      },
      lg: {
        popup: { p: '1', gap: '0.5', textStyle: 'md' },
        item: { '--item-px': 'spacing.2.5', minH: '11', gap: '2', _icon: { boxSize: '4.5' } },
        checkboxItem: {
          '--item-px': 'spacing.2.5',
          minH: '11',
          gap: '2',
          _icon: { boxSize: '4.5' },
        },
        radioItem: { '--item-px': 'spacing.2.5', minH: '11', gap: '2', _icon: { boxSize: '4.5' } },
        submenuTrigger: {
          '--item-px': 'spacing.2.5',
          minH: '11',
          gap: '2',
          _icon: { boxSize: '4.5' },
        },
        groupLabel: { '--item-px': 'spacing.2.5', minH: '11', textStyle: 'sm' },
        separator: { mx: '-1', my: '0.5' },
      },
      xl: {
        popup: { p: '1', gap: '1', textStyle: 'lg' },
        item: { '--item-px': 'spacing.3', minH: '12', gap: '3', _icon: { boxSize: '5' } },
        checkboxItem: { '--item-px': 'spacing.3', minH: '12', gap: '3', _icon: { boxSize: '5' } },
        radioItem: { '--item-px': 'spacing.3', minH: '12', gap: '3', _icon: { boxSize: '5' } },
        submenuTrigger: { '--item-px': 'spacing.3', minH: '12', gap: '3', _icon: { boxSize: '5' } },
        groupLabel: { '--item-px': 'spacing.3', minH: '12', textStyle: 'md' },
        separator: { mx: '-1', my: '1' },
      },
    },
  },
})
