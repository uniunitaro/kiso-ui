'use client'
import { Slider as Base } from '@base-ui/react/slider'
import { slider, type SliderVariantProps } from '../../../styled-system/recipes'
import { createStyleContext, mergeClassName } from './style-context'

const { Provider, withContext } = createStyleContext(slider)

export function Root<Value extends number | readonly number[]>(
  props: Base.Root.Props<Value> & SliderVariantProps & { ref?: React.Ref<HTMLDivElement> },
) {
  const [variants, rest] = slider.splitVariantProps(props)
  return (
    <Provider {...variants}>
      <Base.Root
        {...rest}
        data-slot="root"
        className={mergeClassName(slider(variants).root, rest.className)}
      />
    </Provider>
  )
}
export const Label = withContext(Base.Label, 'label')
export const Value = withContext(Base.Value, 'value')
export const Control = withContext(Base.Control, 'control')
export const Track = withContext(Base.Track, 'track')
export const Indicator = withContext(Base.Indicator, 'indicator')
export const Thumb = withContext(Base.Thumb, 'thumb')
