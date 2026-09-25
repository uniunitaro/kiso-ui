import { advancedExamples } from './advanced-examples.ts'
/** Small, complete examples; component source and recipes are available separately. */
export const examples: Record<string, string> = {
  button: `import { Button } from './components/ui/button'\n\n<Button variant="solid" size="md">Add to project</Button>\n<Button variant="outline" size="sm">Cancel</Button>\n\n// Compose without an extra element.\n<Button nativeButton={false} render={<a href="/projects" />}>\n  View projects\n</Button>`,
  input: `import { Input } from './components/ui/input'\nimport * as Field from './components/ui/field'\n\n<Field.Root name="email">\n  <Field.Label>Email address</Field.Label>\n  <Input type="email" placeholder="you@studio.design" required />\n  <Field.Description>For the occasional good thing.</Field.Description>\n  <Field.Error match="valueMissing">Enter an email address.</Field.Error>\n</Field.Root>`,
  textarea: `import { Textarea } from './components/ui/textarea'\nimport * as Field from './components/ui/field'\n\n<Field.Root name="idea">\n  <Field.Label>Your next idea</Field.Label>\n  <Field.Control render={<Textarea placeholder="It starts with a thought…" />} />\n</Field.Root>`,
  checkbox: `import * as Checkbox from './components/ui/checkbox'\n\n<label>\n  <Checkbox.Root size="md" defaultChecked>\n    <Checkbox.Indicator>✓</Checkbox.Indicator>\n  </Checkbox.Root>\n  Keep me in the loop\n</label>`,
  switch: `import * as Switch from './components/ui/switch'\n\n<label>\n  Weekly digest\n  <Switch.Root size="md" defaultChecked>\n    <Switch.Thumb />\n  </Switch.Root>\n</label>`,
  select: `import * as Select from './components/ui/select'\n\nconst items = [\n  { label: 'Design', value: 'design' },\n  { label: 'Engineering', value: 'engineering' },\n]\n\n<Select.Root items={items} defaultValue="design" size="md">\n  <Select.Trigger aria-label="Team">\n    <Select.Value /><Select.Icon>⌄</Select.Icon>\n  </Select.Trigger>\n  <Select.Portal>\n    <Select.Positioner sideOffset={6} alignItemWithTrigger={false}>\n      <Select.Popup><Select.List>\n        {items.map(item => (\n          <Select.Item key={item.value} value={item.value}>\n            <Select.ItemText>{item.label}</Select.ItemText>\n            <Select.ItemIndicator>✓</Select.ItemIndicator>\n          </Select.Item>\n        ))}\n      </Select.List></Select.Popup>\n    </Select.Positioner>\n  </Select.Portal>\n</Select.Root>`,
  tabs: `import * as Tabs from './components/ui/tabs'\n\n<Tabs.Root defaultValue="overview" variant="line" size="md">\n  <Tabs.List aria-label="Project views">\n    <Tabs.Tab value="overview">Overview</Tabs.Tab>\n    <Tabs.Tab value="activity">Activity</Tabs.Tab>\n    <Tabs.Indicator />\n  </Tabs.List>\n  <Tabs.Panel value="overview">Your project at a glance.</Tabs.Panel>\n  <Tabs.Panel value="activity">The latest changes.</Tabs.Panel>\n</Tabs.Root>`,
  dialog: `import * as Dialog from './components/ui/dialog'\nimport { Button } from './components/ui/button'\n\n<Dialog.Root size="md">\n  <Dialog.Trigger render={<Button />}>New workspace</Dialog.Trigger>\n  <Dialog.Portal>\n    <Dialog.Backdrop />\n    <Dialog.Popup>\n      <Dialog.Header>\n        <Dialog.Title>Create a workspace</Dialog.Title>\n        <Dialog.Description>Bring your people together.</Dialog.Description>\n      </Dialog.Header>\n      <Dialog.Body>Your form goes here.</Dialog.Body>\n      <Dialog.Footer>\n        <Dialog.Close render={<Button variant="outline" colorPalette="gray" />}>Cancel</Dialog.Close>\n        <Button>Create</Button>\n      </Dialog.Footer>\n    </Dialog.Popup>\n  </Dialog.Portal>\n</Dialog.Root>`,
  accordion: `import * as Accordion from './components/ui/accordion'\n\n<Accordion.Root variant="outline" defaultValue={['ownership']}>\n  <Accordion.Item value="ownership">\n    <Accordion.Header>\n      <Accordion.Trigger>Is this really my code?</Accordion.Trigger>\n    </Accordion.Header>\n    <Accordion.Panel><div>Every line. Make it yours.</div></Accordion.Panel>\n  </Accordion.Item>\n</Accordion.Root>`,
  slider: `import * as Slider from './components/ui/slider'\n\n<Slider.Root defaultValue={64} min={0} max={100}>\n  <Slider.Label>Creative energy</Slider.Label>\n  <Slider.Value />\n  <Slider.Control>\n    <Slider.Track>\n      <Slider.Indicator />\n      <Slider.Thumb aria-label="Creative energy" />\n    </Slider.Track>\n  </Slider.Control>\n</Slider.Root>`,
  badge: `import { Badge } from './components/ui/badge'\n\n<Badge colorPalette="success">Published</Badge>\n<Badge colorPalette="gray" variant="outline" size="md">Draft</Badge>`,
  avatar: `import * as Avatar from './components/ui/avatar'\n\n<Avatar.Root role="img" size="md" aria-label="Alex Kim">\n  <Avatar.Image src="/alex.jpg" alt="Alex Kim" />\n  <Avatar.Fallback>AK</Avatar.Fallback>\n</Avatar.Root>`,
  progress: `import * as Progress from './components/ui/progress'\n\n<Progress.Root value={68} max={100} size="md">\n  <Progress.Label>Getting things ready</Progress.Label>\n  <Progress.Value />\n  <Progress.Track><Progress.Indicator /></Progress.Track>\n</Progress.Root>`,
  alert: `import * as Alert from './components/ui/alert'\n\n<Alert.Root status="success">\n  <Alert.Icon aria-hidden="true">✓</Alert.Icon>\n  <Alert.Content>\n    <Alert.Title>You’re all set.</Alert.Title>\n    <Alert.Description>Your changes have been saved.</Alert.Description>\n  </Alert.Content>\n</Alert.Root>`,
  card: `import * as Card from './components/ui/card'\n\n<Card.Root variant="outline" size="md">\n  <Card.Header>\n    <Card.Title>A place to start.</Card.Title>\n    <Card.Description>Room to make it yours.</Card.Description>\n  </Card.Header>\n  <Card.Body>Your content here.</Card.Body>\n  <Card.Footer>Your actions here.</Card.Footer>\n</Card.Root>`,
  separator: `import { Separator } from './components/ui/separator'\n\n<Separator />\n<Separator orientation="vertical" />`,
  kbd: `import { Kbd } from './components/ui/kbd'\n\n<Kbd>⌘</Kbd> <Kbd>K</Kbd>`,
  skeleton: `import { Skeleton } from './components/ui/skeleton'\nimport { css } from '../styled-system/css'\n\n<section aria-busy="true" aria-label="Loading project">\n  <Skeleton className={css({ height: '10', width: '40' })} />\n  <Skeleton className={css({ height: '24', marginTop: '3' })} />\n</section>`,
  toggle: `import { Toggle, ToggleGroup } from './components/ui/toggle'\n\n<ToggleGroup multiple defaultValue={['bold']} aria-label="Text formatting">\n  <Toggle value="bold" aria-label="Bold">B</Toggle>\n  <Toggle value="italic" aria-label="Italic">I</Toggle>\n</ToggleGroup>`,
  'radio-group': `import * as RadioGroup from './components/ui/radio-group'\n\n<RadioGroup.Root defaultValue="personal" aria-label="Workspace type">\n  <label>\n    <RadioGroup.Item value="personal"><RadioGroup.Indicator /></RadioGroup.Item>\n    Personal\n  </label>\n  <label>\n    <RadioGroup.Item value="team"><RadioGroup.Indicator /></RadioGroup.Item>\n    Team\n  </label>\n</RadioGroup.Root>`,
  'number-field': `import * as NumberField from './components/ui/number-field'\nimport * as Field from './components/ui/field'\n\n<Field.Root>\n  <Field.Label>Team seats</Field.Label>\n  <NumberField.Root defaultValue={5} min={1} max={50}>\n    <NumberField.Group>\n      <NumberField.Decrement aria-label="Remove a seat">−</NumberField.Decrement>\n      <NumberField.Input />\n      <NumberField.Increment aria-label="Add a seat">+</NumberField.Increment>\n    </NumberField.Group>\n  </NumberField.Root>\n</Field.Root>`,
  popover: `import * as Popover from './components/ui/popover'\nimport { Button } from './components/ui/button'\n\n<Popover.Root size="md">\n  <Popover.Trigger render={<Button />}>Notifications</Popover.Trigger>\n  <Popover.Portal><Popover.Positioner sideOffset={8}>\n    <Popover.Popup>\n      <Popover.Title>All caught up.</Popover.Title>\n      <Popover.Description>Go make something good.</Popover.Description>\n    </Popover.Popup>\n  </Popover.Positioner></Popover.Portal>\n</Popover.Root>`,
  menu: `import * as Menu from './components/ui/menu'\nimport { Button } from './components/ui/button'\n\n<Menu.Root>\n  <Menu.Trigger render={<Button />}>Project actions</Menu.Trigger>\n  <Menu.Portal><Menu.Positioner sideOffset={6}>\n    <Menu.Popup>\n      <Menu.Item onClick={() => console.log('duplicate')}>Duplicate</Menu.Item>\n      <Menu.Separator />\n      <Menu.CheckboxItem defaultChecked>\n        Show in sidebar<Menu.CheckboxItemIndicator>✓</Menu.CheckboxItemIndicator>\n      </Menu.CheckboxItem>\n    </Menu.Popup>\n  </Menu.Positioner></Menu.Portal>\n</Menu.Root>`,
  tooltip: `import * as Tooltip from './components/ui/tooltip'\nimport { Button } from './components/ui/button'\n\n<Tooltip.Provider delay={200}>\n  <Tooltip.Root>\n    <Tooltip.Trigger render={<Button aria-label="About this component" />}>?</Tooltip.Trigger>\n    <Tooltip.Portal><Tooltip.Positioner sideOffset={8}>\n      <Tooltip.Popup>A little context goes a long way.</Tooltip.Popup>\n    </Tooltip.Positioner></Tooltip.Portal>\n  </Tooltip.Root>\n</Tooltip.Provider>`,
}
examples.field = examples.input
Object.assign(examples, advancedExamples)
examples['alert-dialog'] = examples.dialog
  .replaceAll('Dialog', 'AlertDialog')
  .replaceAll('/dialog', '/alert-dialog')
  .replaceAll('New workspace', 'Archive project')
  .replaceAll('Create a workspace', 'Archive this project?')
  .replaceAll('Bring your people together.', 'You can restore it later.')

// Ship executable examples, not unconnected JSX fragments.
for (const [id, source] of Object.entries(examples)) {
  if (source.includes('export function Example')) {
    examples[id] = `'use client'\n${source}`
    continue
  }
  const firstJsx = source.search(/^</m)
  if (firstJsx < 0) continue
  const before = source.slice(0, firstJsx).trimEnd()
  const jsx = source.slice(firstJsx).replace(/^\/\/ (.*)$/gm, '{/* $1 */}')
  examples[id] =
    `'use client'\n${before}\n;\n\nexport function Example() {\n  return (\n    <>\n${jsx
      .split('\n')
      .map((line) => '      ' + line)
      .join('\n')}\n    </>\n  )\n}`
}
