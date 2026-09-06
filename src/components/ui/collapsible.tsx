'use client'
import { Collapsible as Base } from '@base-ui/react/collapsible'
import { collapsible } from '../../../styled-system/recipes'
import { createStyleContext } from './style-context'
const { withProvider, withContext } = createStyleContext(collapsible)
export const Root = withProvider(Base.Root, 'root')
export const Trigger = withContext(Base.Trigger, 'trigger')
export const Panel = withContext(Base.Panel, 'panel')
