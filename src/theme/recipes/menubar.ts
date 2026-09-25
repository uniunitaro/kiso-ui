import { defineRecipe } from '@pandacss/dev'
import { insetRadius } from '../shared'

// Put Menu.Trigger render={<Button variant="plain" colorPalette="gray" />} inside.
export const menubar = defineRecipe({
  className: 'kiso-menubar',
  jsx: ['Menubar'],
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
      outline: {
        borderWidth: '1px',
        borderRadius: 'l3',
        bg: 'gray.surface.bg',
        p: '1',
        // Base UI gives each trigger role=menuitem; the attribute outranks the Button recipe.
        '& > [role=menuitem]': { borderRadius: insetRadius },
      },
    },
  },
})
