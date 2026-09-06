'use client'
import { PreviewCard as Base } from '@base-ui/react/preview-card'
import { popover, type PopoverVariantProps } from '../../../styled-system/recipes'
import { createStyleContext } from './style-context'
const { Provider, withContext } = createStyleContext(popover)
export function Root<Payload = unknown>({
  size,
  ...props
}: Base.Root.Props<Payload> & PopoverVariantProps) {
  return (
    <Provider size={size}>
      <Base.Root {...props} />
    </Provider>
  )
}
export const Popup = withContext(Base.Popup, 'popup')
export const Positioner = withContext(Base.Positioner, 'positioner')
export const Arrow = withContext(Base.Arrow, 'arrow')
export const Trigger = Base.Trigger
export const Portal = Base.Portal
export const Viewport = Base.Viewport
export const createHandle = Base.createHandle
