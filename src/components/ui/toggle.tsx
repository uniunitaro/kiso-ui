'use client'
import { Toggle as BaseToggle } from '@base-ui/react/toggle'
import { toggle, type ToggleVariantProps } from '../../../styled-system/recipes'
import { mergeClassName } from './style-context'
export type ToggleProps = BaseToggle.Props & ToggleVariantProps
export function Toggle(props: ToggleProps) {
  const [variants, rest] = toggle.splitVariantProps(props)
  return <BaseToggle {...rest} className={mergeClassName(toggle(variants), rest.className)} />
}
export { ToggleGroup } from '@base-ui/react/toggle-group'
