import { defineRecipe } from '@pandacss/dev'
export const form = defineRecipe({
  className: 'kiso-form',
  jsx: ['Form'],
  base: { display: 'flex', flexDirection: 'column', gap: '5' },
})
