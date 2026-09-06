'use client'
import { CheckboxGroup as Base } from '@base-ui/react/checkbox-group'
import { checkboxGroup } from '../../../styled-system/recipes'

import { mergeClassName } from './style-context'
export function CheckboxGroup(props: Base.Props) {
  return <Base {...props} className={mergeClassName(checkboxGroup(), props.className)} />
}
