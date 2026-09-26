import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Pagination, getPageItems } from '../src/components/ui/pagination'

describe('pagination boundaries', () => {
  it('keeps page numbers bounded, unique and discoverable', () => {
    for (const count of [0, 1, 5, 7, 8, 12, 100])
      for (const page of [-2, 1, 4, 6, 12, 500]) {
        const items = getPageItems(count, page)
        const numbers = items.filter((item): item is number => typeof item === 'number')
        expect(numbers.every((number) => number >= 1 && number <= count)).toBe(true)
        expect(new Set(numbers).size).toBe(numbers.length)
        if (count > 0) {
          expect(numbers[0]).toBe(1)
          expect(numbers.at(-1)).toBe(count)
        }
      }
  })
  it('handles non-finite counts without allocating unbounded arrays', () => {
    expect(getPageItems(Infinity, 1)).toEqual([])
    expect(getPageItems(NaN, 1)).toEqual([])
    expect(getPageItems(5, NaN)).toEqual([1, 2, 3, 4, 5])
  })
  it('changes an uncontrolled page and disables boundaries', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Pagination count={3} onPageChange={onChange} />)
    expect(screen.getByRole('button', { name: 'Previous page' })).toBeDisabled()
    await user.click(screen.getByRole('button', { name: 'Page 3' }))
    expect(onChange).toHaveBeenCalledWith(3)
    expect(screen.getByRole('button', { name: 'Page 3' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('button', { name: 'Next page' })).toBeDisabled()
  })
  it('keeps controlled state controlled and clamps count changes', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    const { rerender } = render(<Pagination count={12} page={8} onPageChange={onChange} />)
    await user.click(screen.getByRole('button', { name: 'Next page' }))
    expect(onChange).toHaveBeenCalledWith(9)
    expect(screen.getByRole('button', { name: 'Page 8' })).toHaveAttribute('aria-current', 'page')
    rerender(<Pagination count={3} page={8} onPageChange={onChange} />)
    expect(screen.getByRole('button', { name: 'Page 3' })).toHaveAttribute('aria-current', 'page')
  })
  it('takes labels in another language, keeping the defaults it does not replace', () => {
    render(
      <Pagination
        count={3}
        aria-label="ページ送り"
        labels={{ previous: '前のページ', page: (page) => `${page} ページ` }}
      />,
    )
    expect(screen.getByRole('navigation', { name: 'ページ送り' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '前のページ' })).toBeDisabled()
    expect(screen.getByRole('button', { name: '2 ページ' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Next page' })).toBeInTheDocument()
  })
})
