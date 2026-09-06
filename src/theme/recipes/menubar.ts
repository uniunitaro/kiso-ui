import { defineRecipe } from '@pandacss/dev'
export const menubar = defineRecipe({
  className: 'kiso-menubar',
  staticCss: ['*'],
  base: {
    display: 'flex',
    alignItems: 'center',
    gap: '1',
    p: '1',
    border: '1px solid',
    borderColor: 'border',
    bg: 'surface',
    borderRadius: 'panel',
    width: 'fit-content',
  },
})
