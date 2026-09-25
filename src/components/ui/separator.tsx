'use client'
import { Separator as Base } from '@base-ui/react/separator'
import { separator, type SeparatorVariantProps } from '../../../styled-system/recipes'
import { mergeClassName } from './style-context'

export type SeparatorProps = Base.Props & SeparatorVariantProps
export function Separator(props: SeparatorProps) {
  const [variants, rest] = separator.splitVariantProps(props)
  return <Base {...rest} className={mergeClassName(separator(variants), rest.className)} />
}
