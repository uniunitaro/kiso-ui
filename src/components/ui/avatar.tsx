'use client'
import { Avatar as Base } from '@base-ui/react/avatar'
import { avatar } from '../../../styled-system/recipes'
import { createStyleContext } from './style-context'

const { withProvider, withContext } = createStyleContext(avatar)

export const Root = withProvider(Base.Root, 'root')
export const Image = withContext(Base.Image, 'image')
export const Fallback = withContext(Base.Fallback, 'fallback')
