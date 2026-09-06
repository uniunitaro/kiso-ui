import type { ComponentPropsWithRef } from 'react'
import { css, cx } from '../../../styled-system/css'
import { spinner, type SpinnerVariantProps } from '../../../styled-system/recipes'
export type SpinnerProps = ComponentPropsWithRef<'span'> & SpinnerVariantProps & { label?: string }
export function Spinner({ size, label = 'Loading', className, ...props }: SpinnerProps) {
  return (
    <span role="status" {...props} className={cx(spinner({ size }), className)}>
      <span aria-hidden="true" data-spinner="" />
      <span className={css({ srOnly: true })}>{label}</span>
    </span>
  )
}
