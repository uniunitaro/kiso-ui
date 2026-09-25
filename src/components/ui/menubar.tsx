'use client'
import { Menubar as Base } from '@base-ui/react/menubar'
import { menubar, type MenubarVariantProps } from '../../../styled-system/recipes'
import { mergeClassName } from './style-context'

export type MenubarProps = Base.Props & MenubarVariantProps
export function Menubar(props: MenubarProps) {
  const [variants, rest] = menubar.splitVariantProps(props)
  return <Base {...rest} className={mergeClassName(menubar(variants), rest.className)} />
}
