import { defineRecipe } from '@pandacss/dev'
export const checkboxGroup = defineRecipe({
  className: 'kiso-checkbox-group',
  jsx: ['CheckboxGroup'],
  staticCss: ['*'],
  base: { display: 'flex', flexDirection: 'column', gap: '3' },
})
