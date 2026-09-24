import { defineRecipe } from '@pandacss/dev'
export const skeleton = defineRecipe({
  className: 'kiso-skeleton',
  staticCss: ['*'],
  base: { bg: 'surface.hover', borderRadius: 'l2', minH: '4' },
})
