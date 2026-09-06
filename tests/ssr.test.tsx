// @vitest-environment node
import { expect, it } from 'vitest'
import { renderToString } from 'react-dom/server'
import { Button, Field, Input, Select, Dialog, Tabs, Spinner } from '../src/components/ui'

it('renders source components on the server without browser globals', () => {
  const html = renderToString(
    <>
      <Button size="lg">Continue</Button>
      <Field.Root>
        <Field.Label>Name</Field.Label>
        <Input defaultValue="Alex" />
      </Field.Root>
      <Select.Root items={[{ value: 'a', label: 'Alpha' }]} defaultValue="a">
        <Select.Trigger aria-label="Team">
          <Select.Value />
        </Select.Trigger>
      </Select.Root>
      <Dialog.Root>
        <Dialog.Trigger>Open</Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Popup>
            <Dialog.Title>Details</Dialog.Title>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
      <Tabs.Root defaultValue="a">
        <Tabs.List aria-label="Views">
          <Tabs.Tab value="a">Overview</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="a">Panel</Tabs.Panel>
      </Tabs.Root>
      <Spinner />
    </>,
  )
  expect(html).toContain('kiso-button--size_lg')
  expect(html).toContain('Alpha')
  expect(html).toContain('role="tab"')
  expect(html).not.toContain('role="dialog"')
})
