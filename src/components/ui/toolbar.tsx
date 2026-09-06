'use client'
import { Toolbar as Base } from '@base-ui/react/toolbar'
import { toolbar } from '../../../styled-system/recipes'
import { createStyleContext } from './style-context'
const { withProvider, withContext } = createStyleContext(toolbar)
export const Root = withProvider(Base.Root, 'root')
export const Group = withContext(Base.Group, 'group')
export const Button = withContext(Base.Button, 'button')
export const Link = withContext(Base.Link, 'link')
export const Input = withContext(Base.Input, 'input')
export const Separator = withContext(Base.Separator, 'separator')
