'use client'
import { Accordion as Base } from '@base-ui/react/accordion'
import { accordion, type AccordionVariantProps } from '../../../styled-system/recipes'
import { createStyleContext, mergeClassName } from './style-context'

const { Provider, withContext } = createStyleContext(accordion)

export function Root<Value>(props: Base.Root.Props<Value> & AccordionVariantProps) {
  const [variants, rest] = accordion.splitVariantProps(props)
  return (
    <Provider {...variants}>
      <Base.Root
        {...rest}
        data-slot="root"
        className={mergeClassName(accordion(variants).root, rest.className)}
      />
    </Provider>
  )
}
export const Item = withContext(Base.Item, 'item')
export const Header = withContext(Base.Header, 'header')
export const Trigger = withContext(Base.Trigger, 'trigger')
export const Panel = withContext(Base.Panel, 'panel')
