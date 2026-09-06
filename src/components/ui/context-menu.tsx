'use client'
import { ContextMenu as Base } from '@base-ui/react/context-menu'
import { menu } from '../../../styled-system/recipes'
import { createStyleContext } from './style-context'
const { withProvider, withContext } = createStyleContext(menu)
export const Root = withProvider(Base.Root)
export const Positioner = withContext(Base.Positioner, 'positioner')
export const Popup = withContext(Base.Popup, 'popup')
export const Item = withContext(Base.Item, 'item')
export const LinkItem = withContext(Base.LinkItem, 'item')
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
export const Trigger = Base.Trigger
export const Portal = Base.Portal
export const Group = Base.Group
export const RadioGroup = Base.RadioGroup
export const SubmenuRoot = Base.SubmenuRoot
