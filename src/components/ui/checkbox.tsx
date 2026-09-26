'use client'
import { Checkbox as Base } from '@base-ui/react/checkbox'
import { checkbox } from '../../../styled-system/recipes'
import { Svg, withIcon } from './icons'
import { createStyleContext } from './style-context'

const { withProvider, withContext } = createStyleContext(checkbox)

export const Root = withProvider(Base.Root, 'root')
/** Both marks are drawn; the recipe shows the minus while data-indeterminate is set. */
export const Indicator = withIcon(
  withContext(Base.Indicator, 'indicator'),
  <Svg>
    <path data-mark="check" d="M20 6L9 17l-5-5" />
    <path data-mark="indeterminate" d="M5 12h14" />
  </Svg>,
)
/** Wraps Root and its text. Its size and variant reach Root; it dims with a disabled Root. */
export const Label = withProvider('label', 'label')
