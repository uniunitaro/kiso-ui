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

/**
 * Corner for things inside an l3 container with p: '1' (menu rows, enclosed tabs, menubar
 * triggers): both curves share a center at any radius scale. calc() clamps negatives to 0.
 */
export const insetRadius = 'calc({radii.l3} - {spacing.1})'

/**
 * Side padding of menu and listbox rows: the size's own padding (--item-px), widened with the
 * row's corner so text and icons clear the curve at large radius scales.
 */
const itemPaddingInline = `max(var(--item-px), calc(${insetRadius} * 0.8))`

/** Rows inside menus and listboxes. Sizes set --item-px, height and text. */
export const item = {
  display: 'flex',
  alignItems: 'center',
  width: 'full',
  paddingInline: itemPaddingInline,
  borderRadius: insetRadius,
  cursor: 'default',
  outline: '0',
  textAlign: 'start',
  userSelect: 'none',
  _highlighted: { bg: 'gray.surface.bg.hover' },
  _disabled: { layerStyle: 'disabled' },
} satisfies SystemStyleObject

/** Group headings in menus and listboxes, padded like the rows so their text lines up. */
export const groupLabel = {
  display: 'flex',
  alignItems: 'center',
  paddingInline: itemPaddingInline,
  color: 'fg.muted',
  fontWeight: 'medium',
} satisfies SystemStyleObject

/**
 * A dimmed label around a control: the label fades as a whole, and a disabled control inside
 * it drops its own fade so it is not dimmed twice.
 */
export const disabledLabel = {
  layerStyle: 'disabled',
  '& [data-disabled]': { opacity: '1', filter: 'none' },
} satisfies SystemStyleObject

/**
 * The <label> around a checkbox, radio or switch and its text. Base UI marks only the control
 * disabled, so the label follows it with :has().
 */
export const choiceLabel = {
  display: 'inline-flex',
  alignItems: 'center',
  cursor: 'pointer',
  userSelect: 'none',
  '&:has([data-disabled])': disabledLabel,
} satisfies SystemStyleObject

/** Text and gap of choiceLabel per control size (Park UI's sm–lg, extended to xs–2xl). */
export const choiceLabelSizes = {
  xs: { gap: '2', textStyle: 'sm' },
  sm: { gap: '2', textStyle: 'sm' },
  md: { gap: '3', textStyle: 'md' },
  lg: { gap: '3', textStyle: 'lg' },
  xl: { gap: '3', textStyle: 'xl' },
  '2xl': { gap: '4', textStyle: '2xl' },
} satisfies Record<string, SystemStyleObject>

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
