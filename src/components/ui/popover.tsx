'use client'
import { Popover as Base } from '@base-ui/react/popover'
import { popover, type PopoverVariantProps } from '../../../styled-system/recipes'
import { createStyleContext, type ColorPaletteProp } from './style-context'
import { XIcon, withIcon } from './icons'

const { Provider: StyleProvider, withContext } = createStyleContext(popover)

export function Root<Payload = unknown>(
  props: Base.Root.Props<Payload> & PopoverVariantProps & ColorPaletteProp,
) {
  const [variants, { colorPalette, ...rest }] = popover.splitVariantProps(props)
  return (
    <StyleProvider {...variants} colorPalette={colorPalette}>
      <Base.Root {...rest} />
    </StyleProvider>
  )
}
export const Backdrop = withContext(Base.Backdrop, 'backdrop')
export const Positioner = withContext(Base.Positioner, 'positioner')
export const Popup = withContext(Base.Popup, 'popup')
export const Title = withContext(Base.Title, 'title')
export const Description = withContext(Base.Description, 'description')
export const Arrow = withContext(Base.Arrow, 'arrow')
export const Close = withContext(Base.Close, 'close')
/** Corner close button: draws × and is named Close until children or aria-label replace them. */
export const CloseTrigger = withIcon(withContext(Base.Close, 'closeTrigger'), <XIcon />, 'Close')
export const Trigger = Base.Trigger
export const Portal = Base.Portal
export const Viewport = Base.Viewport

export const createHandle = Base.createHandle
export const Handle = Base.Handle
export type Handle<Payload> = Base.Handle<Payload>
