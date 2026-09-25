import { defineSlotRecipe } from '@pandacss/dev'

// Works with Base UI's anatomy: Control > Track > (Indicator, Thumb). Nothing clips the thumb.
export const slider = defineSlotRecipe({
  className: 'kiso-slider',
  jsx: ['Slider', /^Slider\./],
  slots: ['root', 'label', 'value', 'control', 'track', 'indicator', 'thumb'],
  base: {
    root: {
      display: 'grid',
      gridTemplateColumns: '1fr auto',
      alignItems: 'center',
      columnGap: '3',
      rowGap: '1',
      width: 'full',
      textStyle: 'sm',
      _disabled: { layerStyle: 'disabled' },
      _vertical: { width: 'fit-content', justifyItems: 'center' },
    },
    label: { fontWeight: 'medium' },
    value: { textStyle: 'xs', fontVariantNumeric: 'tabular-nums', color: 'fg.muted' },
    control: {
      gridColumn: '1 / -1',
      display: 'flex',
      alignItems: 'center',
      position: 'relative',
      touchAction: 'none',
      userSelect: 'none',
      _horizontal: { width: 'full', minHeight: 'var(--slider-thumb-size)' },
      _vertical: {
        flexDirection: 'column',
        height: '40',
        minWidth: 'var(--slider-thumb-size)',
      },
    },
    track: {
      position: 'relative',
      flex: '1',
      borderRadius: 'full',
      _horizontal: { height: 'var(--slider-track-size)' },
      _vertical: { width: 'var(--slider-track-size)', height: 'full' },
    },
    indicator: { borderRadius: 'full' },
    thumb: {
      display: 'block',
      width: 'var(--slider-thumb-size)',
      height: 'var(--slider-thumb-size)',
      borderRadius: 'full',
      outline: '0',
      focusVisibleRing: 'outside',
    },
  },
  defaultVariants: { variant: 'outline', size: 'md' },
  variants: {
    variant: {
      outline: {
        track: { bg: 'gray.a4' },
        indicator: { bg: 'colorPalette.solid.bg' },
        thumb: {
          bg: 'gray.surface.bg',
          borderWidth: '2px',
          borderColor: 'colorPalette.solid.bg',
          boxShadow: 'xs',
        },
      },
    },
    // Park UI keeps one scale for every size; Kiso scales the thumb and track.
    size: {
      sm: { root: { '--slider-thumb-size': 'sizes.4', '--slider-track-size': 'sizes.1.5' } },
      md: { root: { '--slider-thumb-size': 'sizes.5', '--slider-track-size': 'sizes.2' } },
      lg: { root: { '--slider-thumb-size': 'sizes.6', '--slider-track-size': 'sizes.2.5' } },
    },
  },
})
