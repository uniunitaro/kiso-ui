import { defineRecipe } from '@pandacss/dev'
export const buttonGroup = defineRecipe({
  className: 'kiso-button-group',
  jsx: ['ButtonGroup'],
  staticCss: ['*'],
  base: { display: 'inline-flex', gap: '2', '& > *:focus-visible': { zIndex: 1 } },
  variants: {
    orientation: {
      horizontal: { flexDirection: 'row' },
      vertical: { flexDirection: 'column', alignItems: 'stretch' },
    },
    attached: { true: { gap: 0 } },
  },
  compoundVariants: [
    {
      orientation: 'horizontal',
      attached: true,
      css: {
        '& > *:not(:first-child)': {
          marginInlineStart: '-1px',
          borderStartStartRadius: 0,
          borderEndStartRadius: 0,
        },
        '& > *:not(:last-child)': { borderStartEndRadius: 0, borderEndEndRadius: 0 },
      },
    },
    {
      orientation: 'vertical',
      attached: true,
      css: {
        '& > *:not(:first-child)': { marginTop: '-1px', borderTopRadius: 0 },
        '& > *:not(:last-child)': { borderBottomRadius: 0 },
      },
    },
  ],
  defaultVariants: { orientation: 'horizontal', attached: false },
})
