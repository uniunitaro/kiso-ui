import type { ComponentPropsWithRef } from 'react'
import { cx } from '../../../styled-system/css'
import { buttonGroup, type ButtonGroupVariantProps } from '../../../styled-system/recipes'
export type ButtonGroupProps = ComponentPropsWithRef<'div'> & ButtonGroupVariantProps
export function ButtonGroup(props: ButtonGroupProps) {
  const [variants, rest] = buttonGroup.splitVariantProps(props)
  return <div role="group" {...rest} className={cx(buttonGroup(variants), rest.className)} />
}
