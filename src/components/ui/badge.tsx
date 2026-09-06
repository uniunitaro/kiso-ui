import type { ComponentPropsWithRef } from 'react'
import { cx } from '../../../styled-system/css'
import { badge, type BadgeVariantProps } from '../../../styled-system/recipes'
export type BadgeProps = ComponentPropsWithRef<'span'> & BadgeVariantProps
export function Badge(props: BadgeProps) {
  const [variants, rest] = badge.splitVariantProps(props)
  return <span {...rest} className={cx(badge(variants), rest.className)} />
}
