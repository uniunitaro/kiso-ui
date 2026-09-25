'use client'
import { Button as BaseButton } from '@base-ui/react/button'
import { cx } from '../../../styled-system/css'
import { button, type ButtonVariantProps } from '../../../styled-system/recipes'
import { mergeClassName, paletteClass, type ColorPaletteProp } from './style-context'

export type ButtonProps = BaseButton.Props & ButtonVariantProps & ColorPaletteProp
export function Button(props: ButtonProps) {
  const [variants, { colorPalette, ...rest }] = button.splitVariantProps(props)
  return (
    <BaseButton
      {...rest}
      className={mergeClassName(cx(button(variants), paletteClass(colorPalette)), rest.className)}
    />
  )
}
