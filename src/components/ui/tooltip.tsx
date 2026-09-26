'use client'
import { Tooltip as Base } from '@base-ui/react/tooltip'
import { tooltip, type TooltipVariantProps } from '../../../styled-system/recipes'
import { createStyleContext, type ColorPaletteProp } from './style-context'

const { Provider: StyleProvider, withContext } = createStyleContext(tooltip)

export function Root<Payload = unknown>(
  props: Base.Root.Props<Payload> & TooltipVariantProps & ColorPaletteProp,
) {
  const [variants, { colorPalette, ...rest }] = tooltip.splitVariantProps(props)
  return (
    <StyleProvider {...variants} colorPalette={colorPalette}>
      <Base.Root {...rest} />
    </StyleProvider>
  )
}
export const Positioner = withContext(Base.Positioner, 'positioner')
export const Popup = withContext(Base.Popup, 'popup')
export const Arrow = withContext(Base.Arrow, 'arrow')
export const Trigger = Base.Trigger
export const Portal = Base.Portal
export const Provider = Base.Provider
export const Viewport = Base.Viewport

export const createHandle = Base.createHandle
export const Handle = Base.Handle
export type Handle<Payload> = Base.Handle<Payload>
