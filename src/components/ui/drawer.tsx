'use client'
import { Drawer as Base } from '@base-ui/react/drawer'
import { drawer, type DrawerVariantProps } from '../../../styled-system/recipes'
import { createStyleContext } from './style-context'
const { Provider: StyleProvider, withContext } = createStyleContext(drawer)
export function Root<Payload = unknown>({
  size,
  ...props
}: Base.Root.Props<Payload> & DrawerVariantProps) {
  return (
    <StyleProvider size={size}>
      <Base.Root {...props} />
    </StyleProvider>
  )
}
export const Popup = withContext(Base.Popup, 'popup')
export const Backdrop = withContext(Base.Backdrop, 'backdrop')
export const Viewport = withContext(Base.Viewport, 'viewport')
export const Content = withContext(Base.Content, 'content')
export const Title = withContext(Base.Title, 'title')
export const Description = withContext(Base.Description, 'description')
export const Close = withContext(Base.Close, 'close')
export const Portal = Base.Portal
export const Trigger = Base.Trigger
export const Provider = Base.Provider
export const SwipeArea = Base.SwipeArea
export const createHandle = Base.createHandle
