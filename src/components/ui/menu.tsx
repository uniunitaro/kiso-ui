'use client'
import { Menu as Base } from '@base-ui/react/menu'
import { menu, type MenuVariantProps } from '../../../styled-system/recipes'
import { createStyleContext } from './style-context'

const { Provider: StyleProvider, withContext } = createStyleContext(menu)

export function Root<Payload = unknown>(props: Base.Root.Props<Payload> & MenuVariantProps) {
  const [variants, rest] = menu.splitVariantProps(props)
  return (
    <StyleProvider {...variants}>
      <Base.Root {...rest} />
    </StyleProvider>
  )
}
export const Positioner = withContext(Base.Positioner, 'positioner')
export const Popup = withContext(Base.Popup, 'popup')
export const Item = withContext(Base.Item, 'item')
export const GroupLabel = withContext(Base.GroupLabel, 'groupLabel')
export const Separator = withContext(Base.Separator, 'separator')
export const CheckboxItem = withContext(Base.CheckboxItem, 'checkboxItem')
export const CheckboxItemIndicator = withContext(
  Base.CheckboxItemIndicator,
  'checkboxItemIndicator',
)
export const RadioItem = withContext(Base.RadioItem, 'radioItem')
export const RadioItemIndicator = withContext(Base.RadioItemIndicator, 'radioItemIndicator')
export const SubmenuTrigger = withContext(Base.SubmenuTrigger, 'submenuTrigger')
export const Arrow = withContext(Base.Arrow, 'arrow')
export const Trigger = Base.Trigger
export const Portal = Base.Portal
export const Group = Base.Group
export const RadioGroup = Base.RadioGroup
export const SubmenuRoot = Base.SubmenuRoot

export const createHandle = Base.createHandle
