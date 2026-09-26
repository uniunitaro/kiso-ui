'use client'
import { Accordion as Base } from '@base-ui/react/accordion'
import { accordion, type AccordionVariantProps } from '../../../styled-system/recipes'
import { cx } from '../../../styled-system/css'
import {
  createStyleContext,
  mergeClassName,
  paletteClass,
  type ColorPaletteProp,
} from './style-context'
import { ChevronDownIcon, withIcon } from './icons'

const { Provider, withContext } = createStyleContext(accordion)

export function Root<Value>(
  props: Base.Root.Props<Value> & AccordionVariantProps & ColorPaletteProp,
) {
  const [variants, { colorPalette, ...rest }] = accordion.splitVariantProps(props)
  return (
    <Provider {...variants}>
      <Base.Root
        {...rest}
        data-slot="root"
        className={mergeClassName(
          cx(accordion(variants).root, paletteClass(colorPalette)),
          rest.className,
        )}
      />
    </Provider>
  )
}
export const Item = withContext(Base.Item, 'item')
export const Header = withContext(Base.Header, 'header')
export const Trigger = withContext(Base.Trigger, 'trigger')
/** Put it last in Trigger: a chevron that turns while the panel is open; children replace it. */
export const Indicator = withIcon(withContext('span', 'indicator'), <ChevronDownIcon />)
export const Panel = withContext(Base.Panel, 'panel')
