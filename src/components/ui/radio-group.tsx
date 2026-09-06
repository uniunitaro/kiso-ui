'use client'
import { RadioGroup as BaseGroup } from '@base-ui/react/radio-group'
import { Radio as Base } from '@base-ui/react/radio'
import { radioGroup, type RadioGroupVariantProps } from '../../../styled-system/recipes'
import { createStyleContext, mergeClassName } from './style-context'
const { Provider, withContext } = createStyleContext(radioGroup)
export function Root<Value>(props: BaseGroup.Props<Value> & RadioGroupVariantProps) {
  const [variants, rest] = radioGroup.splitVariantProps(props)
  return (
    <Provider {...variants}>
      <BaseGroup
        {...rest}
        data-slot="root"
        className={mergeClassName(radioGroup(variants).root, rest.className)}
      />
    </Provider>
  )
}
export const Item = withContext(Base.Root, 'item')
export const Indicator = withContext(Base.Indicator, 'indicator')
