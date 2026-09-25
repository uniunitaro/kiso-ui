'use client'
import type { ComponentProps } from 'react'
import { breadcrumb } from '../../../styled-system/recipes'
import { createStyleContext } from './style-context'
const { withProvider, withContext } = createStyleContext(breadcrumb)

const StyledRoot = withProvider('nav', 'root')
export function Root(props: ComponentProps<typeof StyledRoot>) {
  return <StyledRoot aria-label="Breadcrumb" {...props} />
}
export const List = withContext('ol', 'list')
export const Item = withContext('li', 'item')
export const Link = withContext('a', 'link')
const StyledCurrent = withContext('span', 'current')
export function Current(props: ComponentProps<typeof StyledCurrent>) {
  return <StyledCurrent aria-current="page" {...props} />
}
const StyledSeparator = withContext('li', 'separator')
export function Separator({ children = '/', ...props }: ComponentProps<typeof StyledSeparator>) {
  return (
    <StyledSeparator aria-hidden="true" {...props}>
      {children}
    </StyledSeparator>
  )
}
