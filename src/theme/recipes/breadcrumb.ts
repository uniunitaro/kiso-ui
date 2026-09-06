import { defineSlotRecipe } from '@pandacss/dev'
import { focusRing } from '../shared'
export const breadcrumb = defineSlotRecipe({
  className: 'kiso-breadcrumb',
  slots: ['root', 'list', 'item', 'link', 'current', 'separator'],
  staticCss: ['*'],
  base: {
    list: {
      display: 'flex',
      alignItems: 'center',
      gap: '2',
      flexWrap: 'wrap',
      listStyle: 'none',
      fontSize: 'sm',
      color: 'fg.muted',
    },
    item: { display: 'inline-flex', alignItems: 'center' },
    link: {
      ...focusRing,
      color: 'fg.muted',
      textDecoration: 'none',
      borderRadius: '2px',
      _hover: { color: 'fg', textDecoration: 'underline', textUnderlineOffset: '3px' },
    },
    current: { color: 'fg', fontWeight: 'medium' },
    separator: { color: 'fg.subtle', userSelect: 'none', px: '1' },
  },
})
