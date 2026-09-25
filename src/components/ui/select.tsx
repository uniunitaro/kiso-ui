'use client'
import { Select as Base } from '@base-ui/react/select'
import { select, type SelectVariantProps } from '../../../styled-system/recipes'
import { createStyleContext, type ColorPaletteProp } from './style-context'
const { Provider, withContext } = createStyleContext(select)

// Keep value inference, including multiple selection; a generic HOC would erase it.
export function Root<Value, Multiple extends boolean | undefined = false>({
  size,
  variant,
  colorPalette,
  ...props
}: Base.Root.Props<Value, Multiple> & SelectVariantProps & ColorPaletteProp) {
  return (
    <Provider size={size} variant={variant} colorPalette={colorPalette}>
      <Base.Root {...props} />
    </Provider>
  )
}
export const Trigger = withContext(Base.Trigger, 'trigger')
export const Value = withContext(Base.Value, 'value')
export const Icon = withContext(Base.Icon, 'icon')
export const Positioner = withContext(Base.Positioner, 'positioner')
export const Popup = withContext(Base.Popup, 'popup')
export const List = withContext(Base.List, 'list')
export const Item = withContext(Base.Item, 'item')
export const ItemText = withContext(Base.ItemText, 'itemText')
export const ItemIndicator = withContext(Base.ItemIndicator, 'itemIndicator')
export const GroupLabel = withContext(Base.GroupLabel, 'groupLabel')
export const Separator = withContext(Base.Separator, 'separator')
export const ScrollUpArrow = withContext(Base.ScrollUpArrow, 'scrollUpArrow')
export const ScrollDownArrow = withContext(Base.ScrollDownArrow, 'scrollDownArrow')
export const Group = Base.Group
export const Portal = Base.Portal
