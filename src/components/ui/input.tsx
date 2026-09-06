'use client'
import { Input as BaseInput } from '@base-ui/react/input'
import { input, type InputVariantProps } from '../../../styled-system/recipes'
import { mergeClassName } from './style-context'

export type InputProps = Omit<BaseInput.Props, 'size'> & InputVariantProps
export function Input(props: InputProps) {
  const [variants, rest] = input.splitVariantProps(props)
  return <BaseInput {...rest} className={mergeClassName(input(variants), rest.className)} />
}
