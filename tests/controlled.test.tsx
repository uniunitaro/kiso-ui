import { useState } from 'react'
import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Checkbox, CheckboxGroup, Combobox, Slider, Button } from '../src/components/ui'

describe('controlled values stay owned by the application', () => {
  it('supports checkbox group values and native form submission', async () => {
    function Example() {
      const [values, setValues] = useState(['design'])
      return (
        <form aria-label="Interests">
          <CheckboxGroup value={values} onValueChange={setValues} aria-label="Topics">
            {['design', 'code'].map((value) => (
              <label key={value}>
                <Checkbox.Root name="topics" value={value} />
                <span>{value}</span>
              </label>
            ))}
          </CheckboxGroup>
          <output>{values.join(',')}</output>
        </form>
      )
    }
    render(<Example />)
    await userEvent.click(screen.getByRole('checkbox', { name: 'code' }))
    expect(screen.getByRole('status')).toHaveTextContent('design,code')
    const data = new FormData(screen.getByRole('form') as HTMLFormElement)
    expect(data.getAll('topics')).toEqual(['design', 'code'])
  })

  it('keeps multiple object combobox values across the styled portal', async () => {
    const items = [
      { id: 1, label: 'Design' },
      { id: 2, label: 'Code' },
    ]
    function Example() {
      const [values, setValues] = useState([items[0]])
      return (
        <Combobox.Root
          multiple
          items={items}
          value={values}
          onValueChange={setValues}
          itemToStringLabel={(item) => item.label}
          size="lg"
        >
          <Combobox.Input aria-label="Skills" />
          <Combobox.Trigger aria-label="Show skills">Open</Combobox.Trigger>
          <Combobox.Portal>
            <Combobox.Positioner>
              <Combobox.Popup>
                <Combobox.List>
                  {(item: (typeof items)[number]) => (
                    <Combobox.Item key={item.id} value={item}>
                      {item.label}
                    </Combobox.Item>
                  )}
                </Combobox.List>
              </Combobox.Popup>
            </Combobox.Positioner>
          </Combobox.Portal>
          <output>{values.map((item) => item.label).join(',')}</output>
        </Combobox.Root>
      )
    }
    render(<Example />)
    await userEvent.click(screen.getByRole('button', { name: 'Show skills' }))
    expect(await screen.findByRole('listbox')).toHaveAttribute('aria-multiselectable', 'true')
    await userEvent.click(screen.getByRole('option', { name: 'Code' }))
    expect(screen.getByRole('status', { hidden: true })).toHaveTextContent('Design,Code')
    expect(screen.getByRole('option', { name: 'Code' })).toHaveAttribute('aria-selected', 'true')
  })

  it('responds to controlled range resets and keeps each thumb labeled', async () => {
    function Example() {
      const [value, setValue] = useState([20, 80])
      return (
        <>
          <Slider.Root value={value} onValueChange={setValue}>
            <Slider.Control>
              <Slider.Track>
                <Slider.Indicator />
              </Slider.Track>
              <Slider.Thumb index={0} aria-label="Minimum" />
              <Slider.Thumb index={1} aria-label="Maximum" />
            </Slider.Control>
          </Slider.Root>
          <Button onClick={() => setValue([30, 70])}>Reset range</Button>
        </>
      )
    }
    render(<Example />)
    expect(screen.getByRole('slider', { name: 'Minimum' })).toHaveAttribute('aria-valuenow', '20')
    await userEvent.click(screen.getByRole('button', { name: 'Reset range' }))
    expect(screen.getByRole('slider', { name: 'Minimum' })).toHaveAttribute('aria-valuenow', '30')
    expect(screen.getByRole('slider', { name: 'Maximum' })).toHaveAttribute('aria-valuenow', '70')
  })
})
