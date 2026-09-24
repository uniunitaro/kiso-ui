'use client'
import { Button as BaseButton } from '@base-ui/react/button'
import { button, type ButtonVariantProps } from '../../../styled-system/recipes'
import { css, cx } from '../../../styled-system/css'
import type { SystemStyleObject } from '../../../styled-system/types'
import { mergeClassName } from './style-context'

export type ButtonProps = BaseButton.Props &
  ButtonVariantProps & { colorPalette?: SystemStyleObject['colorPalette'] }
export function Button(props: ButtonProps) {
  const { colorPalette, ...other } = props
  const [variants, rest] = button.splitVariantProps(other)
  return (
    <BaseButton
      {...rest}
      className={mergeClassName(cx(button(variants), css({ colorPalette })), rest.className)}
    />
  )
}
