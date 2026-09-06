import {
  Accordion,
  Button,
  Combobox,
  Dialog,
  RadioGroup,
  Select,
  Slider,
} from '../src/components/ui'

// This file is type-checked, not executed. Callbacks must keep their inferred values.
const stringSelect = (
  <Select.Root
    items={[{ value: 'a', label: 'Alpha' }]}
    defaultValue="a"
    onValueChange={(value) => value?.toUpperCase()}
  />
)
const multiSelect = (
  <Select.Root
    multiple
    defaultValue={['a']}
    onValueChange={(values) => values.map((value) => value.toUpperCase())}
  />
)
const objectCombo = (
  <Combobox.Root
    items={[{ id: 1, label: 'One' }]}
    defaultValue={{ id: 1, label: 'One' }}
    onValueChange={(value) => value?.id.toFixed()}
  />
)
const radio = <RadioGroup.Root defaultValue="a" onValueChange={(value) => value.toUpperCase()} />
const accordion = (
  <Accordion.Root
    defaultValue={['a']}
    onValueChange={(values) => values.map((value) => value.toUpperCase())}
  />
)
const numericSlider = <Slider.Root defaultValue={50} onValueChange={(value) => value.toFixed()} />
const rangeSlider = (
  <Slider.Root defaultValue={[20, 80]} onValueChange={(value) => value.map((n) => n.toFixed())} />
)
const handle = Dialog.createHandle<{ project: string }>()
const payloadDialog = (
  <Dialog.Root handle={handle}>
    {({ payload }) => <span>{payload?.project.toUpperCase()}</span>}
  </Dialog.Root>
)
const responsiveButton = (
  <Button size={{ base: 'sm', md: 'lg' }} colorPalette="danger" variant="outline">
    Remove
  </Button>
)

// @ts-expect-error invalid variant
const badVariant = <Button variant="rainbow" />
// @ts-expect-error explicit value type must be preserved
const badSelect = <Select.Root<string> defaultValue={42} />
// @ts-expect-error explicit radio value type must be preserved
const badRadio = <RadioGroup.Root<string> defaultValue={42} />
// @ts-expect-error range callbacks receive an array, not a scalar
const badSlider = <Slider.Root defaultValue={[20, 80]} onValueChange={(value) => value.toFixed()} />

void [
  stringSelect,
  multiSelect,
  objectCombo,
  radio,
  accordion,
  numericSlider,
  rangeSlider,
  payloadDialog,
  responsiveButton,
  badVariant,
  badSelect,
  badRadio,
  badSlider,
]
