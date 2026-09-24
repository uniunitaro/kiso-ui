import { defineSlotRecipe } from '@pandacss/dev'
export const fieldset = defineSlotRecipe({
  className: 'kiso-fieldset',
  slots: ['root', 'legend'],
  staticCss: ['*'],
  base: {
    root: { display: 'flex', flexDirection: 'column', gap: '5', minWidth: 0, border: 0 },
    legend: { fontSize: 'md', fontWeight: 'medium', mb: '5' },
  },
  variants: {
    variant: {
      plain: {},
      card: {
        root: {
          border: '1px solid',
          borderColor: 'border',
          borderRadius: 'l3',
          p: '5',
          bg: 'surface',
        },
        legend: { px: '1' },
      },
    },
  },
  defaultVariants: { variant: 'plain' },
})
