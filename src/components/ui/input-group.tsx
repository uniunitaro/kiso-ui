'use client'
import { inputGroup } from '../../../styled-system/recipes'
import { createStyleContext } from './style-context'
const { withProvider, withContext } = createStyleContext(inputGroup)
/** Wraps one Input with Elements (inside it) and Addons (attached beside it). */
export const Root = withProvider('div', 'root')
/** An icon or a small button inside the Input: at the start before it, at the end after it. */
export const Element = withContext('div', 'element')
/** Text attached before or after the Input, such as https:// or .com. */
export const Addon = withContext('div', 'addon')
