import { defineSlotRecipe } from '@pandacss/dev'

export const avatar = defineSlotRecipe({
  className: 'kiso-avatar',
  jsx: ['Avatar', /^Avatar\./],
  slots: ['root', 'image', 'fallback'],
  staticCss: ['*', { size: ['*'], responsive: true }],
  base: {
    root: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      flexShrink: '0',
      verticalAlign: 'top',
      overflow: 'hidden',
      userSelect: 'none',
      fontWeight: 'medium',
      width: 'var(--avatar-size)',
      height: 'var(--avatar-size)',
      fontSize: 'var(--avatar-font-size)',
      borderRadius: 'var(--avatar-radius)',
    },
    image: { width: 'full', height: 'full', objectFit: 'cover', borderRadius: 'inherit' },
    fallback: {
      lineHeight: '1',
      textTransform: 'uppercase',
      _icon: { boxSize: 'var(--avatar-icon-size)' },
    },
  },
  defaultVariants: { variant: 'subtle', size: 'md', shape: 'full' },
  variants: {
    variant: {
      solid: { root: { bg: 'colorPalette.solid.bg', color: 'colorPalette.solid.fg' } },
      surface: {
        root: {
          bg: 'colorPalette.surface.bg',
          borderWidth: '1px',
          borderColor: 'colorPalette.surface.border',
          color: 'colorPalette.surface.fg',
        },
      },
      subtle: { root: { bg: 'colorPalette.subtle.bg', color: 'colorPalette.subtle.fg' } },
      outline: {
        root: {
          borderWidth: '1px',
          borderColor: 'colorPalette.outline.border',
          color: 'colorPalette.outline.fg',
        },
      },
    },
    size: {
      '2xs': {
        root: {
          '--avatar-size': 'sizes.6',
          '--avatar-font-size': 'fontSizes.2xs',
          '--avatar-icon-size': 'sizes.3',
        },
      },
      xs: {
        root: {
          '--avatar-size': 'sizes.8',
          '--avatar-font-size': 'fontSizes.xs',
          '--avatar-icon-size': 'sizes.4',
        },
      },
      sm: {
        root: {
          '--avatar-size': 'sizes.9',
          '--avatar-font-size': 'fontSizes.sm',
          '--avatar-icon-size': 'sizes.4.5',
        },
      },
      md: {
        root: {
          '--avatar-size': 'sizes.10',
          '--avatar-font-size': 'fontSizes.md',
          '--avatar-icon-size': 'sizes.5',
        },
      },
      lg: {
        root: {
          '--avatar-size': 'sizes.11',
          '--avatar-font-size': 'fontSizes.md',
          '--avatar-icon-size': 'sizes.5.5',
        },
      },
      xl: {
        root: {
          '--avatar-size': 'sizes.12',
          '--avatar-font-size': 'fontSizes.lg',
          '--avatar-icon-size': 'sizes.6',
        },
      },
      '2xl': {
        root: {
          '--avatar-size': 'sizes.16',
          '--avatar-font-size': 'fontSizes.xl',
          '--avatar-icon-size': 'sizes.8',
        },
      },
    },
    shape: {
      square: {},
      rounded: { root: { '--avatar-radius': 'radii.l3' } },
      full: { root: { '--avatar-radius': 'radii.full' } },
    },
  },
})
