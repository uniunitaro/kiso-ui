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
      bg: 'border.strong',
      borderRadius: 'pill',
      flexShrink: 0,
      cursor: 'pointer',
      transition: 'background 150ms',
      padding: '3px',
      _checked: { bg: 'accent' },
    },
    thumb: {
      bg: 'white',
      borderRadius: 'pill',
      boxShadow: '0 1px 3px #00000024',
      transition: 'transform 150ms',
      transform: 'translateX(0)',
      _checked: { transform: 'translateX(var(--switch-travel))' },
      '&:dir(rtl)[data-checked]': { transform: 'translateX(calc(-1 * var(--switch-travel)))' },
    },
  },
  variants: {
    size: {
      sm: { root: { w: '7', h: '4', '--switch-travel': '12px' }, thumb: { w: '2.5', h: '2.5' } },
      md: { root: { w: '9', h: '5', '--switch-travel': '16px' }, thumb: { w: '3.5', h: '3.5' } },
      lg: { root: { w: '11', h: '6', '--switch-travel': '20px' }, thumb: { w: '4.5', h: '4.5' } },
    },
  },
  defaultVariants: { size: 'md' },
})
