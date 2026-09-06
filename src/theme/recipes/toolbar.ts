import { defineSlotRecipe } from '@pandacss/dev'
import { control } from '../shared'
export const toolbar = defineSlotRecipe({
  className: 'kiso-toolbar',
  slots: ['root', 'group', 'button', 'link', 'input', 'separator'],
  staticCss: ['*', { size: ['*'], responsive: true }],
  base: {
    root: {
      display: 'flex',
      alignItems: 'center',
      gap: '1',
      width: 'fit-content',
      maxWidth: 'full',
      overflowX: 'auto',
      border: '1px solid',
      borderColor: 'border',
      bg: 'surface',
      borderRadius: 'panel',
      p: '1',
      '&[data-orientation=vertical]': { flexDirection: 'column' },
    },
    group: { display: 'flex', flexShrink: 0, gap: '1' },
    button: {
      ...control,
      flexShrink: 0,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'fg.muted',
      _hover: { bg: 'surface.subtle' },
      '&[data-pressed]': { bg: 'accent.subtle', color: 'accent.fg' },
    },
    link: {
      ...control,
      flexShrink: 0,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'fg.muted',
      textDecoration: 'none',
      _hover: { bg: 'surface.subtle' },
    },
    separator: { bg: 'border', w: '1px', alignSelf: 'stretch', mx: '1', my: '1' },
    input: { ...control, px: '2', border: '1px solid', borderColor: 'border', maxWidth: '120px' },
  },
  variants: {
    size: {
      sm: {
        button: { minW: '7', h: '7', px: '2', fontSize: 'xs' },
        link: { minW: '7', h: '7', px: '2', fontSize: 'xs' },
      },
      md: {
        button: { minW: '9', h: '9', px: '3', fontSize: 'sm' },
        link: { minW: '9', h: '9', px: '3', fontSize: 'sm' },
      },
      lg: {
        button: { minW: '11', h: '11', px: '4', fontSize: 'sm' },
        link: { minW: '11', h: '11', px: '4', fontSize: 'sm' },
      },
    },
  },
  defaultVariants: { size: 'md' },
})
