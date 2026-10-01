'use client'
import { Menu as Base } from '@base-ui/react/menu'
import { menu, type MenuVariantProps } from '../../../styled-system/recipes'
import { createStyleContext, type ColorPaletteProp } from './style-context'
import { CheckIcon, withIcon } from './icons'

const { Provider: StyleProvider, withContext } = createStyleContext(menu)

export function Root<Payload = unknown>(
  props: Base.Root.Props<Payload> & MenuVariantProps & ColorPaletteProp,
) {
  const [variants, { colorPalette, ...rest }] = menu.splitVariantProps(props)
  return (
    <StyleProvider {...variants} colorPalette={colorPalette}>
      <Base.Root {...rest} />
    </StyleProvider>
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
export const Viewport = withContext(Base.Viewport, 'viewport')
export const Group = Base.Group
export const RadioGroup = Base.RadioGroup
export const SubmenuRoot = Base.SubmenuRoot

export const createHandle = Base.createHandle
export const Handle = Base.Handle
export type Handle<Payload> = Base.Handle<Payload>
