import { defineSlotRecipe } from '@pandacss/dev'
export const alert = defineSlotRecipe({
  className: 'kiso-alert',
  slots: ['root', 'icon', 'title', 'description'],
  staticCss: ['*'],
  base: {
    root: {
      display: 'grid',
      gridTemplateColumns: 'auto 1fr',
      columnGap: '3',
      p: '4',
      borderRadius: 'panel',
      border: '1px solid',
      borderColor: 'currentColor',
    },
    icon: { gridRow: '1 / 3', pt: '0.5', '& svg': { w: '4', h: '4' } },
    title: { fontWeight: 'medium', fontSize: 'sm' },
    description: { fontSize: 'sm', lineHeight: '1.6', mt: '1', gridColumn: 2 },
  },
  variants: {
    tone: {
      info: { root: { bg: 'accent.subtle', color: 'accent.fg' } },
      success: { root: { bg: 'success.subtle', color: 'success' } },
      warning: { root: { bg: 'warning.subtle', color: 'warning' } },
      danger: { root: { bg: 'danger.subtle', color: 'danger' } },
    },
  },
  defaultVariants: { tone: 'info' },
})
