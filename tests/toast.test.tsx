import { describe, expect, it } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button, Toast } from '../src/components/ui'

function Trigger({ type, title }: { type?: string; title: string }) {
  const manager = Toast.useToastManager()
  return <Button onClick={() => manager.add({ title, type })}>{title}</Button>
}

describe('Toaster', () => {
  it('tints an icon for known types and stays a plain card otherwise', async () => {
    const user = userEvent.setup()
    render(
      <Toast.Provider>
        <Trigger type="success" title="Saved" />
        <Trigger title="Link copied" />
        <Toast.Toaster />
      </Toast.Provider>,
    )
    await user.click(screen.getByRole('button', { name: 'Saved' }))
    await user.click(screen.getByRole('button', { name: 'Link copied' }))
    await waitFor(() => expect(document.querySelectorAll('.kiso-toast__root')).toHaveLength(2))
    const [plain, success] = [...document.querySelectorAll('.kiso-toast__root')]
    expect(success).toHaveAttribute('data-type', 'success')
    expect(success.querySelector('.kiso-toast__indicator')).toHaveAttribute('aria-hidden', 'true')
    expect(plain).not.toHaveAttribute('data-type')
    expect(plain.querySelector('.kiso-toast__indicator')).toBeNull()
    // Without a label the region keeps Base UI's own name.
    expect(document.querySelector('.kiso-toast__viewport')).toHaveAttribute(
      'aria-label',
      'Notifications',
    )
    // The frontmost toast is first; Base UI marks the rest as behind for the collapsed stack.
    expect(success.querySelector('.kiso-toast__content')).toHaveAttribute('data-behind')
  })
  it('names the region and the dismiss button in the given language', async () => {
    const user = userEvent.setup()
    render(
      <Toast.Provider>
        <Trigger title="保存しました" />
        <Toast.Toaster label="通知" closeLabel="通知を閉じる" />
      </Toast.Provider>,
    )
    await user.click(screen.getByRole('button', { name: '保存しました' }))
    await waitFor(() =>
      expect(document.querySelector('.kiso-toast__close')).toHaveAttribute(
        'aria-label',
        '通知を閉じる',
      ),
    )
    expect(document.querySelector('.kiso-toast__viewport')).toHaveAttribute('aria-label', '通知')
  })
})
