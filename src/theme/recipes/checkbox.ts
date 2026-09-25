import { defineSlotRecipe } from '@pandacss/dev'

// Root is the box itself (Base UI Checkbox.Root); wrap it in a <label> with your text.
export const checkbox = defineSlotRecipe({
  className: 'kiso-checkbox',
  jsx: ['Checkbox', /^Checkbox\./],
  slots: ['root', 'indicator'],
  base: {
    root: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: '0',
      verticalAlign: 'top',
      borderWidth: '1px',
      borderColor: 'transparent',
      borderRadius: 'l1',
      cursor: 'pointer',
      transitionProperty: 'background-color, border-color, color',
      transitionDuration: 'fast',
      focusVisibleRing: 'outside',
      _disabled: { layerStyle: 'disabled' },
    },
    indicator: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      _icon: { boxSize: 'var(--checkbox-icon-size)', strokeWidth: '3' },
    },
  },
  defaultVariants: { variant: 'solid', size: 'md' },
  variants: {
    variant: {
      solid: {
        root: {
          // Step a9 keeps the unchecked box at 3:1 against the canvas (WCAG 1.4.11).
          borderColor: 'gray.a9',
          _checked: {
            bg: 'colorPalette.solid.bg',
            borderColor: 'colorPalette.solid.bg',
            color: 'colorPalette.solid.fg',
          },
          _indeterminate: {
            bg: 'colorPalette.solid.bg',
            borderColor: 'colorPalette.solid.bg',
            color: 'colorPalette.solid.fg',
          },
          _invalid: { borderColor: 'error' },
        },
      },
      surface: {
        root: {
          bg: 'colorPalette.surface.bg',
          borderColor: 'colorPalette.surface.border',
          color: 'colorPalette.surface.fg',
          _invalid: { borderColor: 'error' },
        },
      },
      subtle: {
        root: {
          bg: 'colorPalette.subtle.bg',
          color: 'colorPalette.subtle.fg',
          _invalid: { borderColor: 'error' },
        },
      },
      outline: {
        root: {
          borderColor: 'colorPalette.outline.border',
          color: 'colorPalette.outline.fg',
          _checked: { borderColor: 'colorPalette.solid.bg' },
          _indeterminate: { borderColor: 'colorPalette.solid.bg' },
          _invalid: { borderColor: 'error' },
        },
      },
      plain: { root: { color: 'colorPalette.plain.fg' } },
    },
    size: {
      xs: { root: { boxSize: '4', '--checkbox-icon-size': 'sizes.3' } },
      sm: { root: { boxSize: '4.5', '--checkbox-icon-size': 'sizes.3' } },
      md: { root: { boxSize: '5', '--checkbox-icon-size': 'sizes.3.5' } },
      lg: { root: { boxSize: '5.5', '--checkbox-icon-size': 'sizes.4' } },
      xl: { root: { boxSize: '6', '--checkbox-icon-size': 'sizes.4.5' } },
      '2xl': { root: { boxSize: '8', '--checkbox-icon-size': 'sizes.6' } },
    },
  },
})
