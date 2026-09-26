'use client'
import { Checkbox as Base } from '@base-ui/react/checkbox'
import { checkbox } from '../../../styled-system/recipes'
import { createStyleContext } from './style-context'

const { withProvider, withContext } = createStyleContext(checkbox)

export const Root = withProvider(Base.Root, 'root')
export const Indicator = withContext(Base.Indicator, 'indicator')
/** Wraps Root and its text. Its size and variant reach Root; it dims with a disabled Root. */
export const Label = withProvider('label', 'label')
