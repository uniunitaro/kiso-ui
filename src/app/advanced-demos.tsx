import { useState } from 'react'
import {
  Bold,
  Check,
  ChevronDown,
  Copy,
  Italic,
  Layers,
  Link,
  Minus,
  Plus,
  Search,
  Settings2,
  X,
} from 'lucide-react'
import * as Autocomplete from '../components/ui/autocomplete'
import { Button } from '../components/ui/button'
import * as Checkbox from '../components/ui/checkbox'
import { CheckboxGroup } from '../components/ui/checkbox-group'
import * as Collapsible from '../components/ui/collapsible'
import * as Combobox from '../components/ui/combobox'
import * as ContextMenu from '../components/ui/context-menu'
import * as Drawer from '../components/ui/drawer'
import * as Field from '../components/ui/field'
import * as Fieldset from '../components/ui/fieldset'
import { Form } from '../components/ui/form'
import { Input } from '../components/ui/input'
import { Menubar } from '../components/ui/menubar'
import * as Menu from '../components/ui/menu'
import * as Meter from '../components/ui/meter'
import * as NavigationMenu from '../components/ui/navigation-menu'
import * as OtpField from '../components/ui/otp-field'
import * as PreviewCard from '../components/ui/preview-card'
import * as ScrollArea from '../components/ui/scroll-area'
import * as Toast from '../components/ui/toast'
import { Toggle } from '../components/ui/toggle'
import * as Toolbar from '../components/ui/toolbar'
import { css } from '../../styled-system/css'
import { styles as s } from './styles'
import { pass } from './demos'
import { NativeDemo } from './native-demos'

const frameworks = ['React', 'Next.js', 'Remix', 'Astro', 'Vue', 'Svelte', 'Solid', 'Angular']

export function ComboboxDemo({
  size = 'md',
  variant,
  palette,
}: {
  size?: string
  variant?: string
  palette?: string
}) {
  return (
    <Field.Root>
      <Field.Label>Your framework</Field.Label>
      <Combobox.Root
        items={frameworks}
        defaultValue="React"
        size={pass(size)}
        variant={pass(variant)}
        colorPalette={pass(palette)}
      >
        <Combobox.InputGroup>
          <Combobox.Input placeholder="Find a framework…" />
          <Combobox.Clear aria-label="Clear framework">
            <X />
          </Combobox.Clear>
          <Combobox.Trigger aria-label="Show frameworks">
            <ChevronDown />
          </Combobox.Trigger>
        </Combobox.InputGroup>
        <Combobox.Portal>
          <Combobox.Positioner sideOffset={6}>
            <Combobox.Popup>
              <Combobox.Empty>No frameworks found.</Combobox.Empty>
              <Combobox.List>
                {(item: string) => (
                  <Combobox.Item key={item} value={item}>
                    {item}
                    <Combobox.ItemIndicator>
                      <Check />
                    </Combobox.ItemIndicator>
                  </Combobox.Item>
                )}
              </Combobox.List>
            </Combobox.Popup>
          </Combobox.Positioner>
        </Combobox.Portal>
      </Combobox.Root>
      <Field.Description>Type to narrow down the possibilities.</Field.Description>
    </Field.Root>
  )
}

function ToastTrigger() {
  const manager = Toast.useToastManager()
  return (
    <div className={s.row}>
      <Button
        variant="outline"
        colorPalette="gray"
        onClick={() =>
          manager.add({
            title: 'A little progress, saved.',
            description: 'Your project is right where you left it.',
            type: 'success',
          })
        }
      >
        Show notification
      </Button>
      <Button
        variant="plain"
        colorPalette="gray"
        onClick={() =>
          manager.add({
            title: 'Something needs another try.',
            description: 'Your work is safe. Give it another moment.',
            type: 'error',
          })
        }
      >
        Try an error
      </Button>
    </div>
  )
}
export function ToastDemo() {
  return (
    <Toast.Provider timeout={5000}>
      <ToastTrigger />
      <Toast.Toaster />
    </Toast.Provider>
  )
}

function DrawerDemo({ size }: { size?: string }) {
  return (
    <div className={s.row}>
      {(['down', 'right'] as const).map((direction) => (
        <Drawer.Root key={direction} swipeDirection={direction} size={pass(size)}>
          <Drawer.Trigger render={<Button variant="outline" colorPalette="gray" />}>
            {direction === 'down' ? 'Open bottom sheet' : 'Open side panel'}
          </Drawer.Trigger>
          <Drawer.Portal>
            <Drawer.Backdrop />
            <Drawer.Viewport>
              <Drawer.Popup>
                <Drawer.Content>
                  <Drawer.Header>
                    <Drawer.Title>A little room to focus.</Drawer.Title>
                    <Drawer.Description>
                      Review the details, make your next move, and return to what you were doing.
                    </Drawer.Description>
                  </Drawer.Header>
                  <Drawer.Body>
                    <div
                      className={css({
                        p: '4',
                        borderWidth: '1px',
                        borderRadius: 'l3',
                        display: 'flex',
                        gap: '3',
                        alignItems: 'center',
                      })}
                    >
                      <Layers size={20} />
                      <span className={s.title}>Studio North · Design system</span>
                    </div>
                  </Drawer.Body>
                  <Drawer.Footer>
                    <Drawer.Close render={<Button />}>Back to the collection</Drawer.Close>
                  </Drawer.Footer>
                  <Drawer.CloseTrigger
                    aria-label="Close"
                    render={<Button variant="plain" colorPalette="gray" size="sm" square />}
                  >
                    <X />
                  </Drawer.CloseTrigger>
                </Drawer.Content>
              </Drawer.Popup>
            </Drawer.Viewport>
          </Drawer.Portal>
        </Drawer.Root>
      ))}
    </div>
  )
}

export function AdvancedDemo({
  id,
  size = 'md',
  variant,
  palette,
}: {
  id: string
  size?: string
  variant?: string
  palette?: string
}) {
  const [message, setMessage] = useState('')
  switch (id) {
    case 'combobox':
      return <ComboboxDemo size={size} variant={variant} palette={palette} />
    case 'autocomplete':
      return (
        <Field.Root>
          <Field.Label>Search your workspace</Field.Label>
          <Autocomplete.Root
            items={[
              'Design tokens',
              'Design review',
              'Development notes',
              'Product roadmap',
              'Project brief',
            ]}
            size={pass(size)}
            variant={pass(variant)}
            colorPalette={pass(palette)}
          >
            <Autocomplete.InputGroup>
              <Search size={14} className={css({ color: 'fg.subtle' })} />
              <Autocomplete.Input placeholder="Try “design”…" />
            </Autocomplete.InputGroup>
            <Autocomplete.Portal>
              <Autocomplete.Positioner sideOffset={6}>
                <Autocomplete.Popup>
                  <Autocomplete.Empty>
                    No suggestions. Keep typing your own search.
                  </Autocomplete.Empty>
                  <Autocomplete.List>
                    {(item: string) => (
                      <Autocomplete.Item key={item} value={item}>
                        {item}
                      </Autocomplete.Item>
                    )}
                  </Autocomplete.List>
                </Autocomplete.Popup>
              </Autocomplete.Positioner>
            </Autocomplete.Portal>
          </Autocomplete.Root>
          <Field.Description>Suggestions help. Your own words work, too.</Field.Description>
        </Field.Root>
      )
    case 'checkbox-group':
      return (
        <CheckboxGroup defaultValue={['design']} aria-label="Interests">
          {['Design', 'Engineering', 'Product'].map((name) => (
            <label className={s.labelRow} key={name}>
              <Checkbox.Root value={name.toLowerCase()}>
                <Checkbox.Indicator>
                  <Check size={12} />
                </Checkbox.Indicator>
              </Checkbox.Root>
              {name}
            </label>
          ))}
        </CheckboxGroup>
      )
    case 'fieldset':
      return (
        <Fieldset.Root variant={pass(variant)}>
          <Fieldset.Legend>A little about you</Fieldset.Legend>
          <Field.Root>
            <Field.Label>Display name</Field.Label>
            <Input defaultValue="Alex Kim" />
          </Field.Root>
          <Field.Root>
            <Field.Label>Role</Field.Label>
            <Input defaultValue="Designer & maker" />
          </Field.Root>
        </Fieldset.Root>
      )
    case 'form':
      return (
        <Form
          onSubmit={(event) => {
            event.preventDefault()
            setMessage('Your local preview is ready.')
          }}
        >
          <Field.Root name="name">
            <Field.Label>Your name</Field.Label>
            <Input required placeholder="Alex Kim" />
            <Field.Error match="valueMissing">We’d love to know your name.</Field.Error>
          </Field.Root>
          <Field.Root name="email">
            <Field.Label>Email</Field.Label>
            <Input type="email" required placeholder="alex@studio.design" />
            <Field.Error match="typeMismatch">Please check the email address.</Field.Error>
            <Field.Error match="valueMissing">An email address is needed.</Field.Error>
          </Field.Root>
          <Button type="submit">Create your profile</Button>
          {message && (
            <p role="status" className={s.small}>
              {message}
            </p>
          )}
        </Form>
      )
    case 'otp-field':
      return (
        <Field.Root>
          <Field.Label>Verification code</Field.Label>
          <OtpField.Root
            length={6}
            size={pass(size)}
            variant={pass(variant)}
            onValueComplete={() => setMessage('All 6 digits entered. This is a local demo.')}
          >
            <OtpField.Input aria-label="Digit 1" />
            <OtpField.Input aria-label="Digit 2" />
            <OtpField.Input aria-label="Digit 3" />
            <OtpField.Separator />
            <OtpField.Input aria-label="Digit 4" />
            <OtpField.Input aria-label="Digit 5" />
            <OtpField.Input aria-label="Digit 6" />
          </OtpField.Root>
          <Field.Description>Try pasting a 6-digit code.</Field.Description>
          {message && (
            <p role="status" className={s.small}>
              {message}
            </p>
          )}
        </Field.Root>
      )
    case 'toast':
      return <ToastDemo />
    case 'meter':
      return (
        <Meter.Root value={7.2} min={0} max={10} size={pass(size)} variant={pass(variant)}>
          <Meter.Label>Storage used</Meter.Label>
          <Meter.Value>{(_value, value) => `${value} / 10 GB`}</Meter.Value>
          <Meter.Track>
            <Meter.Indicator />
          </Meter.Track>
        </Meter.Root>
      )
    case 'collapsible':
      return (
        <Collapsible.Root>
          <Collapsible.Trigger>
            Project files
            <ChevronDown />
          </Collapsible.Trigger>
          <div
            className={css({
              border: '1px solid',
              borderColor: 'border',
              borderRadius: 'l2',
              px: '3',
              py: '2',
              fontSize: 'xs',
              fontFamily: 'mono',
            })}
          >
            README.md
          </div>
          <Collapsible.Panel>
            <div className={css({ pt: '2' })}>
              {['design-tokens.ts', 'components.tsx', 'a-good-idea.md'].map((name) => (
                <div
                  key={name}
                  className={css({ py: '2', px: '3', fontSize: 'xs', fontFamily: 'mono' })}
                >
                  {name}
                </div>
              ))}
            </div>
          </Collapsible.Panel>
        </Collapsible.Root>
      )
    case 'toolbar':
      return (
        <Toolbar.Root aria-label="Editor toolbar" size={pass(size)} variant={pass(variant)}>
          <Toolbar.Group>
            <Toolbar.Button render={<Toggle />} aria-label="Bold">
              <Bold size={16} />
            </Toolbar.Button>
            <Toolbar.Button render={<Toggle />} aria-label="Italic">
              <Italic size={16} />
            </Toolbar.Button>
          </Toolbar.Group>
          <Toolbar.Separator />
          <Toolbar.Button
            aria-label="Copy selection"
            onClick={() => setMessage('Selection copied in this demo.')}
          >
            <Copy size={16} />
          </Toolbar.Button>
          <Toolbar.Link href="#/components">
            Components
            <Link size={13} />
          </Toolbar.Link>
          {message && (
            <span role="status" className={css({ srOnly: true })}>
              {message}
            </span>
          )}
        </Toolbar.Root>
      )
    case 'context-menu':
      return (
        <div className={s.stack}>
          <ContextMenu.Root size={pass(size)} colorPalette={pass(palette)}>
            <ContextMenu.Trigger
              tabIndex={0}
              className={css({
                border: '1px dashed',
                borderColor: 'gray.outline.border',
                borderRadius: 'l3',
                p: '10',
                textAlign: 'center',
                color: 'fg.muted',
                fontSize: 'sm',
                focusVisibleRing: 'outside',
              })}
            >
              Right click here.
              <br />
              <span className={s.small}>Or focus and press Shift + F10.</span>
            </ContextMenu.Trigger>
            <ContextMenu.Portal>
              <ContextMenu.Positioner>
                <ContextMenu.Popup>
                  <ContextMenu.Item onClick={() => setMessage('Duplicated in this demo.')}>
                    <Copy />
                    Duplicate
                  </ContextMenu.Item>
                  <ContextMenu.Item onClick={() => setMessage('Renamed in this demo.')}>
                    <Settings2 />
                    Rename
                  </ContextMenu.Item>
                  <ContextMenu.Separator />
                  <ContextMenu.Item disabled>Move to another team</ContextMenu.Item>
                </ContextMenu.Popup>
              </ContextMenu.Positioner>
            </ContextMenu.Portal>
          </ContextMenu.Root>
          {message && (
            <p role="status" className={s.small}>
              {message}
            </p>
          )}
        </div>
      )
    case 'drawer':
      return <DrawerDemo size={size} />
    case 'preview-card':
      return (
        <PreviewCard.Root size={pass(size)}>
          <p className={s.small}>
            Made for a little more{' '}
            <PreviewCard.Trigger
              href="#/principles"
              className={css({
                color: 'colorPalette.plain.fg',
                textDecoration: 'underline',
                textUnderlineOffset: '3px',
              })}
            >
              possibility
            </PreviewCard.Trigger>
            .
          </p>
          <PreviewCard.Portal>
            <PreviewCard.Positioner sideOffset={8}>
              <PreviewCard.Popup>
                <div className={s.glyph}>
                  <Layers />
                </div>
                <h3 className={css({ fontWeight: 'medium', mt: '3' })}>
                  A foundation, not a ceiling.
                </h3>
                <p
                  className={css({ fontSize: 'xs', color: 'fg.muted', lineHeight: '1.7', mt: '2' })}
                >
                  Own every line. Shape every detail. Make something that feels like you.
                </p>
              </PreviewCard.Popup>
            </PreviewCard.Positioner>
          </PreviewCard.Portal>
        </PreviewCard.Root>
      )
    case 'scroll-area':
      return (
        <ScrollArea.Root
          className={css({
            height: '220px',
            border: '1px solid',
            borderColor: 'border',
            borderRadius: 'l3',
            bg: 'gray.surface.bg',
          })}
        >
          <ScrollArea.Viewport role="region" aria-label="Project list">
            <ScrollArea.Content className={css({ p: '4' })}>
              <h3 className={css({ fontWeight: 'medium', mb: '4' })}>
                A few things in the making.
              </h3>
              {[
                'A fresh perspective',
                'Studio North',
                'The next chapter',
                'An open canvas',
                'Something good',
                'Small beginnings',
                'A better everyday',
                'New possibilities',
                'A quiet moment',
                'The long view',
                'Good company',
                'Room to grow',
              ].map((name, i) => (
                <div
                  key={name}
                  className={css({
                    py: '3',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '3',
                    borderBottomWidth: '1px',
                    borderBottomStyle: 'solid',
                    borderColor: 'border',
                    fontSize: 'xs',
                  })}
                >
                  <span className={css({ fontFamily: 'mono', color: 'fg.muted' })}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {name}
                </div>
              ))}
            </ScrollArea.Content>
          </ScrollArea.Viewport>
          <ScrollArea.Scrollbar>
            <ScrollArea.Thumb />
          </ScrollArea.Scrollbar>
          <ScrollArea.Corner />
        </ScrollArea.Root>
      )
    case 'menubar':
      return (
        <div className={s.stack}>
          <Menubar aria-label="Application menu" variant={pass(variant)}>
            {['File', 'Edit', 'View'].map((name) => (
              <Menu.Root key={name}>
                <Menu.Trigger render={<Button variant="plain" colorPalette="gray" size="sm" />}>
                  {name}
                </Menu.Trigger>
                <Menu.Portal>
                  <Menu.Positioner sideOffset={6}>
                    <Menu.Popup>
                      {(name === 'File'
                        ? ['New project', 'Open project', 'Save']
                        : name === 'Edit'
                          ? ['Undo', 'Redo', 'Find']
                          : ['Zoom in', 'Zoom out', 'Reset zoom']
                      ).map((action) => (
                        <Menu.Item
                          key={action}
                          onClick={() => setMessage(`${action} selected in this demo.`)}
                        >
                          {action}
                        </Menu.Item>
                      ))}
                    </Menu.Popup>
                  </Menu.Positioner>
                </Menu.Portal>
              </Menu.Root>
            ))}
          </Menubar>
          {message && (
            <p role="status" className={s.small}>
              {message}
            </p>
          )}
        </div>
      )
    case 'navigation-menu':
      return (
        <NavigationMenu.Root aria-label="Product navigation">
          <NavigationMenu.List>
            <NavigationMenu.Item>
              <NavigationMenu.Trigger>
                Explore
                <NavigationMenu.Icon>
                  <ChevronDown />
                </NavigationMenu.Icon>
              </NavigationMenu.Trigger>
              <NavigationMenu.Content>
                <NavigationMenu.Link href="#/components">The components</NavigationMenu.Link>
                <NavigationMenu.Link href="#/theming">Your theme</NavigationMenu.Link>
                <NavigationMenu.Link href="#/principles">The philosophy</NavigationMenu.Link>
              </NavigationMenu.Content>
            </NavigationMenu.Item>
            <NavigationMenu.Item>
              <NavigationMenu.Link href="#/installation">Get started</NavigationMenu.Link>
            </NavigationMenu.Item>
          </NavigationMenu.List>
          <NavigationMenu.Portal>
            <NavigationMenu.Positioner sideOffset={8}>
              <NavigationMenu.Popup>
                <NavigationMenu.Viewport />
              </NavigationMenu.Popup>
            </NavigationMenu.Positioner>
          </NavigationMenu.Portal>
        </NavigationMenu.Root>
      )
    default:
      return <NativeDemo id={id} size={size} variant={variant} />
  }
}
