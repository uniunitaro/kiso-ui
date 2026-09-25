import { defineSlotRecipe } from '@pandacss/dev'

export const breadcrumb = defineSlotRecipe({
  className: 'kiso-breadcrumb',
  jsx: ['Breadcrumb', /^Breadcrumb\./],
  slots: ['root', 'list', 'item', 'link', 'current', 'separator'],
  base: {
    list: {
      display: 'flex',
      alignItems: 'center',
      flexWrap: 'wrap',
      listStyle: 'none',
      wordBreak: 'break-word',
      color: 'fg.muted',
    },
    item: { display: 'inline-flex', alignItems: 'center' },
    link: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '1.5',
      color: 'inherit',
      textDecoration: 'none',
      borderRadius: 'l1',
      outline: '0',
      transitionProperty: 'color',
      transitionDuration: 'fast',
      focusVisibleRing: 'outside',
      _hover: { color: 'fg.default' },
    },
    current: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '1.5',
      color: 'fg.default',
      fontWeight: 'medium',
    },
    separator: {
      display: 'flex',
      color: 'fg.subtle',
      userSelect: 'none',
      _icon: { boxSize: '1em' },
    },
  },
  defaultVariants: { variant: 'plain', size: 'md' },
  variants: {
    variant: {
      plain: {},
      underline: {
        link: {
          textDecoration: 'underline',
          textUnderlineOffset: '0.2em',
          textDecorationColor: 'gray.a6',
          _hover: { textDecorationColor: 'currentColor' },
        },
      },
    },
    size: {
      sm: { list: { gap: '1', textStyle: 'sm' } },
      md: { list: { gap: '1.5', textStyle: 'md' } },
      lg: { list: { gap: '2', textStyle: 'lg' } },
    },
  },
})
