import type { ComponentPropsWithRef } from 'react'
import { cx } from '../../../styled-system/css'
import { skeleton, type SkeletonVariantProps } from '../../../styled-system/recipes'

export type SkeletonProps = ComponentPropsWithRef<'div'> & SkeletonVariantProps
export function Skeleton(props: SkeletonProps) {
  const [variants, rest] = skeleton.splitVariantProps(props)
  return <div aria-hidden="true" {...rest} className={cx(skeleton(variants), rest.className)} />
}
