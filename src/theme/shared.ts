import type { SystemStyleObject } from '../../styled-system/types'

/** Floating surfaces (menus, listboxes, popovers). Base UI drives the enter/exit attributes. */
export const popup = {
  bg: 'gray.surface.bg',
  color: 'fg.default',
  borderRadius: 'l3',
  boxShadow: 'md',
  outline: '0',
  transformOrigin: 'var(--transform-origin)',
  transitionProperty: 'opacity, scale, translate',
  transitionDuration: 'fast',
  _startingStyle: { opacity: 0, scale: '0.97', translate: '0 -3px' },
  _endingStyle: { opacity: 0, scale: '0.97' },
} satisfies SystemStyleObject

/** Rows inside menus and listboxes. Sizes set padding, height and text. */
export const item = {
  display: 'flex',
  alignItems: 'center',
  width: 'full',
  borderRadius: 'l2',
  cursor: 'default',
  outline: '0',
  textAlign: 'start',
  userSelect: 'none',
  _highlighted: { bg: 'gray.surface.bg.hover' },
  _disabled: { layerStyle: 'disabled' },
} satisfies SystemStyleObject

/** Field-like controls: border, focus ring, invalid and disabled states shared by inputs. */
export const fieldControl = {
  appearance: 'none',
  borderRadius: 'l2',
  outline: '0',
  position: 'relative',
  width: 'full',
  minWidth: '0',
  color: 'fg.default',
  transitionProperty: 'background-color, border-color, box-shadow',
  transitionDuration: 'fast',
  _disabled: { layerStyle: 'disabled' },
} satisfies SystemStyleObject

/** Palette-driven looks for field controls (Input, Textarea, Select, NumberField, …). */
export const fieldVariants = {
  outline: {
    bg: 'transparent',
    borderWidth: '1px',
    borderColor: 'gray.outline.border',
    focusVisibleRing: 'inside',
    _invalid: { borderColor: 'error', focusRingColor: 'error' },
  },
  surface: {
    bg: 'gray.surface.bg',
    borderWidth: '1px',
    borderColor: 'gray.surface.border',
    focusVisibleRing: 'inside',
    _invalid: { borderColor: 'error', focusRingColor: 'error' },
  },
  subtle: {
    bg: 'gray.subtle.bg',
    borderWidth: '1px',
    borderColor: 'transparent',
    color: 'gray.subtle.fg',
    focusVisibleRing: 'inside',
    _invalid: { borderColor: 'error', focusRingColor: 'error' },
  },
} satisfies Record<string, SystemStyleObject>

const focusWithin = {
  _focusWithin: {
    outline: '1px solid',
    outlineColor: 'colorPalette.solid.bg',
    borderColor: 'colorPalette.solid.bg',
  },
  _invalid: {
    borderColor: 'error',
    _focusWithin: { outlineColor: 'error', borderColor: 'error' },
  },
} satisfies SystemStyleObject

/** Same looks for a wrapper whose inner input takes focus (Combobox, NumberField). */
export const fieldGroupVariants = {
  outline: {
    bg: 'transparent',
    borderWidth: '1px',
    borderColor: 'gray.outline.border',
    ...focusWithin,
  },
  surface: {
    bg: 'gray.surface.bg',
    borderWidth: '1px',
    borderColor: 'gray.surface.border',
    ...focusWithin,
  },
  subtle: {
    bg: 'gray.subtle.bg',
    borderWidth: '1px',
    borderColor: 'transparent',
    color: 'gray.subtle.fg',
    ...focusWithin,
  },
} satisfies Record<string, SystemStyleObject>

/** Rotated square for Popover/Tooltip arrows; it inherits the popup background. */
export const arrow = {
  width: '3',
  height: '3',
  bg: 'inherit',
  rotate: '45deg',
  zIndex: '-1',
  '&[data-side=top]': { bottom: '-1.5' },
  '&[data-side=bottom]': { top: '-1.5' },
  '&[data-side=left], &[data-side=inline-start]': { right: '-1.5' },
  '&[data-side=right], &[data-side=inline-end]': { left: '-1.5' },
} satisfies SystemStyleObject
