import { control } from '../shared'
import { defineRecipe } from '@pandacss/dev'

export const button = defineRecipe({
  className: 'kiso-button',
  staticCss: ['*', { size: ['*'], responsive: true }],
  jsx: ['Button', 'IconButton', 'CloseButton', 'ButtonGroup'],
  base: {
    ...control,
    colorPalette: 'accent',
    border: '0 solid transparent',
    alignItems: 'center',
    appearance: 'none',
    borderRadius: 'l2',
    cursor: 'pointer',
    display: 'inline-flex',
    flexShrink: '0',
    fontWeight: 'semibold',
    gap: '2',
    isolation: 'isolate',
    justifyContent: 'center',
    outline: '0',
    position: 'relative',
    transitionDuration: 'fast',
    transitionProperty: 'background-color, border-color, color, box-shadow',
    userSelect: 'none',
    verticalAlign: 'middle',
    whiteSpace: 'nowrap',
    '& svg': {
      flexShrink: '0',
    },
    _disabled: {
      opacity: 0.67,
      filter: 'grayscale(100%)',
      cursor: 'not-allowed',
    },
  },
  defaultVariants: {
    variant: 'solid',
    size: 'md',
  },
  variants: {
    variant: {
      ghost: {
        color: 'colorPalette.plain.fg',
        _hover: { bg: 'colorPalette.plain.bg.hover' },
        _active: { bg: 'colorPalette.plain.bg.active' },
      },
      danger: { bg: 'red.solid.bg', color: 'red.solid.fg', _hover: { bg: 'red.solid.bg.hover' } },
      solid: {
        bg: 'colorPalette.solid.bg',
        color: 'colorPalette.solid.fg',
        _hover: {
          bg: 'colorPalette.solid.bg.hover',
        },
      },
      surface: {
        bg: 'colorPalette.surface.bg',
        borderWidth: '1px',
        borderColor: 'colorPalette.surface.border',
        color: 'colorPalette.surface.fg',
        _hover: {
          borderColor: 'colorPalette.surface.border.hover',
        },
        _active: {
          bg: 'colorPalette.surface.bg.active',
        },
        '&[data-pressed]': {
          bg: 'colorPalette.surface.bg.active',
        },
      },
      subtle: {
        bg: 'colorPalette.subtle.bg',
        color: 'colorPalette.subtle.fg',
        _hover: {
          bg: 'colorPalette.subtle.bg.hover',
        },
        _active: {
          bg: 'colorPalette.subtle.bg.active',
        },
        '&[data-pressed]': {
          bg: 'colorPalette.subtle.bg.active',
        },
      },
      outline: {
        borderWidth: '1px',
        borderColor: 'colorPalette.outline.border',
        color: 'colorPalette.outline.fg',
        _hover: {
          bg: 'colorPalette.outline.bg.hover',
        },
        _active: {
          bg: 'colorPalette.outline.bg.active',
        },
        '&[data-pressed]': {
          bg: 'colorPalette.outline.bg.active',
        },
      },
      plain: {
        color: 'colorPalette.plain.fg',
        _hover: {
          bg: 'colorPalette.plain.bg.hover',
        },
        _active: {
          bg: 'colorPalette.plain.bg.active',
        },
        '&[data-pressed]': {
          bg: 'colorPalette.plain.bg.active',
        },
      },
    },
    square: { true: { aspectRatio: '1', px: '0' } },
    size: {
      '2xs': { h: '6', minW: '6', fontSize: 'xs', px: '2', '& svg': { boxSize: '3.5' } },
      xs: { h: '8', minW: '8', fontSize: 'sm', px: '2.5', '& svg': { boxSize: '4' } },
      sm: { h: '9', minW: '9', fontSize: 'sm', px: '3', '& svg': { boxSize: '4' } },
      md: { h: '10', minW: '10', fontSize: 'sm', px: '3.5', '& svg': { boxSize: '5' } },
      lg: { h: '11', minW: '11', fontSize: 'md', px: '4', '& svg': { boxSize: '5' } },
      xl: { h: '12', minW: '12', fontSize: 'md', px: '4.5', '& svg': { boxSize: '5.5' } },
      '2xl': { h: '16', minW: '16', fontSize: 'xl', px: '6', '& svg': { boxSize: '6' } },
    },
  },
})
