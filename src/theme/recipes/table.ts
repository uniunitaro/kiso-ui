import { defineSlotRecipe } from '@pandacss/dev'

// Slots follow the element: header = thead, head = th (Park UI names them the other way round).
export const table = defineSlotRecipe({
  className: 'kiso-table',
  jsx: ['Table', /^Table\./],
  slots: ['root', 'container', 'header', 'body', 'footer', 'row', 'head', 'cell', 'caption'],
  base: {
    container: {
      width: 'full',
      overflowX: 'auto',
      borderWidth: '1px',
      borderRadius: 'l3',
      focusVisibleRing: 'outside',
    },
    root: {
      width: 'full',
      borderCollapse: 'collapse',
      fontVariantNumeric: 'lining-nums tabular-nums',
      textAlign: 'start',
      color: 'fg.default',
    },
    head: {
      textAlign: 'start',
      verticalAlign: 'middle',
      whiteSpace: 'nowrap',
      color: 'fg.muted',
      fontWeight: 'semibold',
      textStyle: 'xs',
      boxShadow: 'inset 0 -1px 0 0 {colors.border}',
    },
    cell: {
      textAlign: 'start',
      verticalAlign: 'middle',
      boxShadow: 'inset 0 -1px 0 0 {colors.border}',
    },
    row: {
      _last: { '& > td': { boxShadow: 'none' } },
      _selected: { bg: 'colorPalette.subtle.bg' },
    },
    footer: {
      fontWeight: 'medium',
      '& td': { boxShadow: 'inset 0 1px 0 0 {colors.border}!' },
    },
    caption: {
      captionSide: 'bottom',
      color: 'fg.muted',
      fontWeight: 'medium',
      textStyle: 'xs',
      py: '3',
    },
  },
  defaultVariants: { variant: 'plain', size: 'md' },
  variants: {
    variant: {
      plain: {},
      surface: {
        container: { bg: 'gray.surface.bg' },
        header: { bg: 'gray.surface.bg.hover' },
        row: { bg: 'gray.surface.bg' },
      },
    },
    striped: {
      true: { body: { '& > tr:nth-of-type(odd) > td': { bg: 'gray.surface.bg.hover' } } },
    },
    interactive: {
      true: { body: { '& > tr': { _hover: { bg: 'gray.surface.bg.hover' } } } },
    },
    columnBorder: {
      true: {
        head: { '&:not(:last-of-type)': { borderInlineEndWidth: '1px' } },
        cell: { '&:not(:last-of-type)': { borderInlineEndWidth: '1px' } },
      },
    },
    stickyHeader: {
      true: {
        header: {
          '& > tr': {
            position: 'sticky',
            top: 'var(--table-sticky-offset, 0)',
            zIndex: '2',
            bg: 'inherit',
          },
        },
      },
    },
    size: {
      sm: { root: { textStyle: 'xs' }, head: { px: '2', py: '2' }, cell: { px: '2', py: '2' } },
      md: { root: { textStyle: 'sm' }, head: { px: '3', py: '3' }, cell: { px: '3', py: '3' } },
      lg: { root: { textStyle: 'md' }, head: { px: '4', py: '4' }, cell: { px: '4', py: '4' } },
    },
  },
})
