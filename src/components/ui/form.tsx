'use client'
import { Form as Base } from '@base-ui/react/form'
import { form } from '../../../styled-system/recipes'

import { mergeClassName } from './style-context'
export function Form(props: Base.Props) {
  return <Base {...props} className={mergeClassName(form(), props.className)} />
}
