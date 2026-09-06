'use client'
import type { ComponentPropsWithRef } from 'react'
import { table } from '../../../styled-system/recipes'
import { createStyleContext } from './style-context'
const { withProvider, withContext } = createStyleContext(table)
export const Root = withProvider('table', 'root')
const StyledContainer = withContext('div', 'container')
export function Container(props: ComponentPropsWithRef<'div'>) {
  return <StyledContainer role="region" aria-label="Scrollable table" tabIndex={0} {...props} />
}
export const Header = withContext('thead', 'header')
export const Body = withContext('tbody', 'body')
export const Footer = withContext('tfoot', 'footer')
export const Row = withContext('tr', 'row')
const StyledHead = withContext('th', 'head')
export function Head(props: ComponentPropsWithRef<'th'>) {
  return <StyledHead scope="col" {...props} />
}
export const Cell = withContext('td', 'cell')
export const Caption = withContext('caption', 'caption')
