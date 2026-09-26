'use client'
import { Autocomplete as Base } from '@base-ui/react/autocomplete'
import { combobox, type ComboboxVariantProps } from '../../../styled-system/recipes'
import { createStyleContext, type ColorPaletteProp } from './style-context'
import { ChevronDownIcon, XIcon, withIcon } from './icons'
const { Provider, withContext } = createStyleContext(combobox)
// The upstream overloads separate flat/grouped items; their shared Props handles either.
const BaseRoot = Base.Root as <ItemValue>(props: Base.Root.Props<ItemValue>) => React.JSX.Element

export function Root<ItemValue>({
  size,
  variant,
  colorPalette,
  ...props
}: Base.Root.Props<ItemValue> & ComboboxVariantProps & ColorPaletteProp) {
  return (
    <Provider size={size} variant={variant} colorPalette={colorPalette}>
      <BaseRoot {...props} />
    </Provider>
  )
}
export const Input = withContext(Base.Input, 'input')
export const InputGroup = withContext(Base.InputGroup, 'inputGroup')
export const Positioner = withContext(Base.Positioner, 'positioner')
export const Popup = withContext(Base.Popup, 'popup')
export const List = withContext(Base.List, 'list')
export const Item = withContext(Base.Item, 'item')
export const Empty = withContext(Base.Empty, 'empty')
export const Clear = withIcon(withContext(Base.Clear, 'clear'), <XIcon />)
export const Trigger = withIcon(withContext(Base.Trigger, 'trigger'), <ChevronDownIcon />)
export const GroupLabel = withContext(Base.GroupLabel, 'groupLabel')
export const Portal = Base.Portal
export const Group = Base.Group
export const Collection = Base.Collection
export const Status = Base.Status
export const useFilter = Base.useFilter
