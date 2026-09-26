'use client'
import { ContextMenu as Base } from '@base-ui/react/context-menu'
import { menu, type MenuVariantProps } from '../../../styled-system/recipes'
import { createStyleContext, type ColorPaletteProp } from './style-context'
import { CheckIcon, withIcon } from './icons'
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
export const SubmenuTrigger = withContext(Base.SubmenuTrigger, 'submenuTrigger')
export const Arrow = withContext(Base.Arrow, 'arrow')
export const Trigger = Base.Trigger
export const Portal = Base.Portal
export const Group = Base.Group
export const RadioGroup = Base.RadioGroup
export const SubmenuRoot = Base.SubmenuRoot
