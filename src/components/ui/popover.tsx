'use client'
import { Popover as Base } from '@base-ui/react/popover'
import { popover, type PopoverVariantProps } from '../../../styled-system/recipes'
import { createStyleContext } from './style-context'

const { Provider: StyleProvider, withContext } = createStyleContext(popover)

export function Root<Payload = unknown>(props: Base.Root.Props<Payload> & PopoverVariantProps) {
  const [variants, rest] = popover.splitVariantProps(props)
  return (
    <StyleProvider {...variants}>
      <Base.Root {...rest} />
    </StyleProvider>
  )
}
export const Positioner = withContext(Base.Positioner, 'positioner')
export const Popup = withContext(Base.Popup, 'popup')
export const Title = withContext(Base.Title, 'title')
export const Description = withContext(Base.Description, 'description')
export const Arrow = withContext(Base.Arrow, 'arrow')
export const Close = withContext(Base.Close, 'close')
export const Trigger = Base.Trigger
export const Portal = Base.Portal

export const createHandle = Base.createHandle
