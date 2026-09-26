import { defineSlotRecipe } from '@pandacss/dev'

export const accordion = defineSlotRecipe({
  className: 'kiso-accordion',
  jsx: ['Accordion', /^Accordion\./],
  slots: ['root', 'item', 'header', 'trigger', 'indicator', 'panel'],
  base: {
    root: { width: 'full' },
    item: { overflowAnchor: 'none' },
    header: { display: 'flex' },
    trigger: {
      display: 'flex',
      flex: '1',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '3',
      textAlign: 'start',
      color: 'fg.default',
      fontWeight: 'semibold',
      borderRadius: 'l2',
      cursor: 'pointer',
      outline: '0',
      focusVisibleRing: 'outside',
      _disabled: { layerStyle: 'disabled' },
    },
    // The chevron at the end of Trigger; it turns while the panel is open.
    indicator: {
      display: 'inline-flex',
      flexShrink: '0',
      color: 'fg.subtle',
      transitionProperty: 'rotate',
      transitionDuration: 'normal',
      _icon: { boxSize: '1.2em' },
      '[data-panel-open] &': { rotate: '180deg' },
    },
    panel: {
      overflow: 'hidden',
      height: 'var(--accordion-panel-height)',
      color: 'fg.muted',
      transitionProperty: 'height',
      transitionDuration: 'normal',
      _startingStyle: { height: '0' },
      _endingStyle: { height: '0' },
    },
  },
  defaultVariants: { variant: 'outline', size: 'md' },
  variants: {
    variant: {
      outline: { item: { borderBottomWidth: '1px' } },
      plain: {},
      enclosed: {
        root: {
          borderWidth: '1px',
          borderRadius: 'l3',
          bg: 'gray.surface.bg',
          px: '4',
        },
        item: { _notLast: { borderBottomWidth: '1px' } },
      },
    },
    size: {
      sm: {
        trigger: { py: '2', textStyle: 'sm' },
        panel: { textStyle: 'sm', '& > *': { pb: '3' } },
      },
      md: {
        trigger: { py: '2.5', textStyle: 'md' },
        panel: { textStyle: 'sm', '& > *': { pb: '4' } },
      },
      lg: {
        trigger: { py: '3', textStyle: 'lg' },
        panel: { textStyle: 'md', '& > *': { pb: '5' } },
      },
    },
  },
})
