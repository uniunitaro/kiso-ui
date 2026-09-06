import type { ComponentPropsWithRef } from 'react'
import { skeleton } from '../../../styled-system/recipes'
import { cx } from '../../../styled-system/css'
export function Skeleton(props: ComponentPropsWithRef<'div'>) {
  return <div aria-hidden="true" {...props} className={cx(skeleton(), props.className)} />
}
