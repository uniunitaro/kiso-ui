import type { SystemStyleObject } from '../../styled-system/types'

// Raw CSS values are wrapped in [ ] (Panda's escape hatch) so the objects also type-check when an
// app sets strictTokens: true. The CSS is the same; token references inside still resolve.

/** Floating surfaces (menus, listboxes, popovers). Base UI drives the enter/exit attributes. */
export const popup = {
  bg: 'gray.surface.bg',
  color: 'fg.default',
  borderRadius: 'l3',
  boxShadow: 'md',
  outline: '[0]',
  transformOrigin: 'var(--transform-origin)',
  transitionProperty: '[opacity, scale, translate]',
  transitionDuration: 'fast',
  _startingStyle: { opacity: 0, scale: '[0.97]', translate: '[0 -3px]' },
  _endingStyle: { opacity: 0, scale: '[0.97]' },
  // Base UI asks for no animation: opened from the keyboard, dismissed, or moving between
  // tooltips of one group.
  '&[data-instant]': { transitionDuration: '[0s]' },
} satisfies SystemStyleObject

const morphEasing = 'cubic-bezier(0.22, 1, 0.36, 1)'

/**
 * Positioner of a popup that moves between triggers: one handle (createHandle) shared by several
 * triggers, with a Viewport inside, or NavigationMenu. Base UI then places it with top/left and
 * sizes it (--positioner-width/height), so it glides to the next trigger. Without a Viewport it is
 * placed with transform instead, which this does not animate. Base UI turns transitions off while
 * the popup mounts, so it does not glide in from the corner; data-instant does the same for keyboard
 * opens, dismissal and once a move has finished.
 */
export const morphPositioner = {
  width: '[var(--positioner-width)]',
  height: '[var(--positioner-height)]',
  maxWidth: '[var(--available-width)]',
  transitionProperty: '[top, left, right, bottom]',
  transitionDuration: 'slow',
  transitionTimingFunction: `[${morphEasing}]`,
  '&[data-instant]': { transitionDuration: '[0s]' },
} satisfies SystemStyleObject

/**
 * Popup of morphPositioner: Base UI sets --popup-width/height to the old size and then the new
 * one while the content changes, and back to auto afterwards, so the size eases between them.
 * Spread after `popup`; a fixed width set later (a size variant) wins over the width here.
 */
export const morphPopup = {
  width: '[var(--popup-width, auto)]',
  height: '[var(--popup-height, auto)]',
  transitionProperty: '[opacity, scale, translate, width, height]',
  transitionDuration:
    '[{durations.fast}, {durations.fast}, {durations.fast}, {durations.slow}, {durations.slow}]',
  transitionTimingFunction: `[ease, ease, ease, ${morphEasing}, ${morphEasing}]`,
} satisfies SystemStyleObject

/**
 * Viewport of a popup whose content follows its trigger (a handle's payload). While they swap,
 * Base UI keeps the old content in [data-previous] and the new in [data-current]; they slide
 * away from the trigger that was left (data-activation-direction). `inset` is the popup's inline
 * padding: the viewport reaches the popup's edges, so content slides out of sight there, and both
 * keep their own width (from --popup-width) while the popup resizes. The flex column and gap
 * carry the popup's own layout through the two wrappers.
 */
export function morphViewport(inset: string) {
  const hiddenLeft = { translate: '[-50% 0]', opacity: 0 } satisfies SystemStyleObject
  const hiddenRight = { translate: '[50% 0]', opacity: 0 } satisfies SystemStyleObject
  return {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    gap: '[inherit]',
    height: 'full',
    marginInline: `[calc(-1 * ${inset})]`,
    paddingInline: `[${inset}]`,
    overflow: '[clip]',
    '& > [data-current], & > [data-previous]': {
      display: 'flex',
      flexDirection: 'column',
      gap: '[inherit]',
      width: `[calc(var(--popup-width) - 2 * ${inset})]`,
      transitionProperty: '[translate, opacity]',
      transitionDuration: '[{durations.slow}, {durations.normal}]',
      transitionTimingFunction: `[${morphEasing}]`,
    },
    '&[data-activation-direction~=right] > [data-previous][data-ending-style]': hiddenLeft,
    '&[data-activation-direction~=right] > [data-current][data-starting-style]': hiddenRight,
    '&[data-activation-direction~=left] > [data-previous][data-ending-style]': hiddenRight,
    '&[data-activation-direction~=left] > [data-current][data-starting-style]': hiddenLeft,
    '&[data-instant] > *': { transitionDuration: '[0s]' },
  } satisfies SystemStyleObject
}

/**
 * Corner for things inside an l3 container with p: '1' (menu rows, enclosed tabs, menubar
 * triggers): both curves share a center at any radius scale. calc() clamps negatives to 0.
 * A raw value: wrap it in [ ] where it is used in a style object.
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
  paddingInline: `[${itemPaddingInline}]`,
  borderRadius: `[${insetRadius}]`,
  cursor: 'default',
  outline: '[0]',
  textAlign: 'start',
  userSelect: 'none',
  _highlighted: { bg: 'gray.surface.bg.hover' },
  _disabled: { layerStyle: 'disabled' },
} satisfies SystemStyleObject

/** Group headings in menus and listboxes, padded like the rows so their text lines up. */
export const groupLabel = {
  display: 'flex',
  alignItems: 'center',
  paddingInline: `[${itemPaddingInline}]`,
  color: 'fg.muted',
  fontWeight: 'medium',
} satisfies SystemStyleObject

/**
 * A dimmed label around a control: the label fades as a whole, and a disabled control inside
 * it drops its own fade so it is not dimmed twice.
 */
export const disabledLabel = {
  layerStyle: 'disabled',
  '& [data-disabled]': { opacity: '1', filter: '[none]' },
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
  outline: '[0]',
  position: 'relative',
  width: 'full',
  minWidth: '0',
  color: 'fg.default',
  transitionProperty: '[background-color, border-color, box-shadow]',
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
    outline: '[1px solid]',
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

/**
 * Rotated square for popup arrows; it inherits the popup background. The popup covers its inner
 * half, so the border draws only the outer edges, continuing the popup's outline (shadows md/lg).
 */
export const arrow = {
  width: '3',
  height: '3',
  bg: '[inherit]',
  borderWidth: '1px',
  borderColor: { base: 'gray.a4', _dark: 'gray.a8' },
  rotate: '[45deg]',
  zIndex: '[-1]',
  '&[data-side=top]': { bottom: '-1.5' },
  '&[data-side=bottom]': { top: '-1.5' },
  '&[data-side=left], &[data-side=inline-start]': { right: '-1.5' },
  '&[data-side=right], &[data-side=inline-end]': { left: '-1.5' },
} satisfies SystemStyleObject

/**
 * Layer under a floating popup (Menu, Popover, Select, Combobox…). Transparent: it blocks the
 * page behind the popup; tint it with className when the popup should dim the page.
 */
export const popupBackdrop = {
  position: 'fixed',
  inset: '0',
  zIndex: 'popover',
  userSelect: 'none',
} satisfies SystemStyleObject

/**
 * Corner × of Dialog, Drawer and Popover: looks like a plain gray square Button (size sm), so it
 * needs no Button import. Recipes place it and may make it smaller.
 */
export const closeTrigger = {
  position: 'absolute',
  top: '3',
  insetInlineEnd: '3',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: '0',
  boxSize: '9',
  borderRadius: 'l2',
  color: 'gray.plain.fg',
  cursor: 'pointer',
  outline: '[0]',
  transitionProperty: '[background-color, color, box-shadow]',
  transitionDuration: 'fast',
  focusVisibleRing: 'outside',
  _hover: { bg: 'gray.plain.bg.hover' },
  _active: { bg: 'gray.plain.bg.active' },
  _disabled: { layerStyle: 'disabled' },
  _icon: { boxSize: '4' },
} satisfies SystemStyleObject
