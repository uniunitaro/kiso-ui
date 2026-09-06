'use client'
import { Fieldset as Base } from '@base-ui/react/fieldset'
import { fieldset } from '../../../styled-system/recipes'
import { createStyleContext } from './style-context'
const { withProvider, withContext } = createStyleContext(fieldset)
export const Root = withProvider(Base.Root, 'root')
export const Legend = withContext(Base.Legend, 'legend')
