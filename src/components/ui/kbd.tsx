import type { ComponentPropsWithRef } from 'react'
import { kbd } from '../../../styled-system/recipes'
import { cx } from '../../../styled-system/css'
export function Kbd(props: ComponentPropsWithRef<'kbd'>) {
  return <kbd {...props} className={cx(kbd(), props.className)} />
}
