import { defineSlotRecipe } from '@pandacss/dev'

// Item is the circle (Base UI Radio.Root); Indicator is the dot and scales with the size.
export const radioGroup = defineSlotRecipe({
  className: 'kiso-radio',
  jsx: ['RadioGroup', /^RadioGroup\./],
  slots: ['root', 'item', 'indicator'],
  staticCss: ['*', { size: ['*'], responsive: true }],
  base: {
    root: { display: 'flex', flexDirection: 'column', gap: '3' },
    item: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: '0',
      verticalAlign: 'top',
      borderRadius: 'full',
      borderWidth: '1px',
      borderColor: 'transparent',
      cursor: 'pointer',
      transitionProperty: 'background-color, border-color',
      transitionDuration: 'fast',
      focusVisibleRing: 'outside',
      _disabled: { layerStyle: 'disabled' },
    },
    indicator: { display: 'block', boxSize: '40%', borderRadius: 'full', bg: 'currentColor' },
  },
  defaultVariants: { variant: 'solid', size: 'md', orientation: 'vertical' },
  variants: {
    variant: {
      solid: {
        item: {
          borderColor: 'gray.a9',
          _checked: {
            bg: 'colorPalette.solid.bg',
            borderColor: 'colorPalette.solid.bg',
            color: 'colorPalette.solid.fg',
          },
          _invalid: { borderColor: 'error' },
        },
      },
      surface: {
        item: {
          bg: 'colorPalette.surface.bg',
          borderColor: 'colorPalette.surface.border',
          color: 'colorPalette.surface.fg',
          _invalid: { borderColor: 'error' },
        },
      },
      subtle: {
        item: {
          bg: 'colorPalette.subtle.bg',
          color: 'colorPalette.subtle.fg',
          _invalid: { borderColor: 'error' },
        },
      },
      outline: {
        item: {
          borderColor: 'colorPalette.outline.border',
          color: 'colorPalette.outline.fg',
          _checked: { borderColor: 'colorPalette.solid.bg', color: 'colorPalette.solid.bg' },
          _invalid: { borderColor: 'error' },
        },
      },
    },
    size: {
      xs: { item: { boxSize: '4' } },
      sm: { item: { boxSize: '4.5' } },
      md: { item: { boxSize: '5' } },
      lg: { item: { boxSize: '5.5' } },
      xl: { item: { boxSize: '6' } },
      '2xl': { item: { boxSize: '8' } },
    },
    orientation: {
      horizontal: { root: { flexDirection: 'row', flexWrap: 'wrap', gap: '5' } },
      vertical: {},
    },
  },
})
