'use client'
import { Button as BaseButton } from '@base-ui/react/button'
import { button, type ButtonVariantProps } from '../../../styled-system/recipes'
import { mergeClassName } from './style-context'

export type ButtonProps = BaseButton.Props & ButtonVariantProps
export function Button(props: ButtonProps) {
  const [variants, rest] = button.splitVariantProps(props)
  return <BaseButton {...rest} className={mergeClassName(button(variants), rest.className)} />
}
