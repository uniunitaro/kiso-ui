import type { ComponentPropsWithRef } from 'react'
import { cx } from '../../../styled-system/css'
import { breadcrumb } from '../../../styled-system/recipes'
export function Root(props: ComponentPropsWithRef<'nav'>) {
  return (
    <nav aria-label="Breadcrumb" {...props} className={cx(breadcrumb().root, props.className)} />
  )
}
export function List(props: ComponentPropsWithRef<'ol'>) {
  return <ol {...props} className={cx(breadcrumb().list, props.className)} />
}
export function Item(props: ComponentPropsWithRef<'li'>) {
  return <li {...props} className={cx(breadcrumb().item, props.className)} />
}
export function Link(props: ComponentPropsWithRef<'a'>) {
  return <a {...props} className={cx(breadcrumb().link, props.className)} />
}
export function Current(props: ComponentPropsWithRef<'span'>) {
  return (
    <span aria-current="page" {...props} className={cx(breadcrumb().current, props.className)} />
  )
}
export function Separator({ children = '/', ...props }: ComponentPropsWithRef<'li'>) {
  return (
    <li aria-hidden="true" {...props} className={cx(breadcrumb().separator, props.className)}>
      {children}
    </li>
  )
}
