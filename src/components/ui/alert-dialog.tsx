'use client'
import { AlertDialog as Base } from '@base-ui/react/alert-dialog'
import { dialog, type DialogVariantProps } from '../../../styled-system/recipes'
import { createStyleContext } from './style-context'

const { Provider: StyleProvider, withContext } = createStyleContext(dialog)

export function Root<Payload = unknown>(props: Base.Root.Props<Payload> & DialogVariantProps) {
  const [variants, rest] = dialog.splitVariantProps(props)
  return (
    <StyleProvider {...variants}>
      <Base.Root {...rest} />
    </StyleProvider>
  )
}
export const Backdrop = withContext(Base.Backdrop, 'backdrop')
export const Popup = withContext(Base.Popup, 'popup')
export const Title = withContext(Base.Title, 'title')
export const Description = withContext(Base.Description, 'description')
export const Close = withContext(Base.Close, 'close')
export const Trigger = Base.Trigger
export const Portal = Base.Portal
export const Viewport = Base.Viewport

export const createHandle = Base.createHandle
