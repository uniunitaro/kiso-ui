import { createRef } from 'react'
import { describe, expect, it } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  Button,
  Checkbox,
  Switch,
  Dialog,
  Tabs,
  Select,
  Field,
  Input,
  RadioGroup,
  Fieldset,
  NumberField,
  Accordion,
  InputGroup,
} from '../src/components/ui'

describe('composition contract', () => {
  it('keeps recipe classes, user classes, callback state and refs', async () => {
    const ref = createRef<HTMLButtonElement>()
    render(
      <Checkbox.Root
        ref={ref}
        aria-label="Updates"
        size="lg"
        className={(state) => (state.checked ? 'consumer-checked' : 'consumer-unchecked')}
      >
        <Checkbox.Indicator>✓</Checkbox.Indicator>
      </Checkbox.Root>,
    )
    const box = screen.getByRole('checkbox', { name: 'Updates' })
    expect(box).toHaveClass(
      'kiso-checkbox__root',
      'kiso-checkbox__root--size_lg',
      'consumer-unchecked',
    )
    expect(ref.current).toBe(box)
    await userEvent.click(box)
    expect(box).toBeChecked()
    expect(box).toHaveClass('consumer-checked')
    expect(box).not.toHaveAttribute('size')
  })

  it('preserves render composition and native disabled behavior', async () => {
    render(
      <>
        <Button render={<a href="/docs" />} nativeButton={false}>
          Read docs
        </Button>
        <Button disabled>Unavailable</Button>
      </>,
    )
    expect(screen.getByText('Read docs').tagName).toBe('A')
    expect(screen.getByText('Read docs')).toHaveAttribute('href', '/docs')
    expect(screen.getByRole('button', { name: 'Unavailable' })).toBeDisabled()
  })

  it('shows a loading spinner, keeps the name and focus, and blocks presses', async () => {
    const user = userEvent.setup()
    let presses = 0
    const { rerender } = render(<Button onClick={() => presses++}>Publish</Button>)
    const button = screen.getByRole('button', { name: 'Publish' })
    button.focus()
    rerender(
      <Button loading onClick={() => presses++}>
        Publish
      </Button>,
    )
    expect(button).toHaveAttribute('aria-busy', 'true')
    expect(button).toHaveAttribute('data-loading')
    expect(button).toHaveAttribute('aria-disabled', 'true')
    expect(button).toHaveFocus()
    const spinner = button.querySelector('[data-slot="loader"] .kiso-spinner')
    expect(spinner).toHaveAttribute('aria-hidden', 'true')
    expect(spinner).not.toHaveAttribute('role')
    expect(screen.getByRole('button', { name: 'Publish' })).toBe(button)
    await user.click(button)
    expect(presses).toBe(0)
    rerender(
      <Button loading loadingText="Saving…" spinnerPlacement="end">
        Publish
      </Button>,
    )
    expect(screen.getByRole('button', { name: 'Saving…' })).toBe(button)
    expect(button.lastElementChild).toHaveClass('kiso-spinner')
  })

  it('passes variants through a portal and returns focus after Escape', async () => {
    const user = userEvent.setup()
    render(
      <Dialog.Root size="lg">
        <Dialog.Trigger render={<Button />}>Open details</Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Backdrop />
          <Dialog.Popup>
            <Dialog.Title>Project details</Dialog.Title>
            <Dialog.Description>A focused view.</Dialog.Description>
            <Dialog.Close render={<Button />}>Close</Dialog.Close>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>,
    )
    await user.click(screen.getByRole('button', { name: 'Open details' }))
    const popup = await screen.findByRole('dialog', { name: 'Project details' })
    expect(popup).toHaveClass('kiso-dialog__popup--size_lg')
    expect(popup).toHaveAccessibleDescription('A focused view.')
    await user.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    await waitFor(() => expect(screen.getByRole('button', { name: 'Open details' })).toHaveFocus())
  })
})

describe('keyboard and form contracts', () => {
  it('switches tabs with the keyboard and exposes the selected panel', async () => {
    const user = userEvent.setup()
    render(
      <Tabs.Root defaultValue="one">
        <Tabs.List aria-label="Views">
          <Tabs.Tab value="one">First</Tabs.Tab>
          <Tabs.Tab value="two">Second</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="one">First panel</Tabs.Panel>
        <Tabs.Panel value="two">Second panel</Tabs.Panel>
      </Tabs.Root>,
    )
    await user.tab()
    expect(screen.getByRole('tab', { name: 'First' })).toHaveFocus()
    await user.keyboard('{ArrowRight}')
    expect(screen.getByRole('tab', { name: 'Second' })).toHaveFocus()
    await user.keyboard('{Enter}')
    expect(screen.getByRole('tab', { name: 'Second' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tabpanel', { name: 'Second' })).toHaveTextContent('Second panel')
  })

  it('associates field labels and descriptions, preserves submitted names', async () => {
    const user = userEvent.setup()
    render(
      <form aria-label="Profile">
        <Field.Root name="email">
          <Field.Label>Email</Field.Label>
          <Input required type="email" />
          <Field.Description>Account email only.</Field.Description>
        </Field.Root>
        <label>
          <Switch.Root name="digest" defaultChecked>
            <Switch.Thumb />
          </Switch.Root>
          Weekly digest
        </label>
      </form>,
    )
    const email = screen.getByRole('textbox', { name: 'Email' })
    expect(email).toHaveAccessibleDescription('Account email only.')
    await user.type(email, 'alex@example.com')
    const data = new FormData(screen.getByRole('form', { name: 'Profile' }) as HTMLFormElement)
    expect(data.get('email')).toBe('alex@example.com')
    expect(data.has('digest')).toBe(true)
    await user.click(screen.getByRole('switch', { name: 'Weekly digest' }))
    expect(screen.getByRole('switch', { name: 'Weekly digest' })).not.toBeChecked()
  })

  it('selects options by keyboard and keeps the value label', async () => {
    const user = userEvent.setup()
    render(
      <Select.Root
        items={[
          { value: 'a', label: 'Alpha' },
          { value: 'b', label: 'Beta' },
        ]}
        defaultValue="a"
      >
        <Select.Trigger aria-label="Team">
          <Select.Value />
        </Select.Trigger>
        <Select.Portal>
          <Select.Positioner alignItemWithTrigger={false}>
            <Select.Popup>
              <Select.List>
                <Select.Item value="a">
                  <Select.ItemText>Alpha</Select.ItemText>
                </Select.Item>
                <Select.Item value="b">
                  <Select.ItemText>Beta</Select.ItemText>
                </Select.Item>
              </Select.List>
            </Select.Popup>
          </Select.Positioner>
        </Select.Portal>
      </Select.Root>,
    )
    await user.tab()
    await user.keyboard('{ArrowDown}')
    await screen.findByRole('listbox')
    await user.keyboard('{End}{Enter}')
    await waitFor(() =>
      expect(screen.getByRole('combobox', { name: 'Team' })).toHaveTextContent('Beta'),
    )
  })

  it('names choices through Label parts and keeps disabled choices inert', async () => {
    const user = userEvent.setup()
    render(
      <>
        <Checkbox.Label>
          <Checkbox.Root disabled>
            <Checkbox.Indicator>✓</Checkbox.Indicator>
          </Checkbox.Root>
          Managed
        </Checkbox.Label>
        <Switch.Label>
          Digest
          <Switch.Root>
            <Switch.Thumb />
          </Switch.Root>
        </Switch.Label>
      </>,
    )
    const managed = screen.getByRole('checkbox', { name: 'Managed' })
    // The label's :has([data-disabled]) style keys off this attribute.
    expect(managed).toHaveAttribute('data-disabled')
    expect(managed.closest('label')).toHaveClass('kiso-checkbox__label')
    await user.click(screen.getByText('Managed'))
    expect(managed).not.toBeChecked()
    await user.click(screen.getByText('Digest'))
    expect(screen.getByRole('switch', { name: 'Digest' })).toBeChecked()
  })

  it('sizes Root from the Label around it unless Root sets its own', () => {
    render(
      <>
        <Checkbox.Label size="lg" variant="outline">
          <Checkbox.Root />
          Inherited
        </Checkbox.Label>
        <Checkbox.Label size="lg">
          <Checkbox.Root size="sm" />
          Own
        </Checkbox.Label>
      </>,
    )
    const inherited = screen.getByRole('checkbox', { name: 'Inherited' })
    expect(inherited).toHaveClass(
      'kiso-checkbox__root--size_lg',
      'kiso-checkbox__root--variant_outline',
    )
    expect(inherited.closest('label')).toHaveClass('kiso-checkbox__label--size_lg')
    expect(screen.getByRole('checkbox', { name: 'Own' })).toHaveClass(
      'kiso-checkbox__root--size_sm',
    )
  })

  it('marks the legend of a disabled fieldset', () => {
    render(
      <Fieldset.Root disabled>
        <Fieldset.Legend>About you</Fieldset.Legend>
      </Fieldset.Root>,
    )
    expect(screen.getByText('About you')).toHaveAttribute('data-disabled')
  })

  it('exposes radio items with their own labels', async () => {
    const user = userEvent.setup()
    render(
      <RadioGroup.Root aria-label="Plan" defaultValue="personal">
        <label>
          <RadioGroup.Item value="personal" />
          Personal
        </label>
        <label>
          <RadioGroup.Item value="team" />
          Team
        </label>
      </RadioGroup.Root>,
    )
    await user.click(screen.getByRole('radio', { name: 'Team' }))
    expect(screen.getByRole('radio', { name: 'Team' })).toBeChecked()
    expect(screen.getByRole('radio', { name: 'Personal' })).not.toBeChecked()
  })
})

describe('built-in icons', () => {
  it('draws icons in icon parts until children replace them', () => {
    render(
      <NumberField.Root defaultValue={1}>
        <NumberField.Decrement aria-label="Less" />
        <NumberField.Input aria-label="Count" />
        <NumberField.Increment aria-label="More">More</NumberField.Increment>
      </NumberField.Root>,
    )
    const less = screen.getByRole('button', { name: 'Less' })
    expect(less.querySelector('svg')).toHaveAttribute('aria-hidden', 'true')
    expect(less).toHaveClass('kiso-number__decrement')
    const more = screen.getByRole('button', { name: 'More' })
    expect(more.querySelector('svg')).toBeNull()
    expect(more).toHaveTextContent('More')
  })

  it('marks the checkbox indicator for the indeterminate minus', () => {
    render(
      <Checkbox.Root aria-label="Some" indeterminate>
        <Checkbox.Indicator data-testid="indicator" />
      </Checkbox.Root>,
    )
    const indicator = screen.getByTestId('indicator')
    expect(indicator).toHaveAttribute('data-indeterminate')
    expect(indicator.querySelector('[data-mark=check]')).not.toBeNull()
    expect(indicator.querySelector('[data-mark=indeterminate]')).not.toBeNull()
  })
})

describe('close triggers and indicators', () => {
  it('names the corner close button until aria-label or children replace it', async () => {
    render(
      <Dialog.Root defaultOpen>
        <Dialog.Portal>
          <Dialog.Popup>
            <Dialog.Title>Workspace</Dialog.Title>
            <Dialog.CloseTrigger />
            <Dialog.CloseTrigger aria-label="閉じる" />
            <Dialog.CloseTrigger>Done</Dialog.CloseTrigger>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>,
    )
    const close = await screen.findByRole('button', { name: 'Close' })
    expect(close).toHaveClass('kiso-dialog__closeTrigger')
    expect(close.querySelector('svg')).toHaveAttribute('aria-hidden', 'true')
    expect(screen.getByRole('button', { name: '閉じる' }).querySelector('svg')).not.toBeNull()
    const done = screen.getByRole('button', { name: 'Done' })
    expect(done).not.toHaveAttribute('aria-label')
    expect(done.querySelector('svg')).toBeNull()
    await userEvent.click(close)
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
  })

  it('draws a chevron in the accordion indicator', () => {
    render(
      <Accordion.Root defaultValue={['a']}>
        <Accordion.Item value="a">
          <Accordion.Header>
            <Accordion.Trigger>
              Question
              <Accordion.Indicator data-testid="indicator" />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Panel>Answer</Accordion.Panel>
        </Accordion.Item>
      </Accordion.Root>,
    )
    const indicator = screen.getByTestId('indicator')
    expect(indicator).toHaveClass('kiso-accordion__indicator')
    expect(indicator.querySelector('svg')).toHaveAttribute('aria-hidden', 'true')
    expect(screen.getByRole('button', { name: 'Question' })).toHaveAttribute('data-panel-open')
  })
})

describe('input group', () => {
  it('keeps the Input as the labelled control beside its element and addon', () => {
    render(
      <InputGroup.Root>
        <InputGroup.Addon>https://</InputGroup.Addon>
        <Input aria-label="Website" size="lg" />
        <InputGroup.Element data-testid="element">.com</InputGroup.Element>
      </InputGroup.Root>,
    )
    const input = screen.getByRole('textbox', { name: 'Website' })
    expect(input.parentElement).toHaveClass('kiso-input-group__root')
    expect(screen.getByTestId('element')).toHaveClass('kiso-input-group__element')
    expect(screen.getByText('https://')).toHaveClass('kiso-input-group__addon')
  })
})
