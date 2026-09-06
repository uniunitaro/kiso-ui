import type { ComponentPropsWithRef } from 'react'
import { cx } from '../../../styled-system/css'
import { textarea, type TextareaVariantProps } from '../../../styled-system/recipes'

export type TextareaProps = ComponentPropsWithRef<'textarea'> & TextareaVariantProps
export function Textarea(props: TextareaProps) {
  const [variants, rest] = textarea.splitVariantProps(props)
  return <textarea {...rest} className={cx(textarea(variants), rest.className)} />
}
