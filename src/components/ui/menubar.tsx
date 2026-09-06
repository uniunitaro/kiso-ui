'use client'
import { Menubar as Base } from '@base-ui/react/menubar'
import { menubar } from '../../../styled-system/recipes'

import { mergeClassName } from './style-context'
export function Menubar(props: Base.Props) {
  return <Base {...props} className={mergeClassName(menubar(), props.className)} />
}
