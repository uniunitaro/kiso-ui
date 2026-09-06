'use client'
import { Separator as Base } from '@base-ui/react/separator'
import { separator } from '../../../styled-system/recipes'

import { mergeClassName } from './style-context'
export function Separator(props: Base.Props) {
  return <Base {...props} className={mergeClassName(separator(), props.className)} />
}
