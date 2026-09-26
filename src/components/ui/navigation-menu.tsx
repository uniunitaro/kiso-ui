'use client'
import { NavigationMenu as Base } from '@base-ui/react/navigation-menu'
import { navigationMenu } from '../../../styled-system/recipes'
import { createStyleContext } from './style-context'
import { ChevronDownIcon, withIcon } from './icons'
const { withProvider, withContext } = createStyleContext(navigationMenu)
export const Root = withProvider(Base.Root, 'root')
export const List = withContext(Base.List, 'list')
export const Item = withContext(Base.Item, 'item')
export const Trigger = withContext(Base.Trigger, 'trigger')
export const Icon = withIcon(withContext(Base.Icon, 'icon'), <ChevronDownIcon />)
export const Content = withContext(Base.Content, 'content')
export const Positioner = withContext(Base.Positioner, 'positioner')
export const Popup = withContext(Base.Popup, 'popup')
export const Viewport = withContext(Base.Viewport, 'viewport')
export const Link = withContext(Base.Link, 'link')
export const Arrow = withContext(Base.Arrow, 'arrow')
export const Backdrop = withContext(Base.Backdrop, 'backdrop')
export const Portal = Base.Portal
