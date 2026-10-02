'use client'
import type { ComponentProps, ReactNode } from 'react'
import { ContextMenu as Base } from '@base-ui/react/context-menu'
import { menu, type MenuVariantProps } from '../../../styled-system/recipes'
import { createStyleContext, type ColorPaletteProp } from './style-context'
import { CheckIcon, ChevronRightIcon, withIcon } from './icons'
const { Provider, withContext } = createStyleContext(menu)
export function Root({
  size,
  colorPalette,
  ...props
}: Base.Root.Props & MenuVariantProps & ColorPaletteProp) {
  return (
    <Provider size={size} colorPalette={colorPalette}>
      <Base.Root {...props} />
    </Provider>
  )
}
export const Backdrop = withContext(Base.Backdrop, 'backdrop')
export const Positioner = withContext(Base.Positioner, 'positioner')
export const Popup = withContext(Base.Popup, 'popup')
export const Item = withContext(Base.Item, 'item')
export const LinkItem = withContext(Base.LinkItem, 'item')
export const GroupLabel = withContext(Base.GroupLabel, 'groupLabel')
export const Separator = withContext(Base.Separator, 'separator')
export const CheckboxItem = withContext(Base.CheckboxItem, 'checkboxItem')
export const CheckboxItemIndicator = withIcon(
  withContext(Base.CheckboxItemIndicator, 'checkboxItemIndicator'),
  <CheckIcon />,
)
export const RadioItem = withContext(Base.RadioItem, 'radioItem')
export const RadioItemIndicator = withIcon(
  withContext(Base.RadioItemIndicator, 'radioItemIndicator'),
  <CheckIcon />,
)
const StyledSubmenuTrigger = withContext(Base.SubmenuTrigger, 'submenuTrigger')
const SubmenuTriggerIndicator = withContext('span', 'submenuTriggerIndicator')
/**
 * Item that opens the submenu of its SubmenuRoot. Ends with an arrow (flipped in RTL); pass
 * indicator to draw something else, or null to leave it out.
 */
export function SubmenuTrigger({
  children,
  indicator = <ChevronRightIcon />,
  ...props
}: ComponentProps<typeof StyledSubmenuTrigger> & { indicator?: ReactNode }) {
  return (
    <StyledSubmenuTrigger {...props}>
      {children}
      {indicator != null && (
        <SubmenuTriggerIndicator aria-hidden="true">{indicator}</SubmenuTriggerIndicator>
      )}
    </StyledSubmenuTrigger>
  )
}
export const Arrow = withContext(Base.Arrow, 'arrow')
export const Trigger = Base.Trigger
export const Portal = Base.Portal
export const Group = Base.Group
export const RadioGroup = Base.RadioGroup
export const SubmenuRoot = Base.SubmenuRoot

/**
 * sideOffset and alignOffset for the Positioner of a submenu: beside the menu it overlaps it a
 * little and lines its first item up with the trigger (the popup has 4px of padding); above or
 * below, where it goes when the side has no room, it keeps 4px away.
 */
export function submenuOffset({ side }: { side: string }) {
  return side === 'top' || side === 'bottom' ? 4 : -4
}
