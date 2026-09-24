import { defineRecipe } from '@pandacss/dev'
export const kbd = defineRecipe({
  className: 'kiso-kbd',
  staticCss: ['*'],
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minW: '5',
    h: '5',
    px: '1',
    fontFamily: 'mono',
    fontSize: '10px',
    bg: 'surface',
    color: 'fg.muted',
    border: '1px solid',
    borderColor: 'border',
    borderRadius: 'l1',
    boxShadow: '0 1px 0 token(colors.border)',
  },
})
