import { defineSlotRecipe } from '@pandacss/dev'
import { focusRing, disabled } from '../shared'
export const switchRecipe = defineSlotRecipe({
  className: 'kiso-switch',
  slots: ['root', 'thumb'],
  staticCss: ['*', { size: ['*'], responsive: true }],
  base: {
    root: {
      ...focusRing,
      ...disabled,
      position: 'relative',
      display: 'inline-flex',
      alignItems: 'center',
      bg: 'gray.subtle.bg',
      borderRadius: 'pill',
      flexShrink: 0,
      cursor: 'pointer',
      transition: 'background 150ms',
      padding: '0',
      _checked: { bg: 'accent' },
    },
    thumb: {
      bg: 'white',
      borderRadius: 'pill',
      boxShadow: 'xs',
      scale: '0.8',
      _checked: { bg: 'accent.contrast', transform: 'translateX(var(--switch-travel))' },
      transition: 'transform 150ms',
      transform: 'translateX(0)',
      '&:dir(rtl)[data-checked]': { transform: 'translateX(calc(-1 * var(--switch-travel)))' },
    },
  },
  variants: {
    size: {
      xs: {
        root: {
          w: '32px',
          h: '16px',
          '--switch-travel': '16px',
        },
        thumb: {
          w: '16px',
          h: '16px',
        },
      },
      sm: {
        root: {
          w: '36px',
          h: '18px',
          '--switch-travel': '18px',
        },
        thumb: {
          w: '18px',
          h: '18px',
        },
      },
      md: {
        root: {
          w: '40px',
          h: '20px',
          '--switch-travel': '20px',
        },
        thumb: {
          w: '20px',
          h: '20px',
        },
      },
      lg: {
        root: {
          w: '44px',
          h: '22px',
          '--switch-travel': '22px',
        },
        thumb: {
          w: '22px',
          h: '22px',
        },
      },
      xl: {
        root: {
          w: '48px',
          h: '24px',
          '--switch-travel': '24px',
        },
        thumb: {
          w: '24px',
          h: '24px',
        },
      },
      '2xl': {
        root: {
          w: '64px',
          h: '32px',
          '--switch-travel': '32px',
        },
        thumb: {
          w: '32px',
          h: '32px',
        },
      },
    },
  },
  defaultVariants: { size: 'md' },
})
