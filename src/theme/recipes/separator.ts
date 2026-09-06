import { defineRecipe } from '@pandacss/dev'
export const separator = defineRecipe({
  className: 'kiso-separator',
  staticCss: ['*'],
  base: {
    bg: 'border',
    flexShrink: 0,
    h: '1px',
    w: 'full',
    '&[data-orientation=vertical]': { h: 'auto', alignSelf: 'stretch', w: '1px' },
  },
})
