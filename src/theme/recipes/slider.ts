import { defineSlotRecipe } from '@pandacss/dev'
import { focusRing, disabled } from '../shared'
export const slider = defineSlotRecipe({
  className: 'kiso-slider',
  slots: ['root', 'label', 'value', 'control', 'track', 'indicator', 'thumb'],
  staticCss: ['*', { size: ['*'], responsive: true }],
  base: {
    root: {
      ...disabled,
      width: 'full',
      display: 'grid',
      gridTemplateColumns: '1fr auto',
      gap: '3',
      '&[data-orientation=vertical]': { width: 'fit-content', justifyItems: 'center' },
    },
    label: { fontSize: 'sm', fontWeight: 'medium' },
    value: { fontFamily: 'mono', fontSize: 'xs', color: 'fg.muted' },
    control: {
      display: 'flex',
      alignItems: 'center',
      position: 'relative',
      h: '5',
      gridColumn: '1 / -1',
      touchAction: 'none',
      userSelect: 'none',
      '&[data-orientation=vertical]': { h: '40', w: '5', justifyContent: 'center' },
    },
    track: {
      width: 'full',
      height: 'var(--slider-thickness)',
      bg: 'surface.hover',
      borderRadius: 'pill',
      overflow: 'hidden',
      '&[data-orientation=vertical]': { h: 'full', w: 'var(--slider-thickness)' },
    },
    indicator: { bg: 'accent', borderRadius: 'pill' },
    thumb: {
      ...focusRing,
      display: 'block',
      bg: 'surface',
      border: '2px solid',
      borderColor: 'accent',
      borderRadius: 'pill',
      boxShadow: 'xs',
    },
  },
  variants: {
    size: {
      sm: {
        track: {
          '--slider-thickness': 'token(spacing.2)',
        },
        thumb: {
          w: '5',
          h: '5',
        },
      },
      md: {
        track: {
          '--slider-thickness': 'token(spacing.2)',
        },
        thumb: {
          w: '5',
          h: '5',
        },
      },
      lg: {
        track: {
          '--slider-thickness': 'token(spacing.2)',
        },
        thumb: {
          w: '5',
          h: '5',
        },
      },
    },
  },
  defaultVariants: { size: 'md' },
})
