'use client'
import { Combobox as Base } from '@base-ui/react/combobox'
import { combobox, type ComboboxVariantProps } from '../../../styled-system/recipes'
import { createStyleContext, type ColorPaletteProp } from './style-context'
import { CheckIcon, ChevronDownIcon, XIcon, withIcon } from './icons'
const { Provider, withContext } = createStyleContext(combobox)

export function Root<Value, Multiple extends boolean | undefined = false, Item = Value>({
  size,
  variant,
  colorPalette,
  ...props
}: Base.Root.Props<Value, Multiple, Item> & ComboboxVariantProps & ColorPaletteProp) {
  return (
    <Provider size={size} variant={variant} colorPalette={colorPalette}>
      <Base.Root {...props} />
    </Provider>
  )
}
export const InputGroup = withContext(Base.InputGroup, 'inputGroup')
export const Input = withContext(Base.Input, 'input')
export const Trigger = withIcon(withContext(Base.Trigger, 'trigger'), <ChevronDownIcon />)
export const Clear = withIcon(withContext(Base.Clear, 'clear'), <XIcon />)
export const Icon = withIcon(withContext(Base.Icon, 'icon'), <ChevronDownIcon />)
export const Backdrop = withContext(Base.Backdrop, 'backdrop')
export const Positioner = withContext(Base.Positioner, 'positioner')
export const Popup = withContext(Base.Popup, 'popup')
export const Arrow = withContext(Base.Arrow, 'arrow')
export const List = withContext(Base.List, 'list')
export const Item = withContext(Base.Item, 'item')
export const Row = withContext(Base.Row, 'row')
export const ItemIndicator = withIcon(
  withContext(Base.ItemIndicator, 'itemIndicator'),
  <CheckIcon />,
)
export const GroupLabel = withContext(Base.GroupLabel, 'groupLabel')
export const Label = withContext(Base.Label, 'label')
export const Empty = withContext(Base.Empty, 'empty')
export const Chips = withContext(Base.Chips, 'chips')
export const Chip = withContext(Base.Chip, 'chip')
export const ChipRemove = withIcon(withContext(Base.ChipRemove, 'chipRemove'), <XIcon />)
export const Separator = withContext(Base.Separator, 'separator')
export const Portal = Base.Portal
export const Value = Base.Value
export const Collection = Base.Collection
export const Group = Base.Group
export const Status = Base.Status
export const useFilter = Base.useFilter
export const useFilteredItems = Base.useFilteredItems
export const createItems = Base.createItems
