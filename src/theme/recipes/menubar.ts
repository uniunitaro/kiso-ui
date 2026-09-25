import { defineRecipe } from '@pandacss/dev'

// Put Menu.Trigger render={<Button variant="plain" colorPalette="gray" />} inside.
export const menubar = defineRecipe({
  className: 'kiso-menubar',
  jsx: ['Menubar'],
  staticCss: ['*'],
  base: {
    display: 'flex',
    alignItems: 'center',
    gap: '1',
    width: 'fit-content',
    maxWidth: 'full',
    _vertical: { flexDirection: 'column', alignItems: 'stretch' },
  },
  defaultVariants: { variant: 'outline' },
  variants: {
    variant: {
      plain: {},
      outline: { borderWidth: '1px', borderRadius: 'l3', bg: 'gray.surface.bg', p: '1' },
    },
  },
})
