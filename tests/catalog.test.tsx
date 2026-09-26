import { describe, expect, it } from 'vitest'
import { render, waitFor } from '@testing-library/react'
import { catalog } from '../src/app/catalog'
import { Demo } from '../src/app/demos'

describe('every registered component has a working preview', () => {
  it.each(catalog)('$name renders without losing its primitive contract', async (entry) => {
    const { container } = render(<Demo id={entry.id} variant={entry.variants?.[0]} />)
    // The first lazy demo loads the whole advanced-demos chunk, which can take over a second.
    await waitFor(() => expect(container).not.toHaveTextContent('Loading component…'), {
      timeout: 5000,
    })
    expect(container.childElementCount).toBeGreaterThan(0)
  })
})
