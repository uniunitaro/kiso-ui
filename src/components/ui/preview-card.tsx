'use client'
import { PreviewCard as Base } from '@base-ui/react/preview-card'
import { popover, type PopoverVariantProps } from '../../../styled-system/recipes'
import { createStyleContext, type ColorPaletteProp } from './style-context'
const { Provider, withContext } = createStyleContext(popover)
export function Root<Payload = unknown>({
  size,
  colorPalette,
  ...props
}: Base.Root.Props<Payload> & PopoverVariantProps & ColorPaletteProp) {
  return (
    <Provider size={size} colorPalette={colorPalette}>
      <Base.Root {...props} />
    </Provider>
  )
}
export const Backdrop = withContext(Base.Backdrop, 'backdrop')
export const Popup = withContext(Base.Popup, 'popup')
export const Positioner = withContext(Base.Positioner, 'positioner')
export const Arrow = withContext(Base.Arrow, 'arrow')
export const Trigger = Base.Trigger
export const Portal = Base.Portal
export const Viewport = Base.Viewport
export const createHandle = Base.createHandle
export const Handle = Base.Handle
export type Handle<Payload> = Base.Handle<Payload>
