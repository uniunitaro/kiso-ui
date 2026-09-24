import { defineSlotRecipe } from '@pandacss/dev'
import { focusRing } from '../shared'
export const table = defineSlotRecipe({
  className: 'kiso-table',
  slots: ['root', 'container', 'header', 'body', 'footer', 'row', 'head', 'cell', 'caption'],
  staticCss: ['*', { size: ['*'], responsive: true }],
  base: {
    container: {
      ...focusRing,
      width: 'full',
      overflowX: 'auto',
      border: '1px solid',
      borderColor: 'border',
      borderRadius: 'l3',
      bg: 'surface',
    },
    root: { width: 'full', borderCollapse: 'collapse', textAlign: 'start', fontSize: 'sm' },
    head: {
      textAlign: 'start',
      fontWeight: 'medium',
      color: 'fg.muted',
      bg: 'surface.subtle',
      whiteSpace: 'nowrap',
    },
    row: {
      borderBottomWidth: '1px',
      borderBottomStyle: 'solid',
      borderColor: 'border',
      _last: { borderBottom: 0 },
      _selected: { bg: 'accent.subtle' },
    },
    cell: { color: 'fg', verticalAlign: 'middle' },
    footer: { bg: 'surface.subtle', fontWeight: 'medium' },
    caption: {
      captionSide: 'bottom',
      color: 'fg.muted',
      fontSize: 'xs',
      p: '4',
      textAlign: 'start',
    },
  },
  variants: {
    size: {
      sm: {
        head: { px: '3', py: '2', fontSize: 'xs' },
        cell: { px: '3', py: '2', fontSize: 'xs' },
      },
      md: { head: { px: '4', py: '3', fontSize: 'xs' }, cell: { px: '4', py: '3' } },
      lg: { head: { px: '5', py: '4' }, cell: { px: '5', py: '4' } },
    },
    variant: {
      line: {},
      striped: { body: { '& > tr:nth-child(even)': { bg: 'surface.subtle' } } },
    },
  },
  defaultVariants: { size: 'md', variant: 'line' },
})
