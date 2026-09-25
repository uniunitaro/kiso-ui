import { defineSlotRecipe } from '@pandacss/dev'

export const fieldset = defineSlotRecipe({
  className: 'kiso-fieldset',
  jsx: ['Fieldset', /^Fieldset\./],
  slots: ['root', 'legend'],
  staticCss: ['*'],
  base: {
    root: { display: 'flex', flexDirection: 'column', gap: '5', minWidth: '0', width: 'full' },
    legend: { color: 'fg.default', fontWeight: 'semibold', textStyle: 'md', mb: '1' },
  },
  defaultVariants: { variant: 'plain' },
  variants: {
    variant: {
      plain: {},
      outline: {
        root: { borderWidth: '1px', borderRadius: 'l3', bg: 'gray.surface.bg', p: '5' },
        legend: { px: '1', mx: '-1' },
      },
    },
  },
})
