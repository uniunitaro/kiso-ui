import type { SystemStyleObject } from '../../styled-system/types'

export const focusRing = {
  _focusVisible: { outline: '2px solid', outlineColor: 'accent', outlineOffset: '3px' },
} satisfies SystemStyleObject

export const disabled = {
  _disabled: { opacity: 0.45, cursor: 'not-allowed' },
} satisfies SystemStyleObject

export const control = {
  borderRadius: 'l2',
  transition: 'background 120ms, border-color 120ms, box-shadow 120ms',
  ...focusRing,
  ...disabled,
} satisfies SystemStyleObject

export const popup = {
  bg: 'surface.raised',
  color: 'fg',
  border: '1px solid',
  borderColor: 'border',
  borderRadius: 'l3',
  boxShadow: 'lg',
  p: '1',
  zIndex: 'popover',
  outline: 'none',
  transformOrigin: 'var(--transform-origin)',
  transition: 'opacity 150ms, transform 150ms',
  _startingStyle: { opacity: 0, transform: 'scale(.97) translateY(-3px)' },
  _endingStyle: { opacity: 0, transform: 'scale(.97)' },
} satisfies SystemStyleObject

export const item = {
  display: 'flex',
  alignItems: 'center',
  gap: '2',
  px: '3',
  py: '2',
  fontSize: 'sm',
  borderRadius: 'l2',
  cursor: 'default',
  outline: 'none',
  _highlighted: { bg: 'accent.subtle', color: 'accent.fg' },
  ...disabled,
} satisfies SystemStyleObject
