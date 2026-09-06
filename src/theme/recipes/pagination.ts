import { defineSlotRecipe } from '@pandacss/dev'
export const pagination = defineSlotRecipe({
  className: 'kiso-pagination',
  slots: ['root', 'ellipsis'],
  staticCss: ['*'],
  base: {
    root: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '1',
      flexWrap: 'wrap',
    },
    ellipsis: { px: '1', color: 'fg.subtle' },
  },
})
