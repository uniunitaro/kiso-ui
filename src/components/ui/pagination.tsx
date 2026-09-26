'use client'
import { useState, type ComponentPropsWithRef } from 'react'
import { cx } from '../../../styled-system/css'
import { pagination } from '../../../styled-system/recipes'
import { Button, type ButtonProps } from './button'
import { ChevronLeftIcon, ChevronRightIcon } from './icons'

export function getPageItems(
  count: number,
  current: number,
): Array<number | 'start-gap' | 'end-gap'> {
  const total = Math.max(0, Math.floor(Number.isFinite(count) ? count : 0))
  const active = Math.min(total, Math.max(1, Math.floor(Number.isFinite(current) ? current : 1)))
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  if (active <= 4) return [1, 2, 3, 4, 5, 'end-gap', total]
  if (active >= total - 3)
    return [1, 'start-gap', total - 4, total - 3, total - 2, total - 1, total]
  return [1, 'start-gap', active - 1, active, active + 1, 'end-gap', total]
}
/** Accessible names; pass your own for another language. The nav name is aria-label. */
export interface PaginationLabels {
  previous: string
  next: string
  page: (page: number) => string
}
const defaultLabels: PaginationLabels = {
  previous: 'Previous page',
  next: 'Next page',
  page: (page) => `Page ${page}`,
}
export interface PaginationProps extends Omit<ComponentPropsWithRef<'nav'>, 'onChange'> {
  count: number
  page?: number
  defaultPage?: number
  onPageChange?: (page: number) => void
  /**
   * Button size (default sm). Panda extracts `<Pagination size>` through the button recipe's
   * jsx, and the literal `?? 'sm'` fallback below, so no staticCss is needed.
   */
  size?: ButtonProps['size']
  labels?: Partial<PaginationLabels>
}
export function Pagination({
  count,
  page,
  defaultPage = 1,
  onPageChange,
  size,
  labels: customLabels,
  className,
  ...props
}: PaginationProps) {
  const labels = { ...defaultLabels, ...customLabels }
  const [internalPage, setInternalPage] = useState(defaultPage)
  const total = Math.max(0, Math.floor(Number.isFinite(count) ? count : 0))
  const requested = page ?? internalPage
  const active = Math.min(
    Math.max(total, 1),
    Math.max(1, Math.floor(Number.isFinite(requested) ? requested : 1)),
  )
  function change(next: number) {
    if (next < 1 || next > total || next === active) return
    if (page === undefined) setInternalPage(next)
    onPageChange?.(next)
  }
  return (
    <nav aria-label="Pagination" {...props} className={cx(pagination().root, className)}>
      <Button
        variant="plain"
        colorPalette="gray"
        size={size ?? 'sm'}
        square
        disabled={active <= 1 || total === 0}
        aria-label={labels.previous}
        onClick={() => change(active - 1)}
      >
        <ChevronLeftIcon />
      </Button>
      {getPageItems(total, active).map((item) =>
        typeof item === 'number' ? (
          <Button
            key={item}
            size={size ?? 'sm'}
            square
            variant={item === active ? 'subtle' : 'plain'}
            colorPalette={item === active ? undefined : 'gray'}
            aria-label={labels.page(item)}
            aria-current={item === active ? 'page' : undefined}
            onClick={() => change(item)}
          >
            {item}
          </Button>
        ) : (
          <span key={item} aria-hidden="true" className={pagination().ellipsis}>
            …
          </span>
        ),
      )}
      <Button
        variant="plain"
        colorPalette="gray"
        size={size ?? 'sm'}
        square
        disabled={active >= total || total === 0}
        aria-label={labels.next}
        onClick={() => change(active + 1)}
      >
        <ChevronRightIcon />
      </Button>
    </nav>
  )
}
