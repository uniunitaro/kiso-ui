// Base UI exposes presence attributes, not Ark/Radix data-state values.
export const conditions = {
  dark: '[data-theme=dark] &',
  ocean: '[data-accent=ocean] &',
  forest: '[data-accent=forest] &',
  darkOcean: '[data-theme=dark][data-accent=ocean] &',
  darkForest: '[data-theme=dark][data-accent=forest] &',
  checked: '&:is([data-checked], [aria-checked=true])',
  unchecked: '&[data-unchecked]',
  highlighted: '&[data-highlighted]',
  selected: '&:is([data-selected], [aria-selected=true])',
  open: '&[data-open]',
  closed: '&[data-closed]',
  expanded: '&[data-panel-open]',
  startingStyle: '&[data-starting-style]',
  endingStyle: '&[data-ending-style]',
  invalid: '&:is([data-invalid], [aria-invalid=true])',
  indeterminate: '&[data-indeterminate]',
} as const
