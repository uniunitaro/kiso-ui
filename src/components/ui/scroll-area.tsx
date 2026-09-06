'use client'
import { ScrollArea as Base } from '@base-ui/react/scroll-area'
import { scrollArea } from '../../../styled-system/recipes'
import { createStyleContext } from './style-context'
const { withProvider, withContext } = createStyleContext(scrollArea)
export const Root = withProvider(Base.Root, 'root')
export const Viewport = withContext(Base.Viewport, 'viewport')
export const Content = withContext(Base.Content, 'content')
export const Scrollbar = withContext(Base.Scrollbar, 'scrollbar')
export const Thumb = withContext(Base.Thumb, 'thumb')
export const Corner = withContext(Base.Corner, 'corner')
