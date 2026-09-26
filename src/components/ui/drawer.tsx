'use client'
import { Drawer as Base } from '@base-ui/react/drawer'
import { drawer, type DrawerVariantProps } from '../../../styled-system/recipes'
import { createStyleContext, type ColorPaletteProp } from './style-context'
const { Provider: StyleProvider, withContext } = createStyleContext(drawer)
export function Root<Payload = unknown>({
  size,
  colorPalette,
  ...props
}: Base.Root.Props<Payload> & DrawerVariantProps & ColorPaletteProp) {
  return (
    <StyleProvider size={size} colorPalette={colorPalette}>
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
export const CloseTrigger = withContext(Base.Close, 'closeTrigger')
/** Page wrappers under Provider: the page steps back while a drawer is open. */
export const Indent = withContext(Base.Indent, 'indent')
export const IndentBackground = withContext(Base.IndentBackground, 'indentBackground')
export const Header = withContext('div', 'header')
export const Body = withContext('div', 'body')
export const Footer = withContext('div', 'footer')
export const Portal = Base.Portal
export const Trigger = Base.Trigger
export const Provider = Base.Provider
export const SwipeArea = Base.SwipeArea
export const VirtualKeyboardProvider = Base.VirtualKeyboardProvider
export const createHandle = Base.createHandle
export const Handle = Base.Handle
export type Handle<Payload> = Base.Handle<Payload>
