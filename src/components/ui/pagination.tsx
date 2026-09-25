'use client'
import { useState, type ComponentPropsWithRef } from 'react'
import { cx } from '../../../styled-system/css'
import { pagination } from '../../../styled-system/recipes'
import { Button, type ButtonProps } from './button'

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
}
export function Pagination({
  count,
  page,
  defaultPage = 1,
  onPageChange,
  size,
  className,
  ...props
}: PaginationProps) {
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
        aria-label="Previous page"
        onClick={() => change(active - 1)}
      >
        ‹
      </Button>
      {getPageItems(total, active).map((item) =>
        typeof item === 'number' ? (
          <Button
            key={item}
            size={size ?? 'sm'}
            square
            variant={item === active ? 'subtle' : 'plain'}
            colorPalette={item === active ? undefined : 'gray'}
            aria-label={`Page ${item}`}
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
        aria-label="Next page"
        onClick={() => change(active + 1)}
      >
        ›
      </Button>
    </nav>
  )
}
