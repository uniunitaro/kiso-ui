import { defineSlotRecipe } from '@pandacss/dev'

const action = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: '0',
  gap: '2',
  borderRadius: 'l2',
  color: 'fg.muted',
  fontWeight: 'medium',
  textDecoration: 'none',
  cursor: 'pointer',
  outline: '0',
  transitionProperty: 'background-color, color',
  transitionDuration: 'fast',
  focusVisibleRing: 'outside',
  _hover: { bg: 'gray.plain.bg.hover', color: 'fg.default' },
  // Hover outranks a bare state selector, so the pressed look repeats its own hover.
  _pressed: {
    bg: 'colorPalette.subtle.bg',
    color: 'colorPalette.subtle.fg',
    _hover: { bg: 'colorPalette.subtle.bg.hover', color: 'colorPalette.subtle.fg' },
  },
  _disabled: { layerStyle: 'disabled' },
} as const

export const toolbar = defineSlotRecipe({
  className: 'kiso-toolbar',
  jsx: ['Toolbar', /^Toolbar\./],
  slots: ['root', 'group', 'button', 'link', 'input', 'separator'],
  base: {
    root: {
      display: 'flex',
      alignItems: 'center',
      gap: '1',
      width: 'fit-content',
      maxWidth: 'full',
      overflowX: 'auto',
      _vertical: { flexDirection: 'column', overflowX: 'visible', overflowY: 'auto' },
    },
    group: { display: 'flex', flexShrink: '0', gap: '1', _vertical: { flexDirection: 'column' } },
    button: action,
    link: action,
    input: {
      h: 'var(--toolbar-item-size)',
      px: '2',
      maxWidth: '32',
      borderWidth: '1px',
      borderColor: 'gray.outline.border',
      borderRadius: 'l2',
      bg: 'transparent',
      focusVisibleRing: 'inside',
    },
    // Base UI orients the separator across the toolbar: vertical in a row, horizontal in a column.
    separator: {
      flexShrink: '0',
      alignSelf: 'stretch',
      borderColor: 'border',
      _vertical: { borderInlineStartWidth: '1px', mx: '1', my: '1' },
      _horizontal: { borderTopWidth: '1px', my: '1', mx: '1' },
    },
  },
  defaultVariants: { variant: 'outline', size: 'md' },
  variants: {
    variant: {
      plain: {},
      outline: { root: { borderWidth: '1px', borderRadius: 'l3', bg: 'gray.surface.bg', p: '1' } },
    },
    size: {
      sm: {
        root: { '--toolbar-item-size': 'sizes.8' },
        button: { h: '8', minW: '8', px: '2', textStyle: 'sm', _icon: { boxSize: '4' } },
        link: { h: '8', minW: '8', px: '2', textStyle: 'sm', _icon: { boxSize: '4' } },
        input: { textStyle: 'sm' },
      },
      md: {
        root: { '--toolbar-item-size': 'sizes.9' },
        button: { h: '9', minW: '9', px: '2.5', textStyle: 'sm', _icon: { boxSize: '4' } },
        link: { h: '9', minW: '9', px: '2.5', textStyle: 'sm', _icon: { boxSize: '4' } },
        input: { textStyle: 'sm' },
      },
      lg: {
        root: { '--toolbar-item-size': 'sizes.10' },
        button: { h: '10', minW: '10', px: '3', textStyle: 'md', _icon: { boxSize: '5' } },
        link: { h: '10', minW: '10', px: '3', textStyle: 'md', _icon: { boxSize: '5' } },
        input: { textStyle: 'md' },
      },
    },
  },
})
